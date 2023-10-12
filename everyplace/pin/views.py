from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import status
from django.db.models import Q
from django.http import QueryDict
from .models import Pin, PinContent
from .serializers import PinSerializer, PinContentSerializer, CombinedCreatePinSerializer, PaginatedPinResponseSerializer
from .paginations import CustomPagination
import ssl
import json
import urllib3
import requests
from bs4 import BeautifulSoup
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiExample


class CustomHttpAdapter (requests.adapters.HTTPAdapter):

    def __init__(self, ssl_context=None, **kwargs):
        self.ssl_context = ssl_context
        super().__init__(**kwargs)

    def init_poolmanager(self, connections, maxsize, block=False):
        self.poolmanager = urllib3.poolmanager.PoolManager(
            num_pools=connections, maxsize=maxsize,
            block=block, ssl_context=self.ssl_context)


def get_legacy_session():
    ctx = ssl.create_default_context(ssl.Purpose.SERVER_AUTH)
    ctx.options |= 0x4  # OP_LEGACY_SERVER_CONNECT
    session = requests.session()
    session.mount('https://', CustomHttpAdapter(ctx))
    return session


# 핀 장소의 대표 이미지 가져오는 함수
def get_thumbnail_img(place_id):
    session = get_legacy_session()
    url = f"http://place.map.kakao.com/photolist/v/{place_id}"

    res = session.get(url)
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
    session = get_legacy_session()
    url = f"https://place.map.kakao.com/menuinfo/v/{place_id}"

    res = session.get(url)
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


class PinDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(
        summary="핀 상세정보 조회 API",
        description="""이 엔드포인트는 모든 사용자가 존재하는 핀의 상세정보를 볼 수 있게 해줍니다. 비인증 사용자도 모든 핀을 볼 수 있습니다.\n\n 각 핀은 카카오api에서 제공하는 고유의 place_id를 통해 구분되어, 특정 place_id 값을 제공하면 해당 place_id에 대응하는 핀의 상세정보를 제공합니다. 이 상세정보에는 이 핀이 들어있는 보드들의 리스트, 핀의 장소명, 카테고리, 도로명주소, 지번주소, 좌표값, 썸네일 이미지 등이 포함됩니다. 상세정보를 응답받을 때 place_id에 대응하는 장소의 카카오맵 상세 페이지에 메뉴가 존재한다면 크롤링을 통해 즉석으로 메뉴 정보를 가져와서 표시합니다.\n\n 또한 핀과 함께 보여지는 핀 콘텐츠(코멘트)에는 페이지네이션에 적용되어 있어 한 페이지에 3개의 핀 콘텐츠까지 보여집니다. 이전, 다음 페이지로 이동해서 나머지 핀 콘텐츠를 볼 수 있습니다.
        """,
        responses={
            200: OpenApiResponse(description="조회 성공", response=PaginatedPinResponseSerializer),
            404: OpenApiResponse(description="해당 핀이 존재하지 않습니다."),
        },
    )
    # ## pin 상세정보 조회
    def get(self, request, place_id):
        try:
            pin = Pin.objects.get(place_id=place_id, is_deleted=False)
        except Pin.DoesNotExist:
            return Response({'error': '해당 핀이 존재하지 않습니다.'}, status=status.HTTP_404_NOT_FOUND)

        # pin에 포함된 pin content 갯수 세기
        pin_content_count = PinContent.objects.filter(
            pin_id=pin).count()

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


