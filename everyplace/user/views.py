import os
import requests
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import redirect
from django.contrib.auth import authenticate
from django.contrib.auth.models import AnonymousUser
from django.utils.translation import gettext_lazy as _
from json.decoder import JSONDecodeError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google import views as google_view
from allauth.socialaccount.providers.kakao import views as kakao_view
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.models import SocialAccount
from .models import User, Follow
from .serializers import UserSerializer, FollowingSerializer, FollowerSerializer, BoardPinSerializer
from board.models import Board
from pin.paginations import CustomPagination

state = os.getenv('STATE')
BASE_URL = os.getenv('BASE_URL')
INDEX_URL = os.getenv('INDEX_URL')
LOGOUT_URL = BASE_URL + 'auth/logout/'
PASSWORD_CHANGE_URL = BASE_URL + 'auth/password/change/'
GOOGLE_CALLBACK_URI = BASE_URL + 'auth/google/callback/'
KAKAO_CALLBACK_URI = BASE_URL + 'auth/kakao/callback/'

# Google Auth
def google_login(request):
    """
    Code Request
    """
    scope = "https://www.googleapis.com/auth/userinfo.email"
    client_id = os.getenv('SOCIAL_AUTH_GOOGLE_CLIENT_ID')
    return redirect(f"https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&response_type=code&redirect_uri={GOOGLE_CALLBACK_URI}&scope={scope}&state={state}")

def google_callback(request):
    client_id = os.getenv('SOCIAL_AUTH_GOOGLE_CLIENT_ID')
    client_secret = os.getenv('SOCIAL_AUTH_GOOGLE_SECRET')
    code = request.GET.get('code')
    """
    Access Token Request
    """
    token_req = requests.post(
        f"https://oauth2.googleapis.com/token?client_id={client_id}&client_secret={client_secret}&code={code}&grant_type=authorization_code&redirect_uri={GOOGLE_CALLBACK_URI}&state={state}")
    token_req_json = token_req.json()
    error = token_req_json.get("error")
    if error is not None:
        raise JSONDecodeError(error)
    access_token = token_req_json.get('access_token')
    """
    Email Request
    """
    email_req = requests.get(
        f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}")
    email_req_status = email_req.status_code
    if email_req_status != 200:
        return JsonResponse({'err_msg': 'failed to get email'}, status=status.HTTP_400_BAD_REQUEST)
    email_req_json = email_req.json()
    email = email_req_json.get('email')
    """
    Signup or Signin Request
    """
    try:
        # 가입된 유저인지 체크
        user = User.objects.get(email=email)
        # 가입된 유저라면 소셜 로그인 계정인지 체크
        social_user = SocialAccount.objects.get(user=user)
        # 가입된 유저의 Provider가 google이 아니면 에러 발생(Kakao 계정이라는 뜻)
        if social_user.provider != 'google':
            return JsonResponse({'err_msg': 'Kakao로 가입된 계정입니다.'}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})
        
    except SocialAccount.DoesNotExist:
        return JsonResponse({'err_msg': '소셜 로그인 계정이 아닙니다. 일반 로그인을 이용해주세요.'}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})
    
    except User.DoesNotExist:
        pass
    
    # 가입하지 않은 유저거나 기존에 Google로 가입된 유저의 경우 로그인 처리
    data = {'access_token': access_token, 'code': code}
    accept = requests.post(
        f"{BASE_URL}auth/google/login/finish/", data=data)
    accept_status = accept.status_code
    if accept_status != 200:
        return JsonResponse({'err_msg': 'failed to signup'}, status=accept_status)
    accept_json = accept.json()
    accept_json.pop('user', None)
    # Cookies에 HTTP Only, Secure 속성으로 토큰을 저장하여 응답
    response = JsonResponse({'Google_login': 'success'}, status=status.HTTP_201_CREATED)
    response.set_cookie('access_token', accept_json['access_token'], httponly=True, secure=True)
    response.set_cookie('refresh_token', accept_json['refresh_token'], httponly=True, secure=True)
    return response


