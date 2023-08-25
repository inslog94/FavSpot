from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Follow


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