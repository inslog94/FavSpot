from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Board
from .serializers import BoardSerializer, BoardTagSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import authentication_classes, permission_classes


class BoardView(APIView):

    def get_object(self, pk):
        try:
            return Board.objects.get(pk=pk, is_deleted=False)
        except Board.DoesNotExist:
            return None

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
