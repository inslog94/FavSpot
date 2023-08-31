from rest_framework import serializers
from .models import Pin, PinContent
from django.contrib.auth import get_user_model
from user.serializers import UserSerializer

User = get_user_model()


class PinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pin
        fields = ['category', 'board_id', 'place_id', 'title',
                  'thumbnail_img', 'new_address', 'old_address', 'lat_lng', 'updated_at']


class PinContentSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()

    class Meta:
        model = PinContent
        fields = ['id', 'email', 'user_id', 'text', 'photo']

    # 유저 email 정보 추가
    def get_email(self, obj):
        return UserSerializer(obj.user_id).data['email']


# 보드 상세보기 시 표기 될 내용을 담은 serializer
class SimplePinSerializer(serializers.ModelSerializer):

    # id, 상호명, 카테고리, 도로명주소, 썸네일 이미지(가게 대표사진)
    class Meta:
        model = Pin
        fields = ['id', 'title', 'category', 'new_address', 'thumbnail_img']
