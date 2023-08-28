from django.urls import path, include
from . import views

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/', include('allauth.urls')),
    # Signup
    path('signup/', views.SignupView.as_view(), name='signup'),
    # Login
    path('login/', views.LoginView.as_view(), name='login'),
    # Logout
    path('logout/', views.LogoutView.as_view(), name='logout'),
    # Google Auth
    path('auth/google/login/', views.google_login, name='google_login'),
    path('auth/google/callback/', views.google_callback, name='google_callback'),
    path('auth/google/login/finish/', views.GoogleLogin.as_view(), name='google_login_todjango'),
    # Kakao Auth
    path('auth/kakao/login/', views.kakao_login, name='kakao_login'),
    path('auth/kakao/callback/', views.kakao_callback, name='kakao_callback'),
    path('auth/kakao/login/finish/', views.KakaoLogin.as_view(), name='kakao_login_todjango'),
    # User Profile
    path('me/', views.UserInfoView.as_view(), name='my_info'),
    path('<int:pk>/', views.UserInfoView.as_view(), name='user_info'),
    # User Follow
    path('follow/', views.UserFollow.as_view(), name='follow'),
    path('follow/<int:pk>/', views.UserFollow.as_view(), name='unfollow'),
    # User Following List
    path('following/', views.UserFollowing.as_view(), name='my_following_list'),
    path('<int:pk>/following/', views.UserFollowing.as_view(), name='user_following_list'),
    # User Follower List
    path('follower/', views.UserFollower.as_view(), name='my_follower_list'),
    path('<int:pk>/follower/', views.UserFollower.as_view(), name='user_follower_list'),
]