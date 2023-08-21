from django.urls import path, include
from . import views

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/', include('allauth.urls')),
    
    path('auth/google/login/', views.google_login, name='google_login'),
    path('auth/google/callback/', views.google_callback, name='google_callback'),
    path('auth/google/login/finish/', views.GoogleLogin.as_view(), name='google_login_todjango'),
]