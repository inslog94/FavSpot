from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Pin, PinContent
from .serializers import PinSerializer, PinContentSerializer
from .paginations import CustomPagination
import json
import requests
from bs4 import BeautifulSoup


# Create your views here.
# 핀 장소의 대표 이미지 가져오는 함수
def get_thumbnail_img(place_id):
    url = f"https://place.map.kakao.com/photolist/v/{place_id}"

    res = requests.get(url)
    soup = BeautifulSoup(res.text, 'lxml')
    json_data = soup.find("p").text

    # JSON 데이터 파싱
    data = json.loads(json_data)
    # "list" 하위 첫번째 사진의 url 값 가져오기
    try:
        thumbnail_img = data["photoViewer"]["list"][0]['url']
    except KeyError:
        thumbnail_img = ''

    return thumbnail_img


# 핀 장소의 메뉴 가져오는 함수
def get_menu(place_id):
    url = f"https://place.map.kakao.com/menuinfo/v/{place_id}"

    res = requests.get(url)
    soup = BeautifulSoup(res.text, 'lxml')
    json_data = soup.find("p").text

    # JSON 데이터 파싱
    data = json.loads(json_data)
    # "topList" or "bottomList" 하위 메뉴 리스트 가져오기
    try:
        menu_raw_data = data["menuInfo"]["topList"]
    except KeyError:
        menu_raw_data = data["menuInfo"].get("bottomList", None)

    if not menu_raw_data:
        return menu_raw_data

    menu = []
    for i in menu_raw_data:
        menu.append({"price": i.get("price", ""), "menu": i.get(
            "menu", ""), "img": i.get("img", "")})

    return menu


class PinView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    # ## pin 상세정보 조회

    def get(self, request, place_id):
        pin = get_object_or_404(
            Pin, place_id=place_id, is_deleted=False)

        # pin에 포함된 pin content 갯수 세기
        pin_content_count = PinContent.objects.filter(
            pin_id=pin, is_deleted=False).count()

        # 페이지네이션 적용
        paginator = CustomPagination()
        paginator.page_size = 3
        # pin content 중 내용이 없는 객체는 보여주지 않음. 최신순으로 정렬
        pin_contents = PinContent.objects.filter(
            pin_id=pin, is_deleted=False).exclude(Q(text__isnull=True, photo='')).order_by('-created_at')

        # 쿼리셋 페이지네이트
        pin_contents_page = paginator.paginate_queryset(pin_contents, request)

        pin_serializer = PinSerializer(pin)
        pin_contents_serializer = PinContentSerializer(
            pin_contents_page, many=True)

        # place_id로 메뉴 정보 가져오기
        menu = get_menu(pin.place_id)

        return paginator.get_paginated_response({
            'pin': pin_serializer.data,
            'pin_contents': pin_contents_serializer.data,
            'menu': menu,
            'pin_content_count': pin_content_count
        })

    # ## pin 생성
    def post(self, request):
        request_data = request.data.copy()
        # 로그인 되어있는 아이디로 pin content 생성
        request_data['user_id'] = request.user.id

        # request에서 필요한 데이터 가져오기
        board_id = request_data.get('board_id')
        place_id = request_data.get('place_id')

        # place_id를 사용해서 thumbnail_img값 얻기
        thumbnail_img = get_thumbnail_img(place_id)

        # 상호명, 좌표 기준으로 같은 pin이 있는지 확인
        existing_pin = Pin.objects.filter(place_id=place_id).first()

        # pin이 이미 존재할 시 board에 추가
        if existing_pin:
            existing_pin.board_id.add(board_id)
            existing_pin.save()
            pin_serializer = PinSerializer(existing_pin)

            # 존재하는 pin과 연결된 pin content 생성
            pin_content_serializer = PinContentSerializer(data=request_data)
            if pin_content_serializer.is_valid():
                pin_content = pin_content_serializer.save(pin_id=existing_pin)

                return Response({
                    'pin': pin_serializer.data,
                    'pin_content': pin_content_serializer.data,
                    'message': '해당 장소의 핀을 사용합니다.'
                }, status=status.HTTP_200_OK)
            return Response({
                'pin_errors': {},
                'pin_content_errors': pin_content_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        # pin이 존재하지 않을 시 새로운 pin 생성
        # board_id를 list형태로 변환
        request_data["board_id"] = [request_data["board_id"]]
        request_data["thumbnail_img"] = thumbnail_img
        pin_serializer = PinSerializer(data=request_data)
        pin_content_serializer = PinContentSerializer(data=request_data)

        if pin_serializer.is_valid():
            pin = pin_serializer.save()

            # 생성된 pin과 연결된 pin content 생성
            if pin_content_serializer.is_valid():
                pin_content_data = pin_content_serializer.validated_data
                pin_content_data['pin_id'] = pin
                pin_content = pin_content_serializer.create(pin_content_data)

                return Response({
                    'pin': PinSerializer(pin).data,
                    'pin_content': PinContentSerializer(pin_content).data
                }, status=status.HTTP_201_CREATED)
            return Response({
                'pin_errors': {},
                'pin_content_errors': pin_content_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'pin_errors': pin_serializer.errors,
            'pin_content_errors': {}
        }, status=status.HTTP_400_BAD_REQUEST)


class PinContentView(APIView):
    # ## pin content 수정
    def put(self, request, pk):
        pin_content = get_object_or_404(PinContent, pk=pk)

        if request.user == pin_content.user_id:
            serializer = PinContentSerializer(
                pin_content, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "핀 컨텐츠를 수정할 권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

    # ## pin content 삭제
    def delete(self, request, pk):
        pin_content = get_object_or_404(PinContent, pk=pk)

        if request.user == pin_content.user_id:
            pin_content.is_deleted = True
            pin_content.save()

            return Response({"detail": "핀 컨텐츠를 삭제 처리하였습니다."}, status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "핀 컨텐츠를 삭제할 권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)
