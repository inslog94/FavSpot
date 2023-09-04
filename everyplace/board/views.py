from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Board, BoardTag, BoardComment, BoardLike
from pin.models import Pin
from .serializers import BoardSerializer, BoardTagSerializer, BoardCommentSerializer, BoardLikeSerializer
from pin.serializers import SimplePinSerializer, PinSerializer
from user.serializers import BoardPinSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.decorators import authentication_classes, permission_classes
from django.shortcuts import get_object_or_404
from django.db.models import Q


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

    def get(self, request, pk=None):

        ## 보드 전체 목록 조희
        if not pk:
            boards = Board.objects.filter(is_deleted=False)
            serializer = BoardPinSerializer(boards, many=True)

            return Response(serializer.data)
        
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

            data = {
                'board': board_serializer.data,
                'user_liked': user_liked,
                'likes_count': likes_count,
                'pins': pin_serializer.data,
                'comments': comment_serializer.data
            }

            return Response(data)

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

            if tags_data:
                for tag_data in tags_data:
                    # 기존 태그 테이블에 태그가 있는지 확인
                    try:
                        tag = BoardTag.objects.get(content=tag_data)

                    except BoardTag.DoesNotExist:
                        # 테그 테이블에 없다면 새로 생성
                        tag_serializer = BoardTagSerializer(data={'content': tag_data})

                        if tag_serializer.is_valid():
                            tag = tag_serializer.save()

                        else:
                            return Response(tag_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                    # 태그를 보드와 태그 테이블의 연관(중간) 테이블의 관계 데이터로 추가
                    board.tags.add(tag)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    ## 보드 수정
    def put(self, request, pk):
        board = get_object_or_404(Board, id=pk)

        # 현재 유저가 보드 작성자인지 확인
        if board.user_id != request.user:
            return Response({'error': '본인이 작성한 게시물만 수정할 수 있습니다.'}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data.copy()

        tags_data = None
        if 'tags' in data:
            tags_data = data.pop('tags')

        serializer = BoardSerializer(board, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()

            # 핀 수정 작업 (추가 / 삭제)
            new_pins = request.data.get('pins', []) # 새롭게 전달된 핀 목록
            existing_pins = board.pin_set.all() # 기존에 존재하는 핀

            # 기존에 있는 핀 중에서 전달된 핀 리스트에 없는 것은 삭제
            for pin in existing_pins:
                if pin.id not in new_pins:
                    board.pin_set.remove(pin) # 기존에 있던 핀을 보드에서 제거
                
            # 태그 수정 작업 (추가 / 삭제)
            if tags_data:
                # 새로운 태그를 연결
                new_tags = []
                
                for tag_data in tags_data:
                    try:
                        tag = BoardTag.objects.get(content=tag_data)
                        
                    except BoardTag.DoesNotExist:
                        tag_serializer = BoardTagSerializer(data={'content': tag_data})
                        
                        if tag_serializer.is_valid():
                            tag = tag_serializer.save()
                            
                        else:
                            return Response(tag_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                        
                    new_tags.append(tag)
                    
                # 현재 태그를 가져옴
                current_tags = board.tags.all()
                
                # 기존 태그 중 제거할 태그를 삭제
                tags_to_remove = set(current_tags) - set(new_tags)
                for tag in tags_to_remove:
                    board.tags.remove(tag)
                    
                # 새로운 태그 중 추가할 태그를 추가
                tags_to_add = set(new_tags) - set(current_tags)
                for tag in tags_to_add:
                    board.tags.add(tag)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    ## 보드 삭제
    def delete(self, request, pk):
        board = get_object_or_404(Board, id=pk)

        # 현재 유저가 게시물 작성자인지 확인
        if board.user_id != request.user:
            return Response({'error': '본인이 작성한 게시물만 삭제할 수 있습니다.'}, status=status.HTTP_403_FORBIDDEN)
        
        # is_deleted 필드 값을 True로 변경
        board.is_deleted = True 
        board.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


## BoardComment View
class BoardCommentView(APIView):
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
        
        return Response(comment_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    ## 보드 댓글 삭제
    def delete(self, request, pk):
        comment = get_object_or_404(BoardComment, id=pk)

        if request.user != comment.user_id:
            return Response({"error": "본인이 작성한 댓글만 삭제할 수 있습니다."}, status=status.HTTP_403_FORBIDDEN)

        # is_deleted 필드 값을 True로 변경
        comment.is_deleted = True
        comment.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


## BoardLike View
class BoardLikeView(APIView):
    ## 보드 좋아요 등록
    def post(self, request, pk):
        board = get_object_or_404(Board, pk=pk)
        user = request.user

        # 이미 좋아요한 경우 -> 에러 응답 반환
        # if BoardLike.objects.filter(board_id=board.id, user_id=user.id).exists():
        #     return Response({'error': '이미 이 보드에 좋아요를 눌렀습니다.'}, status=400)
        
        serializer = BoardLikeSerializer(data={'board_id': board.id, 'user_id': user.id})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        
        return Response(serializer.error, status=400)
    
    ## 보드 좋아요 해제
    def delete(self, request, pk):
        user = request.user
        board_like = get_object_or_404(BoardLike, pk=pk,  user_id=user.id)

        # 이미 해제된 경우 -> 에러 응답 반환
        if board_like.is_deleted:
            return Response({'error': '이미 이 보드에 좋아요가 해제되었습니다.'})
        
        board_like.is_deleted = True
        board_like.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    ## 보드 좋아요 목록 조회
    def get(self, request):
        user = request.user

        # 유저가 좋아요한 보드 목록을 필터링하여 BoardLike 모델 객체들 추출
        # 최신순 정렬된 상태로 추출
        board_likes = BoardLike.objects.filter(user_id=user.id, is_deleted=False).order_by('-created_at')

        # 추출한 객체들의 id값 리스트로 저장
        boards = [board_like.board_id for board_like in board_likes]

        serializer = BoardSerializer(instance=boards, many=True)

        return Response(serializer.data)


## BoardSearch View
class BoardSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        search_term = request.query_params.get('search', None)
        search_field = request.query_params.get('search_field', None)

        queryset = Board.objects.all()

        if search_field and search_term:
            # 보드 제목 또는 태그 내용으로 검색
            if search_field == 'all':
                queryset = queryset.filter(
                    Q(title__icontains=search_term) | Q(tags__content__icontains=search_term))
            # 보드 제목으로 검색
            elif search_field == 'title':
                queryset = queryset.filter(title__icontains=search_term)
            # 태그 내용으로 검색
            elif search_field == 'tag':
                queryset = queryset.filter(
                    tags__content__icontains=search_term)

        serializer = BoardSerializer(queryset, many=True)
        return Response(serializer.data)