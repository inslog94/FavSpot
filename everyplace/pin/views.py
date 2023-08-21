from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from .models import Pin, PinContent, Category
from board.models import Board
from .serializers import PinSerializer, PinContentSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


# Create your views here.
class PinCreateView(APIView):
    def post(self, request):
        pin_serializer = PinSerializer(data=request.data)
        pin_content_serializer = PinContentSerializer(data=request.data)

        if pin_serializer.is_valid() and pin_content_serializer.is_valid():

            pin = pin_serializer.save()

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
