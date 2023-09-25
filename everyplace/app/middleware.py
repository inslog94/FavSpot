from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from django.http import JsonResponse

class CookieToAuthorizationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Cookies에서 토큰을 추출하여 Authorization 헤더에 설정
        if 'access_token' in request.COOKIES:
            token = request.COOKIES['access_token']
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'

        response = self.get_response(request)
        return response
    

class Convert403to401Middleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if response.status_code == 403:
            try:
                detail = response.data.get('detail', '')

                if 'authentication' in detail.lower():
                    response.status_code = 401
            except AttributeError:
                pass

        if response.status_code == 401:
            response = JsonResponse({'error': '로그인하지 않은 사용자는 이용할 수 없습니다.'}, status=status.HTTP_401_UNAUTHORIZED)

        return response