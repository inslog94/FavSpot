from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Board, BoardTag
from .serializers import BoardSerializer, BoardTagSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import authentication_classes, permission_classes
from django.shortcuts import get_object_or_404


class BoardView(APIView):
    ## 특정 보드 상세 조회 메소드
    def get_object(self, pk):
        try:
            return Board.objects.get(pk=pk, is_deleted=False)
        
        except Board.DoesNotExist:
            return None

    def get(self, request, pk=None):
        ## 보드 전체 목록 조희
        if not pk:
            boards = Board.objects.filter(is_deleted=False)
            serializer = BoardSerializer(boards, many=True)

            return Response(serializer.data)
        
        ## 특정 보드 상세 조회
        else:
            board = self.get_object(pk)

            if board is None:
                return Response({'error': '해당 보드가 존재하지 않습니다.'}, status=status.HTTP_404_NOT_FOUND)
            
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

    ## 보드 수정
    def put(self, request, pk):
        board = get_object_or_404(Board, id=pk)

        data = request.data.copy()

        tags_data = None
        if 'tags' in data:
            tags_data = data.pop('tags')

        serializer = BoardSerializer(board, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()

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

        # is_deleted 필드 값을 True로 변경
        board.is_deleted = True 
        board.save()

        return Response(status=status.HTTP_204_NO_CONTENT)