class GoogleLogin(SocialLoginView):
    adapter_class = google_view.GoogleOAuth2Adapter
    callback_url = GOOGLE_CALLBACK_URI
    client_class = OAuth2Client

# Kakao Auth
def kakao_login(request):
    rest_api_key = os.getenv('KAKAO_REST_API_KEY')
    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={rest_api_key}&redirect_uri={KAKAO_CALLBACK_URI}&response_type=code"
    )

def kakao_callback(request):
    rest_api_key = os.getenv('KAKAO_REST_API_KEY')
    code = request.GET.get("code")
    redirect_uri = KAKAO_CALLBACK_URI
    """
    Access Token Request
    """
    token_req = requests.get(
        f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={rest_api_key}&redirect_uri={redirect_uri}&code={code}")
    token_req_json = token_req.json()
    error = token_req_json.get("error")
    if error is not None:
        raise JSONDecodeError(error)
    access_token = token_req_json.get("access_token")
    """
    Email Request
    """
    profile_request = requests.get(
        "https://kapi.kakao.com/v2/user/me", headers={"Authorization": f"Bearer {access_token}"})
    profile_json = profile_request.json()
    error = profile_json.get("error")
    if error is not None:
        raise JSONDecodeError(error)
    kakao_account = profile_json.get('kakao_account')
    """
    kakao_account에서 이메일 외에
    카카오톡 프로필 이미지, 배경 이미지 url 가져올 수 있음
    print(kakao_account) 참고
    """
    email = kakao_account.get('email')
    """
    Signup or Signin Request
    """
    try:
        # 가입된 유저인지 체크
        user = User.objects.get(email=email)
        # 가입된 유저라면 소셜 로그인 계정인지 체크
        social_user = SocialAccount.objects.get(user=user)
        # 가입된 유저의 Provider가 kakao가 아니면 에러 발생(Google 계정이라는 뜻)
        if social_user.provider != 'kakao':
            return JsonResponse({'err_msg': 'Google로 가입된 계정입니다.'}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})
        
    except SocialAccount.DoesNotExist:
        return JsonResponse({'err_msg': '소셜 로그인 계정이 아닙니다. 일반 로그인을 이용해주세요.'}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})

    except User.DoesNotExist:
        pass
    
    # 가입하지 않은 유저거나 기존에 Kakao로 가입된 유저의 경우 로그인 처리
    data = {'access_token': access_token, 'code': code}
    accept = requests.post(
        f"{BASE_URL}auth/kakao/login/finish/", data=data)
    accept_status = accept.status_code
    if accept_status != 200:
        return JsonResponse({'err_msg': 'failed to signup'}, status=accept_status)
    accept_json = accept.json()
    accept_json.pop('user', None)
    # Cookies에 HTTP Only, Secure 속성으로 토큰을 저장하여 응답
    response = JsonResponse({'Kakao_login': 'success'}, status=status.HTTP_201_CREATED)
    response.set_cookie('access_token', accept_json['access_token'], httponly=True, secure=True)
    response.set_cookie('refresh_token', accept_json['refresh_token'], httponly=True, secure=True)
    return response


class KakaoLogin(SocialLoginView):
    adapter_class = kakao_view.KakaoOAuth2Adapter
    client_class = OAuth2Client
    callback_url = KAKAO_CALLBACK_URI

