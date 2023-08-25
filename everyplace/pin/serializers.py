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


# 보드 상세보기 시 표기 될 내용을 담은 serializer
class SimplePinSerializer(serializers.ModelSerializer):
    pincontent_set = serializers.SerializerMethodField()

    def get_pincontent_set(self, pin):
        # 하나의 핀 객체에 연결되어있는 핀컨텐츠 객체들 추출 (역참조) 
        # photo 필드가 있는 것들을 최신순으로 3개만 추출
        contents = pin.pincontent_set.order_by('-created_at')[:3]
        photo_urls = [content.photo.url for content in contents if content.photo]
        return photo_urls
    
    class Meta:
        model = Pin
        fields = ['id', 'title', 'category', 'new_address', 'pincontent_set']