class PinCreateView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(
        summary="핀 생성 API",
        description="""이 엔드포인트는 인증된 사용자가 새로운 장소에 대한 핀을 생성하도록 합니다. 요청 본문에는 'board_id', 'category', 'place_id', 'title', 'new_address', 'old_address', 'lat_lng' 필드가 반드시 포함되어야 합니다. 또한 동시에 생성되는 핀 콘텐츠(코멘트) 내용인 'text'와 첨부 사진인 'photo' 필드는 각각 포함시키거나 포함시키지 않을 수 있습니다. photo 필드에 이미지 파일 데이터를 제공하려면 multipart/form-data 형식으로 전송해야 합니다.\n\n 요청이 들어오면 요청 본문의 'place_id' 값과 같은 값을 지닌 핀이 이미 존재하는지 확인한 후, 존재한다면 그 핀에 'board_id'의 보드를 추가하고 핀 콘텐츠를 생성하고 기존의 핀과 생성된 핀 콘텐츠 객체를 반환합니다. 존재하지 않는다면 요청 본문의 값을 토대로 핀과 핀 콘텐츠를 새롭게 생성하고 생성된 핀과 핀 콘텐츠 객체를 반환합니다. 새로운 핀을 생성 시 place_id에 대응하는 장소의 카카오맵 상세 페이지에 대표 이미지가 존재한다면 크롤링을 통해 가져와 'thumbnail_img'필드에 저장합니다. 생성 과정에서 문제가 생겼다면 오류 메시지를 반환합니다.""",
        request=CombinedCreatePinSerializer,
        examples=[
            OpenApiExample(
                request_only=True,
                summary="올바른 요청 예시",
                description="board_id: 핀을 저장할 보드의 id\n\ncategory: 장소의 카테고리 분류(카카오 맵 API 제공)\n\nplace_id: 장소의 고유 id(카카오 맵 API 제공)\n\ntitle: 장소의 이름(카카오 맵 API 제공)\n\nnew_address: 장소의 도로명주소(카카오 맵 API 제공)\n\nold_address: 장소의 지번주소(카카오 맵 API 제공)\n\n lat_lng: 장소의 위도,경도 (카카오 맵 API 제공, 위도와 경도를 붙여놓은 값)\n\ntext: 핀 콘텐츠(코멘트)에 입력할 짧은 글 (선택사항이므로 입력하지 않아도 됩니다)\n\nphoto: 핀 콘텐츠(코멘트)에 넣을 사진 파일(경로) (선택사항이므로 첨부하지 않아도 됩니다)",
                name="success_example",
                value={
                    "board_id": 12,
                    "category": "카페",
                    "place_id": "123123",
                    "title": "카페 이름",
                    "new_address": "서울 마포구 도로명로 123-4",
                    "old_address": "서울 마포구 지번동 123-45",
                    "lat_lng": "37.123123,127.456456",
                    "text": "그 장소에 대한 감상평 또는 메모",
                    "photo": "실제 요청에서는 이곳에 이미지 파일 데이터를 첨부합니다"
                }
            )
        ],
        responses={
            200: OpenApiResponse(description="해당 장소의 핀을 사용합니다.", response=CombinedCreatePinSerializer),
            201: OpenApiResponse(description="새로운 핀 및 핀 콘텐츠 생성 성공", response=CombinedCreatePinSerializer),
            400: OpenApiResponse(description="잘못된 입력값입니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
        }
    )
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
                if request_data.get('photo') is None and request_data.get('text') is None:
                    pin_content = pin_content_serializer.save(
                        pin_id=existing_pin, is_deleted=True)
                else:
                    pin_content = pin_content_serializer.save(
                        pin_id=existing_pin)

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
        if isinstance(request_data, QueryDict):
            request_data["board_id"] = int(request_data.getlist("board_id")[0])
        else:
            request_data["board_id"] = [request_data["board_id"]]
        request_data["thumbnail_img"] = thumbnail_img
        pin_serializer = PinSerializer(data=request_data)
        pin_content_serializer = PinContentSerializer(data=request_data)

        if pin_serializer.is_valid():
            pin = pin_serializer.save()

            # 생성된 pin과 연결된 pin content 생성
            if pin_content_serializer.is_valid():
                pin_content_data = pin_content_serializer.validated_data
                # 텍스트와 사진이 둘 다 없는 경우 is_deleted 값을 True로 설정
                if request_data.get('photo') is None and request_data.get('text') is None:
                    pin_content = pin_content_serializer.save(
                        pin_id=pin, is_deleted=True)
                else:
                    pin_content = pin_content_serializer.save(pin_id=pin)

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
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(
        summary="핀 콘텐츠(코멘트) 수정 API",
        description="""이 엔드포인트는 인증된 사용자가 자신이 작성한 핀 콘텐츠(코멘트)를 수정하는 것을 허용합니다. 요청 본문에는 'text', 'photo' 등의 필드가 포함될 수 있습니다. 사용자는 코멘트 내용인 text와 첨부 사진인 photo 중 하나의 값만을 수정하거나 둘 다 수정할 수 있습니다. photo 필드에 이미지 파일 데이터를 제공하려면 multipart/form-data 형식으로 전송해야 합니다. 성공적으로 핀 콘텐츠가 수정되면 수정된 PinContent 객체를 반환하고, 그렇지 않으면 오류 메시지를 반환합니다.""",
        request=PinContentSerializer,
        examples=[
            OpenApiExample(
                request_only=True,
                summary="올바른 요청 예시",
                description="text: 핀 콘텐츠(코멘트)에 입력할 짧은 글 (입력하지 않는다면 원래 내용이 유지됩니다)\n\nphoto: 핀 콘텐츠(코멘트)에 넣을 사진 파일(경로) (첨부하지 않는다면 원래 파일이 유지됩니다)",
                name="success_example",
                value={
                    "text": "그 장소에 대한 감상평 또는 메모의 수정사항",
                    "photo": "실제 요청에서는 이곳에 이미지 파일 데이터를 첨부합니다"
                }
            )
        ],
        responses={
            200: OpenApiResponse(description="수정 성공", response=PinContentSerializer),
            400: OpenApiResponse(description="잘못된 입력값입니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
            403: OpenApiResponse(description="핀 콘텐츠를 수정할 권한이 없습니다."),
            404: OpenApiResponse(description="해당 핀 콘텐츠가 존재하지 않습니다.")
        }
    )
    # ## pin content 수정
    def put(self, request, pk):
        try:
            pin_content = PinContent.objects.get(pk=pk)
        except PinContent.DoesNotExist:
            return Response({'error': '해당 핀 콘텐츠가 존재하지 않습니다.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user == pin_content.user_id:
            serializer = PinContentSerializer(
                pin_content, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save(is_deleted=False)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': '핀 콘텐츠를 수정할 권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)

    @extend_schema(
        summary="핀 콘텐츠(코멘트) 삭제 API",
        description="""이 엔드포인트는 인증된 사용자가 자신이 작성한 핀 콘텐츠(코멘트)를 삭제하는 것을 허용합니다. 삭제 작업은 실제로 데이터베이스에서 핀 콘텐츠를 제거하는 것이 아니라 'is_deleted' 필드의 값을 True로 변경하는 방식입니다. 이 방식은 실수로 인한 데이터 손실을 방지하고, 필요한 경우 데이터 복구를 용이하게 합니다.""",
        responses={
            204: OpenApiResponse(description="핀 콘텐츠를 삭제 처리하였습니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
            403: OpenApiResponse(description="핀 콘텐츠를 삭제할 권한이 없습니다."),
            404: OpenApiResponse(description="해당 핀 콘텐츠가 존재하지 않습니다.")
        }
    )
    # ## pin content 삭제
    def delete(self, request, pk):
        try:
            pin_content = PinContent.objects.get(pk=pk, is_deleted=False)
        except PinContent.DoesNotExist:
            return Response({'error': '해당 핀 콘텐츠가 존재하지 않습니다.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user == pin_content.user_id:
            pin_content.is_deleted = True
            pin_content.photo = ''
            pin_content.text = None
            pin_content.save()

            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "핀 콘텐츠를 삭제할 권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)


# ## pin comment 목록 조회
class PinCommentView(APIView):
    def get(self, request):
        user = request.user

        # 나의 모든 핀 코멘트 목록
        all_pincomments = PinContent.objects.filter(
            user_id=user).order_by('-updated_at')
        serializer = PinContentSerializer(all_pincomments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


# ## 핀이 저장되지 않은 장소에서의 추가 정보 제공
class AdditionalInfo(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, requset, place_id):
        thumbnail_img = get_thumbnail_img(place_id)
        menu = get_menu(place_id)

        return Response({"thumbnail_img": thumbnail_img, "menu": menu})
