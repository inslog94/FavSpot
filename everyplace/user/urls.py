from django.urls import path, include
from . import views

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/', include('allauth.urls')),
    # Signup
    path('signup/', views.SignupView.as_view(), name='signup'),
    # Google Auth
    path('auth/google/login/', views.google_login, name='google_login'),
    path('auth/google/callback/', views.google_callback, name='google_callback'),
    path('auth/google/login/finish/', views.GoogleLogin.as_view(), name='google_login_todjango'),
    # Kakao Auth
    path('auth/kakao/login/', views.kakao_login, name='kakao_login'),
    path('auth/kakao/callback/', views.kakao_callback, name='kakao_callback'),
    path('auth/kakao/login/finish/', views.KakaoLogin.as_view(), name='kakao_login_todjango'),
]