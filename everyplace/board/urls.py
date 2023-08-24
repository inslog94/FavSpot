from django.urls import path
from . import views

app_name = 'board'

urlpatterns = [
    path('', views.BoardView.as_view(), name='board_create'),
    path('<int:pk>/', views.BoardView.as_view(), name='board_detail_update_delete'),
]