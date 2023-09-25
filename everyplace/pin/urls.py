from django.urls import path
from . import views

app_name = 'pin'

urlpatterns = [
    # 핀 생성
    path('', views.PinCreateView.as_view(), name='pin-create'),
    # 핀 컨텐츠 수정, 삭제
    path('content/<int:pk>/',
         views.PinContentView.as_view(), name='pin-content'),
    # 핀 상세정보 조회
    path('<str:place_id>/',
         views.PinDetailView.as_view(), name='pin-detail'),
]
