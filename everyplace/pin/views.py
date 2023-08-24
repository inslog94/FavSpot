from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Pin, PinContent, Category
from board.models import Board
from .serializers import PinSerializer, PinContentSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


# Create your views here.
class PinView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    # 핀 상세정보 조회
    def get(self, request, pk):
        pin = get_object_or_404(Pin, pk=pk, is_deleted=False)
        pin_contents = PinContent.objects.filter(pin_id=pin, is_deleted=False)

        pin_serializer = PinSerializer(pin)
        pin_contents_serializer = PinContentSerializer(pin_contents, many=True)

        return Response({
            'pin': pin_serializer.data,
            'pin_contents': pin_contents_serializer.data
        }, status=status.HTTP_200_OK)

    # 핀 생성
    def post(self, request):
        # 로그인 되어있는 아이디로 pin 생성
        request.data['user_id'] = request.user.id

        pin_serializer = PinSerializer(data=request.data)
        pin_content_serializer = PinContentSerializer(data=request.data)

        if pin_serializer.is_valid() and pin_content_serializer.is_valid():

            pin = pin_serializer.save()

            # 생성된 pin과 연결된 pin content 생성
            pin_content_data = pin_content_serializer.validated_data
            pin_content_data['pin_id'] = pin
            pin_content = pin_content_serializer.create(pin_content_data)

            return Response({
                'pin': PinSerializer(pin).data,
                'pin_content': PinContentSerializer(pin_content).data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'pin_errors': pin_serializer.errors,
            'pin_content_errors': pin_content_serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    # 핀 수정
    def put(self, request, pk):
        pin = get_object_or_404(Pin, pk=pk)
        pin_content = get_object_or_404(PinContent, pin_id=pin)

        if request.user == pin.user_id:
            serializer = PinContentSerializer(
                pin_content, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "핀을 수정할 권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

    # 핀 삭제
    def delete(self, request, pk):
        pin = get_object_or_404(Pin, pk=pk)
        pin_content = get_object_or_404(PinContent, pin_id=pin)

        if request.user == pin.user_id:
            pin.is_deleted = True
            pin_content.is_deleted = True
            pin.save()
            pin_content.save()

            return Response({"detail": "핀을 삭제 처리하였습니다."}, status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "핀을 삭제할 권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)