# 일반 회원가입
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        email = serializer.initial_data.get('email')
        if serializer.is_valid():
            # create_user 메서드를 이용하여 유저 생성
            user = User.objects.create_user(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password'],
                nickname=serializer.validated_data.get('nickname', ''),
                profile_img=serializer.validated_data.get('profile_img', None)
            )
            # 유저에 대한 RefreshToken 발급
            refresh = RefreshToken.for_user(user)
            # Cookies에 HTTP Only, Secure 속성으로 토큰을 저장하여 응답
            response = JsonResponse({'Signup': 'success'}, status=status.HTTP_201_CREATED)
            response.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True)
            response.set_cookie('refresh_token', str(refresh), httponly=True, secure=True)
            return response
        
        try:
            # 가입된 유저인지 체크
            user = User.objects.get(email=email)
            # 가입된 유저라면 소셜 로그인 계정인지 체크
            social_user = SocialAccount.objects.get(user=user)
            # 가입된 유저의 Provider를 체크하여 가입된 서비스 정보와 함께 BAD_REQUEST 응답 반환
            if social_user.provider == 'google':
                return JsonResponse({'err_msg': 'Google로 가입된 계정입니다.'}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})
            elif social_user.provider == 'kakao':
                return JsonResponse({'err_msg': 'Kakao로 가입된 계정입니다.'}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})
        except:
            pass
        
        return JsonResponse({'err_msg': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# 일반 로그인
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        
        try:
            # 가입된 유저인지 체크
            user = User.objects.get(email=email)
            # 가입된 유저라면 소셜 로그인 계정인지 체크
            social_user = SocialAccount.objects.get(user=user)
            # 가입된 유저의 Provider를 체크하여 가입된 서비스 정보와 함께 BAD_REQUEST 응답 반환
            if social_user.provider == 'google':
                return JsonResponse({'err_msg': 'Google로 가입된 계정입니다.'}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})
            elif social_user.provider == 'kakao':
                return JsonResponse({'err_msg': 'Kakao로 가입된 계정입니다.'}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})
        except User.DoesNotExist:
            return JsonResponse({'err_msg': '가입되지 않은 계정입니다.'}, status=status.HTTP_400_BAD_REQUEST)
            
        except:
            pass
        
        password = request.data.get('password')
        if email and password:
            user = authenticate(email=email, password=password)
            if user:
                # 인증된 유저에 대한 RefreshToken 발급
                refresh = RefreshToken.for_user(user)
                # Cookies에 HTTP Only, Secure 속성으로 토큰을 저장하여 응답
                response = JsonResponse({'Login': 'success'}, status=status.HTTP_200_OK)
                response.set_cookie('access_token', str(refresh.access_token), httponly=True, secure=True)
                response.set_cookie('refresh_token', str(refresh), httponly=True, secure=True)
                return response
            return JsonResponse({'err_msg': '비밀번호를 확인해주세요.'}, status=status.HTTP_401_UNAUTHORIZED)
        return JsonResponse({'err_msg': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

# 로그아웃
class LogoutView(APIView):
    
    def get(self, request):
        requests.post(LOGOUT_URL, json={"refresh": request.COOKIES['refresh_token']})
        # Cookies에 저장되었던 토큰 제거하여 응답
        response = JsonResponse({'Logout': 'success'}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

# 유저정보
class UserInfoView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request, pk=None):
        # 본인인지 다른 유저인지 구분
        if request.user.is_anonymous:
            print('비로그인 유저')
            return JsonResponse({'err_msg': '로그인이 필요합니다.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if not pk:
            user = request.user
        elif request.user == User.objects.get(id=pk):
            print('로그인 유저 본인 프로필')
            user = request.user
        else:
            user = User.objects.get(id=pk)
        
        # 유저 프로필
        user_serializer = UserSerializer(user)
        # 유저가 작성한 보드 내역
        if not pk:
            boards = Board.objects.filter(user_id=user.id, is_deleted=False).order_by('-created_at')
        else:
            boards = Board.objects.filter(user_id=user.id, is_deleted=False, is_public=True).order_by('-created_at')
        
        # 페이지네이션 적용
        paginator = CustomPagination()
        paginator.page_size = 4

        # 쿼리셋 페이지네이트
        boards_page = paginator.paginate_queryset(boards, request)
        board_pin_serializer = BoardPinSerializer(boards_page, many=True)
        return paginator.get_paginated_response({'User': user_serializer.data, 'Boards': board_pin_serializer.data})
    
    def patch(self, request):
        # 비밀번호 수정 = 기존 비밀번호 검증 and (새 비밀번호 1 == 새 비밀번호 2)
        user = request.user
        password = request.data.get('password', None)
        new_password1 = request.data.get('new_password1', None)
        new_password2 = request.data.get('new_password2', None)
        
        # 기존 비밀번호 값이 전달되었다면 → 비밀번호 변경하려는 의도
        if password:
            password_check = authenticate(email=str(user), password=password)
            if password_check:
                if password == new_password1 == new_password2:
                    return JsonResponse({'err_msg': "변경하려는 비밀번호가 기존 비밀번호와 동일합니다."}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})
                
                headers = {"Authorization": f"Bearer {request.COOKIES['access_token']}"}
                change_password = {"new_password1": new_password1, "new_password2": new_password2}
                res = requests.post(PASSWORD_CHANGE_URL, json=change_password, headers=headers)
                
                if res.status_code == 200:
                    user.set_password(new_password1)
                    user.save()
                else:
                    # 비밀번호 변경이 정상적으로 이루어지지 않은 이유를 담아 응답
                    return JsonResponse({'err_msg': res.json()}, status=res.status_code, json_dumps_params={'ensure_ascii': False})
            else:
                return JsonResponse({'err_msg': "기존 비밀번호가 일치하지 않습니다."}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})
        
        if not password and (new_password1 or new_password2):
            return JsonResponse({'err_msg': "비밀번호 변경 시 기존 비밀번호 확인이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})
        
        # 프로필 수정(기존 비밀번호 입력 없이 변경 가능)
        nickname = request.data.get('nickname', None)
        profile_img = request.data.get('profile_img', None)
        
        data = {}
        if nickname:
            data['nickname'] = nickname
        if profile_img:
            data['profile_img'] = profile_img
        
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            profile_update = serializer.save()
            return JsonResponse({'Profile Update': serializer.data}, status=status.HTTP_200_OK)
        
        return JsonResponse({'err_msg': serializer.errors}, status=status.HTTP_400_BAD_REQUEST, json_dumps_params={'ensure_ascii': False})

# 유저 팔로우, 팔로우 해제
class UserFollow(APIView):
    
    def post(self, request):
        # 팔로우할 user 가져오기
        user_id = request.data.get('user_id')
        followed_user = User.objects.get(id=user_id)
        
        # 기존에 팔로우 내역이 있는지 조회(중복 생성 방지) - is_deleted가 True인 경우엔 새로 생성
        follow, created = Follow.objects.get_or_create(following_user=request.user, followed_user=followed_user, is_deleted=False)
        
        if created:
            return JsonResponse({'Follow': 'success'}, status=status.HTTP_201_CREATED)
        
        return JsonResponse({'Follow': '이미 팔로우한 유저입니다.'}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request, pk):
        # 팔로우 해제할 user 가져오기
        followed_user = User.objects.get(id=pk)
        
        # 해당 유저 팔로우 해제 - is_deleted 필드 True로 변경
        follow = Follow.objects.get(following_user=request.user, followed_user=followed_user, is_deleted=False)
        follow.is_deleted = True
        follow.save()
        
        return JsonResponse({'UnFollow': 'success'}, status=status.HTTP_204_NO_CONTENT)

# 팔로잉 목록 조회
class UserFollowing(APIView):
    
    def get(self, request, pk=None):
        if not pk:
            user_id = request.user.id
        else:
            user_id = pk
        
        # 특정 유저가 팔로우하는 리스트를 가져와 유저 정보와 함께 응답
        following = Follow.objects.filter(following_user_id=user_id, is_deleted=False)
        serializer = FollowingSerializer(following, many=True)
        return JsonResponse({'Following List': serializer.data}, status=status.HTTP_200_OK)

# 팔로워 목록 조회
class UserFollower(APIView):
    
    def get(self, request, pk=None):
        if not pk:
            user= request.user
        else:
            user = User.objects.get(id=pk)
        
        # 특정 유저를 팔로우하는 리스트를 가져와 유저 정보와 함께 응답
        follower = Follow.objects.filter(followed_user_id=user.id, is_deleted=False)
        serializer = FollowerSerializer(follower, many=True)
        return JsonResponse({'Follower List': serializer.data}, status=status.HTTP_200_OK)