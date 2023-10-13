from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, serializers, viewsets
from .models import Board, BoardTag, BoardComment, BoardLike
from pin.models import Pin
from user.models import User
from .serializers import BoardSerializer, BoardTagSerializer, BoardCommentSerializer, BoardLikeSerializer
from pin.serializers import SimplePinSerializer, PinSerializer
from user.serializers import BoardPinSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.decorators import authentication_classes, permission_classes
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes, OpenApiResponse, extend_schema_view, OpenApiExample
from rest_framework.decorators import api_view
from drf_spectacular.types import OpenApiTypes
from django.core.exceptions import ObjectDoesNotExist
from pin.paginations import CustomPagination


# Board View
class BoardView(APIView):
    ## 모든 사용자가 조회 가능 
    permission_classes = [IsAuthenticatedOrReadOnly]

    ## 특정 보드 상세 조회 메소드
    def get_object(self, pk):
        try:
            return Board.objects.get(pk=pk, is_deleted=False)
        
        except Board.DoesNotExist:
            return None
        
    ## 로그인 된 유저의 좋아요 여부 판단 메소드
    def is_board_liked_by_user(self,user_id ,board_id):
        board_like = BoardLike.objects.filter(user_id=user_id, board_id=board_id, is_deleted=False)

        if board_like.exists():
            return True, board_like.values('id')[0]['id']
    
        return False, None

    @extend_schema(
        summary="보드 목록 및 상세 정보 조회 API",
        description="""이 엔드포인트는 인증된 사용자가 자신이 작성한 모든 보드와 다른 사용자가 작성하고 공개 설정한 보드를 볼 수 있게 해줍니다. 비인증 사용자는 공개 설정된 보드만 볼 수 있습니다.\n\n 특정 pk 값을 제공하면, 해당 pk에 대응하는 특정 게시판의 상세 정보를 제공합니다. 이 때 반환되는 정보에는 게시판 정보 외에도 연결된 모든 핀(Pin)과 댓글(Comment), 그리고 로그인 한 유저가 해당 게시판을 좋아하는지 여부와 좋아요 개수 등이 포함됩니다.
        """,
        # parameters=[
        #     OpenApiParameter(name='id', description='특정 보드의 ID (pk)', type=int, location="path", required=False)
        # ],
        responses={
            200: OpenApiResponse(description="성공적으로 조회하였습니다.", response=BoardPinSerializer(many=True)),
            
            # 200: OpenApiResponse(description="조회 성공", examples={
            #     "application/json": {
            #         "board": BoardSerializer().data,
            #         "user_liked": True,
            #         "likes_count": 5,
            #         "pins": PinSerializer(many=True).data,
            #         "comments": BoardCommentSerializer(many=True).data
            #     }
            # }),
            404: OpenApiResponse(description="해당 보드가 존재하지 않습니다.")
        },
    )
    def get(self, request, pk=None):

        ## 보드 전체 목록 조희
        if not pk:
            # 현재 로그인한 사용자 정보
            user = request.user

            # 정렬 기준
            # 기본값으로 'created' 설정
            sort = request.GET.get('sort', 'created')

            if user.is_authenticated:
                # 사용자와 보드 작성자가 같은 경우 공개/비공개에 상관 없이 사용자의 모든 보드 출력
                # 사용자와 보드 작성자가 다른 경우 공개 보드만 보드만 출력
                boards = Board.objects.filter(Q(user_id=user) | Q(is_public=True), is_deleted=False)
            else:
                # 로그인하지 않은 사용자는 공개 보드만 출력
                boards = Board.objects.filter(is_public=True, is_deleted=False)

            # 정렬 기능
            # 핀 개수 기준으로 정렬
            if sort == 'pin':
                boards = boards.annotate(pin_count=Count('pin')).filter(pin_count__gt=0).order_by('-pin_count')

            # 좋아요 개수 기준으로 정렬
            elif sort == 'like':
                boards = boards.annotate(like_count=Count('boardlike'), pin_count=Count('pin')).filter(pin_count__gt=0).order_by('-like_count')

            # 최신순 기준으로 정렬
            else:
                boards = boards.annotate(pin_count=Count('pin')).filter(pin_count__gt=0).order_by('-created_at')
    
            serializer = BoardPinSerializer(boards, many=True)

            if request.user.is_authenticated:
                request_user = {"email": str(request.user), "requestUserPk": request.user.id, "profileImg": "https://favspot-fin.s3.amazonaws.com/" + str(request.user.profile_img)}
            else:
                request_user = {}
            
            return Response({'request_user': request_user, "boards": serializer.data}, status=status.HTTP_200_OK)
        
        ## 특정 보드 상세 조회
        else:
            board = self.get_object(pk)

            if board is None or board.is_deleted:
                return Response({'error': '해당 보드가 존재하지 않습니다.'}, status=status.HTTP_404_NOT_FOUND)
            
            # 해당 보드와 연결된 모든 핀(Pin) 객체들 반환
            # 최신순으로 정렬
            pins = Pin.objects.filter(board_id=pk).order_by('-created_at')

            # 해당 보드와 연결된 모든 댓글(Comment) 객체들 반환
            # 최신순으로 정렬
            comments = BoardComment.objects.filter(board_id=pk, is_deleted=False).order_by('-created_at')

            # 해당 보드에 대한 로그인된 유저의 좋아요 여부 출력
            # is_board_liked_by_user 메소드의 반환 값으로 확인
            user_liked = self.is_board_liked_by_user(request.user.id, pk)

            # 해당 보드에 대한 좋아요 개수 출력
            likes_count = BoardLike.objects.filter(board_id=pk, is_deleted=False).count()
            
            pin_serializer = PinSerializer(pins, many=True)
            comment_serializer = BoardCommentSerializer(comments, many=True)
            board_serializer = BoardSerializer(board)
            
            if request.user.is_authenticated:
                request_user = {"email": str(request.user), "requestUserPk": request.user.id, "profileImg": "https://favspot-fin.s3.amazonaws.com/" + str(request.user.profile_img)}
            else:
                request_user = {}
            
            data = {
                'request_user': request_user,
                'board': board_serializer.data,
                'user_liked': user_liked,
                'likes_count': likes_count,
                'pins': pin_serializer.data,
                'comments': comment_serializer.data
            }

            return Response(data)

    @extend_schema(
        summary="보드 생성 API",
        description="""이 엔드포인트는 인증된 사용자를 위해 새로운 보드를 생성합니다. 요청 본문에는 'title'과 'is_public', is_deleted 필드가 포함되어야 합니다. 이 때 is_public은 True, is_deleted는 false가 기본값입니다. 또한  선택적으로 'tags' 필드를 포함시킬 수 있으며, 이는 태그의 배열입니다. 성공적으로 보드가 생성되면 생성된 Board 객체를 반환하고, 그렇지 않으면 오류 메시지를 반환합니다.""",
        request=BoardSerializer,
        examples=[
            OpenApiExample(
                request_only=True,
                name = "success_example",
                summary = "올바른 요청 예시",
                description = "title: 보드의 이름\n\n is_public: 보드의 공개/비공개 설정 (기본값은 True입니다.)\n\n tags: 보드에 등록될 태그 (선택사항이므로 입력하지 않아도됩니다.)",
                value = {
                    "title": "새로운 보드 이름", 
                    "is_public": True,
                    "tags": ["태그1", "태그2"]
                }
            )
        ],
        responses={
            201: OpenApiResponse(description="성공적으로 보드가 생성되었습니다.", response=BoardSerializer),
            400: OpenApiResponse(description="잘못된 입력값 입니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다.")
        }
    )
    ## 보드 생성
    def post(self, request):
        data = request.data.copy()

        tags_data = None
        if 'tags' in data:
            tags_data = data.pop('tags')

        data['user_id'] = request.user.id

        serializer = BoardSerializer(data=data)

        if serializer.is_valid():
            board = serializer.save()

            tags = []
            
            if tags_data:
                for tag_data in tags_data:
                    # 기존 태그 테이블에 태그가 있는지 확인
                    # 있다면 기존 유지, 없으면 생성
                    tag, created = BoardTag.objects.get_or_create(content=tag_data.strip())
                    tags.append(tag)
                
                board.tags.set(tags)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'error': '잘못된 입력값 입니다.',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
    @extend_schema(
        summary="보드 수정 API",
        description="""이 엔드포인트는 인증된 사용자가 자신이 작성한 보드를 수정하는 것을 허용합니다. 요청 본문에는 'title', 'is_public' 등의 필드가 포함될 수 있습니다. 이 때, is_public은 선택적 필드로, 공개 여부를 나타냅니다. 사용자는 is_public을 true 또는 false로 바꾸어 공개 여부를 수정할 수 있습니다. 또한, 선택적으로 'tags' 필드를 포함시킬 수 있는데, 이는 태그의 배열입니다. 사용자는 배열에 태그를 문자열 형태로 담아 원하는 태그를 추가하거나 삭제할 수 있습니다. 보드에 연결된 핀도 요청 본문에서 제공되는 새로운 핀 배열에 따라 삭제할 수 있습니다. 성공적으로 보드가 수정되면 수정된 Board 객체를 반환하고, 그렇지 않으면 오류 메시지를 반환합니다.""",
        request=BoardSerializer,
        parameters=[
            OpenApiParameter(name='id', description='특정 보드의 ID (PK)', type=int, location="path", required=False)
        ],
        examples=[
            OpenApiExample(
                request_only=True,
                summary = "올바른 요청 예시",
                description = "title: 수정할 보드의 이름\n\n is_public: 보드의 공개/비공개 설정 수정\n\n tags: 보드에 등록될 태그 수정",
                name = "success_example",
                value = {
                    "title": "수정할 보드 이름", 
                    "is_public": False,
                    "tags": ["태그2", "태그3"]
                }
            )
        ],
        responses={
            200: OpenApiResponse(description="성공적으로 보드가 수정되었습니다.", response=BoardSerializer),
            400: OpenApiResponse(description="잘못된 입력값 입니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
            403: OpenApiResponse(description="본인이 생성한 보드만 수정할 수 있습니다."),
            404: OpenApiResponse(description="해당 보드가 존재하지 않습니다.")
        }
    )
    ## 보드 수정
    def put(self, request, pk):
        try:
            board = Board.objects.get(id=pk)
        except Board.DoesNotExist:
            return Response({
                'error': '해당 보드가 존재하지 않습니다.'
            }, status=status.HTTP_404_NOT_FOUND)

        # 현재 유저가 보드 작성자인지 확인
        if board.user_id != request.user:
            return Response({'error': '본인이 생성한 보드만 수정할 수 있습니다.'}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data.copy()

        serializer = BoardSerializer(board, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()

            # 핀 수정 작업 (추가 / 삭제)
            new_pins = request.data.get('pins', None) # 새롭게 전달된 핀 목록
            if new_pins is not None:
                existing_pins = board.pin_set.all() # 기존에 존재하는 핀

                # 기존에 있는 핀 중에서 전달된 핀 리스트에 없는 것은 삭제
                for pin in existing_pins:
                    if pin.id not in new_pins:
                        board.pin_set.remove(pin) # 기존에 있던 핀을 보드에서 제거
                
            # 태그 수정 작업 (추가 / 삭제)
            tags_data = data.get('tags', None)
            if tags_data is not None:
                tags = []

                for tag_data in tags_data:
                    # 기존 태그 테이블에 태그가 있는지 확인
                    # 있다면 기존 유지, 없으면 생성
                    tag, created = BoardTag.objects.get_or_create(content=tag_data.strip())
                    tags.append(tag)
                
                board.tags.set(tags)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': '잘못된 입력값 입니다.',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        summary="보드 삭제 API",
        description="이 엔드포인트는 인증된 사용자가 자신이 작성한 보드를 삭제하는 것을 허용합니다. 삭제 작업은 실제로 데이터베이스에서 보드를 제거하는 것이 아니라 'is_deleted' 필드의 값을 True로 변경하여 '삭제됨' 상태로 표시합니다. 이 방식은 실수로 인한 데이터 손실을 방지하고, 필요한 경우 데이터 복구를 용이하게 합니다.",
        parameters=[
            OpenApiParameter(name='id', description='특정 보드의 ID (PK)', type=int, location="path", required=False)
        ],
        responses={
            204: OpenApiResponse(description="성공적으로 보드가 삭제되었습니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
            403: OpenApiResponse(description="본인이 생성한 보드만 삭제할 수 있습니다."),
            404: OpenApiResponse(description="해당 보드가 존재하지 않습니다.")
        },
    )
    ## 보드 삭제
    def delete(self, request, pk):
        try:
            board = Board.objects.get(id=pk)
        except Board.DoesNotExist:
            return Response({
                'error': '해당 보드가 존재하지 않습니다.'
            }, status=status.HTTP_404_NOT_FOUND)

        # 현재 유저가 게시물 작성자인지 확인
        if board.user_id != request.user:
            return Response({'error': '본인이 생성한 보드만 삭제할 수 있습니다.'}, status=status.HTTP_403_FORBIDDEN)
        
        # is_deleted 필드 값을 True로 변경
        board.is_deleted = True 
        board.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


## BoardComment View
class BoardCommentView(APIView):
    @extend_schema(
        summary="보드 댓글 생성 API",
        description="이 엔드포인트는 인증된 사용자가 특정 보드에 댓글을 작성하는 것을 허용합니다. 요청 본문에는 'content' 필드가 포함되어야 합니다. 이는 댓글 내용입니다. 성공적으로 댓글이 생성되면 생성된 BoardComment 객체를 반환하고, 그렇지 않으면 오류 메시지를 반환합니다.",
        parameters=[
            OpenApiParameter(name='id', description='특정 보드의 ID (PK)', type=int, location="path", required=False)
        ],
        request=BoardCommentSerializer,
        examples=[
            OpenApiExample(
                request_only=True,
                summary = "올바른 요청 예시",
                description = "content: 댓글 내용",
                name = "success_example",
                value = {
                    "content": "댓글 내용"
                }
            )
        ],
        responses={
            201: OpenApiResponse(description="성공적으로 해당 보드에 댓글이 생성되었습니다.", response=BoardCommentSerializer),
            400: OpenApiResponse(description="잘못된 입력값 입니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
            404: OpenApiResponse(description="해당 보드가 존재하지 않습니다.")
        },
    )
    ## 보드 댓글 생성
    def post(self, request, pk):
        try:
            board = Board.objects.get(pk=pk)
        except Board.DoesNotExist:
            return Response({"error": "해당 보드가 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['board_id'] = board.id
        data['user_id'] = request.user.id

        comment_serializer = BoardCommentSerializer(data=data)
        
        if comment_serializer.is_valid():
            comment_serializer.save()
            return Response(comment_serializer.data, status=status.HTTP_201_CREATED)
        
        else:
            return Response({
                'error': '잘못된 입력값 입니다.',
                'details': comment_serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        summary="보드 댓글 삭제 API",
        description="이 엔드포인트는 인증된 사용자가 자신이 작성한 보드의 댓글을 삭제하는 것을 허용합니다. 삭제 작업은 데이터베이스에서 댓글 객체를 제거하는 것이 아니라 'is_deleted' 필드의 값을 True로 변경하여 '삭제됨' 상태로 표시합니다.",
        parameters=[
            OpenApiParameter(name='id', description='특정 댓글의 ID (PK)', type=int, location="path", required=False)
        ],
        responses={
            204: OpenApiResponse(description="성공적으로 댓글이 삭제되었습니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
            403: OpenApiResponse(description="본인이 작성한 댓글만 삭제할 수 있습니다."),
            404: OpenApiResponse(description="해당 댓글이 존재하지 않습니다.")
        },
    )
    ## 보드 댓글 삭제
    def delete(self, request, pk):
        try:
            comment = BoardComment.objects.get(id=pk)
        except BoardComment.DoesNotExist:
            return Response({"error": "해당 댓글이 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)

        if request.user != comment.user_id:
            return Response({"error": "본인이 작성한 댓글만 삭제할 수 있습니다."}, status=status.HTTP_403_FORBIDDEN)

        # is_deleted 필드 값을 True로 변경
        comment.is_deleted = True
        comment.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


## BoardLike View
class BoardLikeView(APIView):
    @extend_schema(
        summary="보드 좋아요 등록 API",
        description="이 엔드포인트는 인증된 사용자가 특정 보드에 좋아요를 등록하는 것을 허용합니다.",
        parameters=[
            OpenApiParameter(name='id', description='특정 보드의 ID (PK)', type=int, location="path", required=False)
        ],
        examples=[
            OpenApiExample(
                request_only=True,
                summary = "올바른 요청 예시",
                description = "요청 본문을 입력하지 않습니다.",
                name = "success_example",
                value = {
                    "is_deleted": False
                }
            )
        ],
        request=BoardLikeSerializer,
        responses={
            201: OpenApiResponse(description="성공적으로 해당 보드에 좋아요가 등록되었습니다.", response=BoardLikeSerializer),
            400: OpenApiResponse(description="잘못된 입력값 입니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
            404: OpenApiResponse(description="해당 보드가 존재하지 않습니다.")
        },
    )
    ## 보드 좋아요 등록
    def post(self, request, pk):
        try:
            board = Board.objects.get(pk=pk)
        except Board.DoesNotExist:
            return Response({"error": "해당 보드가 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user

        # 이미 좋아요한 경우 -> 에러 응답 반환
        # if BoardLike.objects.filter(board_id=board.id, user_id=user.id).exists():
        #     return Response({'error': '이미 이 보드에 좋아요를 눌렀습니다.'}, status=400)
        
        serializer = BoardLikeSerializer(data={'board_id': board.id, 'user_id': user.id})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        
        else:
            return Response({
                'error': '잘못된 입력값 입니다.',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        summary="보드 좋아요 해제 API",
        description="이 엔드포인트는 인증된 사용자가 자신이 좋아요한 보드의 좋아요를 해제하는 것을 허용합니다.",
        parameters=[
            OpenApiParameter(name='id', description='특정 좋아요의 ID (pk)', type=int, location="path", required=False)
        ],
        responses={
            204: OpenApiResponse(description="성공적으로 좋아요가 해제되었습니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
            403: OpenApiResponse(description="본인이 등록한 좋아요만 해제할 수 있습니다."),
            404: OpenApiResponse(description="해당 좋아요가 존재하지 않습니다.")
        },
    )
    ## 보드 좋아요 해제
    def delete(self, request, pk):
        user = request.user
        try:
            board_like = BoardLike.objects.get(pk=pk, user_id=user.id)
        except BoardLike.DoesNotExist:
            return Response({"error": "해당 좋아요가 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)

        # 이미 해제된 경우 -> 에러 응답 반환
        # if board_like.is_deleted:
        #     return Response({'error': '이미 이 보드에 좋아요가 해제되었습니다.'})
        
        if request.user != board_like.user_id:
            return Response({"error": "본인이 등록한 좋아요만 해제할 수 있습니다."}, status=status.HTTP_403_FORBIDDEN)
        
        board_like.is_deleted = True
        board_like.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @extend_schema(
        summary="보드 좋아요 목록 조회 API",
        description="이 엔드포인트는 인증된 사용자가 자신이 누른 보드의 좋아요 목록을 조회하는 것을 허용합니다.",
        responses={
            200: OpenApiResponse(description="성공적으로 조회하였습니다.", response=BoardPinSerializer(many=True)),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
            404: OpenApiResponse(description="해당 유저가 존재하지 않습니다.")
        }
    )
    ## 보드 좋아요 목록 조회
    def get(self, request, pk=None):
        if pk:
            try:
                user = User.objects.get(id=pk)
            except ObjectDoesNotExist:
                return Response({"error": "해당 유저가 존재하지 않습니다."}, status=status.HTTP_404_NOT_FOUND)
        else:
            user = request.user

        board_likes = BoardLike.objects.filter(user_id=user.id, is_deleted=False).order_by('-created_at')

        if not board_likes:
            return Response({"message": "해당 유저가 좋아요한 보드가 없습니다."}, status=status.HTTP_200_OK)

        boards = [board_like.board_id for board_like in board_likes]

        # 페이지네이션 적용
        paginator = CustomPagination()
        paginator.page_size = 4

        # 쿼리셋 페이지네이트
        boards_page = paginator.paginate_queryset(boards, request)
        
        serializer = BoardPinSerializer(instance=boards_page, many=True)

        # 페이지네이션 응답 반환
        return paginator.get_paginated_response(serializer.data)


## BoardSearch View
class BoardSearchView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="보드 검색 API",
        description="""이 엔드포인트는 주어진 검색 조건에 따라 보드를 검색합니다. 'search' 쿼리 파라미터로 검색어를, 'search_field' 쿼리 파라미터로 검색 필드('all', 'tag')를 지정할 수 있습니다. 로그인하지 않은 사용자는 공개된 보드만 검색 가능하며, 로그인한 사용자는 자신이 작성한 모든 보드와 다른 사용자가 작성한 공개된 보드를 검색할 수 있습니다.""",
        parameters=[
            OpenApiParameter(name='search', description='검색어', required=False),
            OpenApiParameter(name='search_field', description='검색 필드 (all | tag)', required=False)
        ],
        responses={
            200: OpenApiResponse(description="성공적으로 조회하였습니다.", response=BoardPinSerializer(many=True)),
            400: OpenApiResponse(description="잘못된 입력값 입니다.")
        }
    )
    def get(self, request, format=None):
        search_term = request.query_params.get('search', None)
        search_field = request.query_params.get('search_field', None)

        # 정렬 기준
        # 기본값으로 'created' 설정
        sort = request.GET.get('sort', 'created')

        if not search_term or search_field not in ['all', 'tag']:
            return Response({
                'error': '잘못된 입력값 입니다.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 로그인되지 않은 사용자의 경우
        if not request.user.is_authenticated:
            queryset = Board.objects.filter(is_public=True, is_deleted=False)

            if search_field == 'all':
                queryset = queryset.annotate(pin_count=Count('pin')).filter(pin_count__gt=0).filter(
            Q(title__icontains=search_term) | Q(tags__content__icontains=search_term)).distinct()
                
            # # 보드 제목으로 검색
            # elif search_field == 'title':
            #     queryset = queryset.filter(title__icontains=search_term)
            # # 태그 내용으로 검색
            # elif search_field == 'tag':
            #     queryset = queryset.filter(
            #         tags__content__icontains=search_term)
                
        # 로그인된 사용자의 경우
        else:
            # 로그인된 사용자가 작성한 공개/비공개 보드
            user_boards = Board.objects.filter(user_id=request.user.id, is_deleted=False)

            # 로그인된 사용자가 작성자가 아닌 다른 사용자의 공개 보드
            public_boards_except_user_ones = Board.objects.exclude(user_id=request.user.id).filter(is_public=True, is_deleted=False)

            # 제목 또는 태그 내용으로 검색
            if search_field == 'all':
                user_boards_filtered = user_boards.annotate(pin_count=Count('pin')).filter(pin_count__gt=0).filter(Q(title__icontains=search_term) | Q(tags__content__icontains=search_term)).distinct()
                public_boards_filtered_except_user_ones = public_boards_except_user_ones.annotate(pin_count=Count('pin')).filter(pin_count__gt=0).filter(Q(title__icontains=search_term) | Q(tags__content__icontains=search_term)).distinct()

            # 태그 내용으로 검색
            elif search_field == 'tag':
                user_boards_filtered = user_boards.filter(
                    tags__content__icontains=search_term).distinct()
                public_boards_filtered_except_user_ones = public_boards_except_user_ones.filter(
                    tags__content__icontains=search_term).distinct()

            # 결합
            queryset = (user_boards_filtered | public_boards_filtered_except_user_ones).distinct()

        # 정렬 기능
        # 핀 개수 기준으로 정렬
        if sort == 'pin':
            queryset = queryset.annotate(pin_count=Count('pin')).order_by('-pin_count')
        
        # 좋아요 개수 기준으로 정렬
        elif sort == 'like':
            queryset = queryset.annotate(like_count=Count('boardlike'), pin_count=Count('pin')).order_by('-like_count')

        # 최신순 기준으로 정렬
        else:
            queryset = queryset.annotate(pin_count=Count('pin')).order_by('-created_at')

        serializer = BoardPinSerializer(queryset, many=True)

        if request.user.is_authenticated:
                request_user = {"email": str(request.user), "requestUserPk": request.user.id, "profileImg": "https://favspot-fin.s3.amazonaws.com/" + str(request.user.profile_img)}
        else:
            request_user = {}
        
        return Response({'request_user': request_user, "boards": serializer.data}, status=status.HTTP_200_OK)


# BoardTag View
class UserTaggedBoardView(APIView):
    # 로그인된 사용자만 접근 가능
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="특정 태그가 달린 보드 조회 API",
        description="이 엔드포인트는 인증된 사용자가 특정 태그를 가진 보드 목록을 조회하는 것을 허용합니다. 쿼리 파라미터로 'tag' 값을 받아 해당 태그가 포함된 모든 보드를 반환합니다.",
        responses={
            200: OpenApiResponse(description="성공적으로 조회하였습니다.", response=BoardPinSerializer(many=True)),
            400: OpenApiResponse(description="태그 값이 제공되지 않았습니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다.")
        },
    )
    def get(self, request, pk=None):
        # 쿼리 파라미터로부터 'tag' 값 가져오기
        tag = request.query_params.get('tag', None)
        
        if not tag:
            return Response({"error": "태그 값이 제공되지 않았습니다."}, status=400)

        # 특정 유저의 보드 중에서 특정 태그를 가진 보드 조회
        queryset = Board.objects.filter(user_id=pk, tags__content__icontains=tag, is_deleted=False)

        # 페이지네이션 적용
        paginator = CustomPagination()
        paginator.page_size = 4 

        # 쿼리셋 페이지네이트
        boards_page = paginator.paginate_queryset(queryset, request)

        serializer = BoardPinSerializer(boards_page, many=True)
        
        if request.user.is_authenticated:
                request_user = {"email": str(request.user), "requestUserPk": request.user.id, "profileImg": "https://favspot-fin.s3.amazonaws.com/" + str(request.user.profile_img)}
        else:
            request_user = {}
        
        return paginator.get_paginated_response({'request_user': request_user, "boards": serializer.data})
