from django.urls import path
from .views import NotificationList

app_name = 'notification'

urlpatterns = [
    path('', NotificationList.as_view(), name='list')
]
