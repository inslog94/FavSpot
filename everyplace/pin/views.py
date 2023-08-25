from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Pin, PinContent
from .serializers import PinSerializer, PinContentSerializer
from rest_framework.pagination import PageNumberPagination


# Create your views here.
class PinView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    # ## pin 상세정보 조회
    def get(self, request, title, lat_lng):
        pin = get_object_or_404(
            Pin, title=title, lat_lng=lat_lng, is_deleted=False)

        # pin에 포함된 pin content 갯수 세기
        pin_content_count = PinContent.objects.filter(
            pin_id=pin, is_deleted=False).count()

        # 페이지네이션 적용
        paginator = PageNumberPagination()
        paginator.page_size = 3
        # pin content 중 내용이 없는 객체는 보여주지 않음. 최신순으로 정렬
        pin_contents = PinContent.objects.filter(
            pin_id=pin, is_deleted=False).exclude(Q(text__isnull=True, photo='')).order_by('-created_at')

        # 쿼리셋 페이지네이트
        pin_contents_page = paginator.paginate_queryset(pin_contents, request)

        pin_serializer = PinSerializer(pin)
        pin_contents_serializer = PinContentSerializer(
            pin_contents_page, many=True)

        return paginator.get_paginated_response({
            'pin': pin_serializer.data,
            'pin_contents': pin_contents_serializer.data,
            'pin_content_count': pin_content_count
        })

    # ## pin 생성
    def post(self, request):
        # 로그인 되어있는 아이디로 pin content 생성
        request.data['user_id'] = request.user.id

        # request에서 필요한 데이터 가져오기
        title = request.data.get('title')
        lat_lng = request.data.get('lat_lng')
        board_id = request.data.get('board_id')

        # 상호명, 좌표 기준으로 같은 pin이 있는지 확인
        existing_pin = Pin.objects.filter(title=title, lat_lng=lat_lng).first()

        # pin이 이미 존재할 시 board에 추가
        if existing_pin:
            existing_pin.board_id.add(board_id)
            existing_pin.save()
            pin_serializer = PinSerializer(existing_pin)

            # 존재하는 pin과 연결된 pin content 생성
            pin_content_serializer = PinContentSerializer(data=request.data)
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
        request_data = request.data.copy()
        request_data["board_id"] = [request_data["board_id"]]
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
