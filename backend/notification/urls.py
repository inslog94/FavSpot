from django.urls import path
from . import views

app_name = 'notification'

urlpatterns = [
    # 알림 리스트 조회
    path('', views.NotificationList.as_view(), name='list'),
    # 알림 읽음 처리
    path('<int:pk>/read/', views.NotificationReadMark.as_view(), name='read'),
    # 알림 삭제
    path('<int:pk>/', views.NotificationDelete.as_view(), name='delete'),
]
