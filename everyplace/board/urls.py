from django.urls import path
from . import views

app_name = 'board'

urlpatterns = [
    # Board
    path('', views.BoardView.as_view(), name='board_create'),
    path('<int:pk>/', views.BoardView.as_view(), name='board_detail_update_delete'),

    # BoardComment
    path('<int:pk>/comment/', views.BoardCommentView.as_view(), name='boardcomment_create'),
    path('comment/<int:pk>/', views.BoardCommentView.as_view(), name='boardcomment_delete'),

    # BoardLike
    path('<int:pk>/like/', views.BoardLikeView.as_view(), name='boardlike_create'),
    path('like/<int:pk>/', views.BoardLikeView.as_view(), name='boardlike_delete'),
    path('like/', views.BoardLikeView.as_view(), name='boardlike_list'),

    # BoardSearch
    path('search/', views.BoardSearchView.as_view(), name='board_search'),
]