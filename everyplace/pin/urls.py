from django.urls import path
from . import views

app_name = 'pin'

urlpatterns = [
    # 핀 생성
    path('', views.PinCreateView.as_view(), name='create'),
]
