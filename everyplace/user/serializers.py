from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Follow
from pin.models import Pin
from board.models import Board


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('email', 'password', 'nickname', 'profile_img')
        extra_kwargs = {'password': {'write_only': True}}


class FollowingSerializer(serializers.ModelSerializer):
    followed_user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Follow
        fields = ('id', 'following_user', 'followed_user', 'followed_user_info')
    # 유저 정보 추가
    def get_followed_user_info(self, obj):
        return UserSerializer(obj.followed_user).data


class FollowerSerializer(serializers.ModelSerializer):
    following_user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Follow
        fields = ('id', 'following_user', 'followed_user', 'following_user_info')
    # 유저 정보 추가
    def get_following_user_info(self, obj):
        return UserSerializer(obj.following_user).data


class BoardPinSerializer(serializers.ModelSerializer):
    thumbnail_imgs = serializers.SerializerMethodField()
    
    class Meta:
        model = Board
        fields = ('id', 'user_id', 'tags', 'title', 'thumbnail_imgs', 'created_at', 'updated_at', 'is_deleted', 'is_public')
    # 보드에 속한 핀들의 썸네일 이미지를 리스트 형태로 추가
    def get_thumbnail_imgs(self, obj):
        pins = Pin.objects.filter(board_id=obj.id)
        thumbnail_imgs = [pin.thumbnail_img for pin in pins]
        return thumbnail_imgs