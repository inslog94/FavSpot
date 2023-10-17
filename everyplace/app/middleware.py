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
        # 인증되지 않은 경우 rest_framework.permissions.IsAuthenticated로 인해 403(Forbidden) 응답 반환
        if response.get('data', ''):
            token_not_given = "authentication" in response.data.get('detail', '') # 요청에 JWT 토큰이 포함되지 않은 경우
            token_not_valid = "not valid" in response.data.get('detail', '') # 만료된 JWT 토큰이 전달된 경우
            
            if response.status_code == 403 and (token_not_given or token_not_valid):
                response = JsonResponse({'error': '로그인하지 않은 사용자는 이용할 수 없습니다.'}, status=status.HTTP_401_UNAUTHORIZED) # 401(Unauthorized) 응답으로 바꿔서 반환
                response.set_cookie('login_check', False) # Cookies에 로그인 여부 False값 담아서 응답
            
        return response