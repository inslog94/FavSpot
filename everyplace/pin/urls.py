from django.urls import path
from . import views

app_name = 'pin'

urlpatterns = [
    # 핀 생성
    path('', views.PinView.as_view(), name='pin-create'),
    # 핀 수정, 삭제, 상세정보 조회
    path('<int:pk>/', views.PinView.as_view(), name='pin-detail'),
]
