from django.urls import path
from . import views

app_name = 'pin'

urlpatterns = [
    # 핀 생성
    path('', views.PinCreateView.as_view(), name='pin-create'),
    # 핀 컨텐츠 수정, 삭제
    path('content/<int:pk>/',
         views.PinContentView.as_view(), name='pin-content'),
    # 핀 코멘트 목록 조회
    path('comment/',
         views.PinCommentView.as_view(), name='pin-comment'),
    # 핀 상세정보 조회
    path('<str:place_id>/',
         views.PinDetailView.as_view(), name='pin-detail'),
    # 핀이 저장되지 않은 장소에 대한 정보 제공
    path('no-content/<str:place_id>/',
         views.AdditionalInfo.as_view(), name='add-info'),
]
