from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Board(models.Model):
    # 생성한 user id
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # 연결시킬 Tag(들)
    tags = models.ManyToManyField('BoardTag', blank=True)
    
    # 보드명
    title = models.CharField(max_length=50)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    # 보드 공개, 비공개 설정 
    is_public = models.BooleanField(default=True)
    
    def __str__(self):
        return self.title


class BoardTag(models.Model):
    # 태그명 // 필수 입력 X
    content = models.CharField(max_length=30, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    
    def __str__(self):
        return self.content


class BoardLike(models.Model):
    # 좋아요할 Board id
    board_id = models.ForeignKey(Board, on_delete=models.CASCADE)
    
    # 좋아요 버튼 누른 User id
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title


class BoardComment(models.Model):
    # 댓글이 달릴 Board id
    board_id = models.ForeignKey(Board, on_delete=models.CASCADE)
    
    # 댓글 작성하는 user id
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # 댓글 내용
    content = models.CharField(max_length=100)
    
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    
    def __str__(self):
        return self.content