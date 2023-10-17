import os
import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email must be set.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


# 이미지가 저장되는 경로 설정하는 함수
# 저장 경로 : media/user_id(pk)/profile/filename
def profile_img_upload_path(instance, filename):
    # user_id에 따라 폴더 구분
    
    # 유저 생성하면서 프로필 사진 등록하는 경우
    if not instance.id:
        print("생성시 프로필 등록")
        last_user = User.objects.last()
        if last_user:
            id_folder = str(last_user.id + 1)
        # db에 유저가 한명도 없는 경우 처리
        else:
            id_folder = "1"
    
    # 나중에 프로필 사진을 등록 or 수정하는 경우
    else:
        id_folder = str(instance.id)
    # 파일 경로 설정
    return os.path.join('images', id_folder, 'profile', str(uuid.uuid4()))


class User(AbstractUser):
    username = None
    nickname = models.CharField(max_length=20, null=True, blank=True)
    profile_img = models.ImageField(upload_to=profile_img_upload_path, null=True, blank=True)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()
    
    def __str__(self):
        return self.email


class Follow(models.Model):
    User = get_user_model()
    following_user = models.ForeignKey(User, related_name='followings', on_delete=models.CASCADE)
    followed_user = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)