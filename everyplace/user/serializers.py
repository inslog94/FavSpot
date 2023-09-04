from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Follow
from pin.models import Pin, PinContent
from board.models import Board, BoardTag, BoardLike
from pin.serializers import PinContentSerializer


class UserSerializer(serializers.ModelSerializer):
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    following_list = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    pin_contents = serializers.SerializerMethodField()
    
    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'nickname', 'profile_img', 'pin_contents', 'followers', 'following', 'following_list', 'tags')
        extra_kwargs = {'password': {'write_only': True}}

    def get_followers(self, obj):
        return Follow.objects.filter(followed_user=obj, is_deleted=False).count()

    def get_following(self, obj):
        return Follow.objects.filter(following_user=obj, is_deleted=False).count()
    
    def get_following_list(self, obj):
        following = Follow.objects.filter(following_user=obj, is_deleted=False)
        following_list = [i.followed_user.email for i in following if i.followed_user]
        return following_list
    
    # 해당 유저가 작성한 보드들의 태그 목록 추가
    def get_tags(self, obj):
        board_tags = set(BoardTag.objects.filter(board__user_id=obj))
        tag_contents = [tag.content for tag in board_tags if tag.content]
        return tag_contents
    
    def get_pin_contents(self, obj):
        pin_contents = PinContent.objects.filter(user_id=obj.id, is_deleted=False).order_by(('-updated_at'))
        serializer = PinContentSerializer(pin_contents, many=True)
        return serializer.data


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
    following_list = serializers.SerializerMethodField()
    
    class Meta:
        model = Follow
        fields = ('id', 'following_user', 'followed_user', 'following_list', 'following_user_info')
    # 유저 정보 추가
    def get_following_user_info(self, obj):
        return UserSerializer(obj.following_user).data
    
    def get_following_list(self, obj):
        following = Follow.objects.filter(following_user=obj.followed_user, is_deleted=False)
        following_list = [i.followed_user.email for i in following if i.followed_user]
        return following_list


class BoardPinSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    thumbnail_imgs = serializers.SerializerMethodField()
    pins = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    
    class Meta:
        model = Board
        fields = ('id', 'user_id', 'tags', 'title', 'thumbnail_imgs', 'pins', 'likes', 'created_at', 'updated_at', 'is_deleted', 'is_public')
    
    # 태그들의 content 값 리스트 형태로 추가
    def get_tags(self, obj):
        tags = obj.tags.all()
        tag_contents = [tag.content for tag in tags]  
        return tag_contents
    
    # 보드에 속한 핀들의 썸네일 이미지를 리스트 형태로 추가
    def get_thumbnail_imgs(self, obj):
        pins = Pin.objects.filter(board_id=obj.id)
        thumbnail_imgs = [pin.thumbnail_img for pin in pins]
        return thumbnail_imgs
    
    # 보드에 속한 핀들의 Place id를 리스트 형태로 추가
    def get_pins(self, obj):
        pins = Pin.objects.filter(board_id=obj.id)
        pin_place_ids = [pin.place_id for pin in pins if pin.place_id]
        return pin_place_ids
    
    def get_likes(self, obj):
        return BoardLike.objects.filter(board_id_id=obj.id).count()