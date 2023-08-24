from rest_framework import serializers
from .models import Pin, PinContent
from django.contrib.auth import get_user_model

User = get_user_model()


class PinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pin
        fields = ['category', 'board_id',
                  'title', 'new_address', 'old_address', 'lat_lng']


class PinContentSerializer(serializers.ModelSerializer):

    class Meta:
        model = PinContent
        fields = ['user_id', 'text', 'photo']
        extra_kwargs = {
            'user_id': {'read_only': True},  # user_id는 사용자가 수정 불가능
        }
