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