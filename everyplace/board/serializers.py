from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Board, BoardTag, BoardComment, BoardLike
from user.serializers import UserSerializer

User = get_user_model()

# Board
class BoardTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardTag
        fields = ('id', 'content', 'is_deleted')


class BoardSerializer(serializers.ModelSerializer):

    tags = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = ('id', 'user_id', 'user', 'tags', 'title', 'created_at', 'updated_at', 'is_deleted', 'is_public')

    # 유저 정보 추가
    def get_user(self, obj):
        return UserSerializer(obj.user_id).data
    
    # 태그들의 content 값 리스트 형태로 추가
    def get_tags(self, obj):
        tags = obj.tags.all()
        tag_contents = [tag.content for tag in tags]  
        return tag_contents

# BoardComment
class BoardCommentSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = BoardComment
        fields = ('id', 'board_id', 'user_id', 'user', 'content', 'created_at', 'is_deleted')

    # 유저 정보 추가
    def get_user(self, obj):
        return UserSerializer(obj.user_id).data


# BoardLike
class BoardLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardLike
        fields = ('id', 'board_id', 'user_id', 'created_at', 'is_deleted')