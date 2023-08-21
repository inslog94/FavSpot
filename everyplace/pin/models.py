import os
from django.db import models
from django.contrib.auth import get_user_model
from board.models import Board

User = get_user_model()


class Pin(models.Model):
    # 카테고리명 : 디저트카페 or 카페
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    
    # 연결시킬 Board id
    board_id = models.ForeignKey(Board, on_delete=models.CASCADE)
    
    # 생성한 user id
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # 상호명 : 예) 노티드 청담
    title = models.CharField(max_length=50)
    
    # 도로명주소 : 예) 서울 강남구 도산대로53길 15 1층
    new_address = models.CharField(max_length=100)
    
    # 지번주소 : 예) (서울 강남구) 신사동 654-9 - 동단위부터 나와 앞에 주소 추가 필요
    old_address = models.CharField(max_length=100)
    
    # 위도 경도값 - 문자열 형태로 쉼표 + 띄어쓰기 구분하여 저장 : 예) "37.5241508, 127.0382334"
    lat_lng = models.CharField(max_length=50) 
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title


# 이미지가 저장되는 경로 설정하는 함수
# 저장 경로 : media/user_id(pk)/pin_photos/pin_id(pk)/filename
def pin_photo_upload_path(instance, filename):
    # user_id에 따라 폴더 구분
    id_folder = str(instance.user_id.id)
    # pin_id에 따라 폴더 구분
    pin_id_folder = str(instance.pin_id.id)
    # 파일 경로 설정
    return os.path.join(id_folder, 'pin_photos', pin_id_folder, filename)


# 핀에 연결될 내용(간단한 텍스트, 사진)
class PinContent(models.Model):
    # 연결시킬 Pin id
    pin_id = models.ForeignKey(Pin, on_delete=models.CASCADE)
    
    # 생성한 user id
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # 간단한 메모(핀 등록한 이유, 후기 등) // 필수 입력 X
    text = models.CharField(max_length=200, null=True, blank=True)
    
    # 사진(음식이나 가게 내외부 사진 등) // 필수 입력 X
    photo = models.ImageField(upload_to=pin_photo_upload_path, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)


class Category(models.Model):
    # 업종별 분류 - 카카오에서 제공하는 카테고리 활용 
    # https://apis.map.kakao.com/web/documentation/#CategoryCode 참고
    # 최상단 분류는 "FD6 음식점" 이지만 카카오 지도에서 검색해보면 "FD6 음식점" 밑으로 "음식점 > 한식 > 냉면 > 전체" 단위까지 분류가 되어있기 때문에 조금 더 세부적으로 나뉘어도 괜찮을 것 같다는 생각 
    name = models.CharField(max_length=20)
    is_deleted = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name


# 만약을 대비한 핀 태그 모델
# class PinTag(models.Model):
#     content = models.CharField(max_length=30, null=True, blank=True)

#     def __str__(self):
#         return self.content