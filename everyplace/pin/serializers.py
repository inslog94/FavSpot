from rest_framework import serializers
from .models import Pin, PinContent
from django.contrib.auth import get_user_model

User = get_user_model()


class PinSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pin
        fields = ['id', 'category', 'board_id', 'place_id', 'title',
                  'thumbnail_img', 'new_address', 'old_address', 'lat_lng', 'updated_at']


class PinContentSerializer(serializers.ModelSerializer):
    email = serializers.SerializerMethodField()
    pin_title = serializers.SerializerMethodField()
    place_id = serializers.SerializerMethodField()

    class Meta:
        model = PinContent
        fields = ['id', 'email', 'user_id', 'text', 'photo',
                  'pin_title', 'place_id', 'is_deleted']

    # 유저 email 정보 추가
    def get_email(self, obj):
        return User.objects.get(id=obj.user_id_id).email

    # 해당 핀의 Title 추가
    def get_pin_title(self, obj):
        return Pin.objects.get(id=obj.pin_id_id).title

    # 해당 핀의 piace_id 추가
    def get_place_id(self, obj):
        return Pin.objects.get(id=obj.pin_id_id).place_id


# 보드 상세보기 시 표기 될 내용을 담은 serializer
class SimplePinSerializer(serializers.ModelSerializer):

    # id, 상호명, 카테고리, 도로명주소, 썸네일 이미지(가게 대표사진)
    class Meta:
        model = Pin
        fields = ['id', 'title', 'category', 'new_address', 'thumbnail_img']


# API 명세 작성용 serializer들
class CombinedDetailPinSerializer(serializers.Serializer):
    pin = PinSerializer(help_text="핀 생성 데이터")
    pin_content = PinContentSerializer(help_text="핀 컨텐츠 생성 데이터", many=True)


class CombinedCreatePinSerializer(serializers.Serializer):
    pin = PinSerializer(help_text="핀 생성 데이터")
    pin_content = PinContentSerializer(help_text="핀 컨텐츠 생성 데이터")


class PaginationSerializer(serializers.Serializer):
    next = serializers.URLField(required=False)
    previous = serializers.URLField(required=False)
    total_pages = serializers.IntegerField()
    current_page = serializers.IntegerField()
    count = serializers.IntegerField()


class PaginatedPinResponseSerializer(serializers.Serializer):
    links = PaginationSerializer(source='*')
    results = CombinedDetailPinSerializer()
