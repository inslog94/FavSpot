from django.urls import path
from .views import NotificationList, NotificationReadMark

app_name = 'notification'

urlpatterns = [
    path('', NotificationList.as_view(), name='list'),
    path('<int:pk>/read/', NotificationReadMark.as_view(), name='read'),
]
