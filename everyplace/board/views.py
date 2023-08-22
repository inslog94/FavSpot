from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Board, BoardTag
from .serializers import BoardSerializer, BoardTagSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import authentication_classes, permission_classes


class BoardView(APIView):
    ## 보드 전체 목록 조희
    def get_object(self, pk):
        try:
            return Board.objects.get(pk=pk, is_deleted=False)
        except Board.DoesNotExist:
            return None

    ## 특정 보드 상세 조회
    def get(self, request, pk=None):
        if not pk:
            boards = Board.objects.filter(is_deleted=False)
            serializer = BoardSerializer(boards, many=True)
            return Response(serializer.data)
        else:
            board = self.get_object(pk)
            if board is None:
                return Response({'error': 'Board not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = BoardSerializer(board)
            return Response(serializer.data)

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