from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Board, BoardTag, BoardComment, BoardLike

User = get_user_model()

# Board
class BoardTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardTag
        fields = ('id', 'content', 'is_deleted')


class BoardSerializer(serializers.ModelSerializer):
    # user_id = serializers.IntegerField(read_only=True)
    # tags = BoardTagSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = ('id', 'user_id', 'tags', 'title', 'created_at', 'updated_at', 'is_deleted')


# BoardComment
class BoardCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardComment
        fields = ('id', 'board_id', 'user_id', 'content', 'created_at', 'is_deleted')


# BoardLike
class BoardLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardLike
        fields = ('id', 'board_id', 'user_id', 'created_at', 'is_deleted')