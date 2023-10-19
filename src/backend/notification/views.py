from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Notification
from .serializers import NotificationSerializer
from drf_spectacular.utils import extend_schema, OpenApiResponse


# 알림 리스트 조회
class NotificationList(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="알림 리스트 조회 API",
        description="""이 엔드포인트는 인증된 사용자가 본인이 수신한 알림 목록을 볼 수 있게 해줍니다. 인증된 사용자만이 본인에게 수신된 알림(reciever가 본인의 id)들만 볼 수 있습니다.\n\n 이때 응답에는 알림 메세지, 읽음 여부, 수신자, 발신자, 발신 시간 등이 포함됩니다.
        """,
        responses={
            200: OpenApiResponse(description="조회 성공", response=NotificationSerializer(many=True)),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
        },
    )
    def get(self, request):
        user = request.user

        # 모든 알림 목록
        all_notifications = Notification.objects.filter(
            receiver=user, is_deleted=False)
        serializer = NotificationSerializer(all_notifications, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


# 알림 읽음 여부 체크
class NotificationReadMark(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="알림 읽음으로 처리 API",
        description="""이 엔드포인트로 접속하면 인증된 사용자가 본인이 수신한 알림에 대해 is_read 필드를 True로 바꿔 읽음으로 처리합니다. 인증된 사용자만이 본인에게 수신된 알림(reciever가 본인의 id)에 대해 읽음 처리할 수 있습니다.
        """,
        responses={
            200: OpenApiResponse(description="읽음 처리 성공"),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
            404: OpenApiResponse(description="해당 알림이 존재하지 않습니다."),
        },
    )
    def post(self, request, pk):
        user = request.user

        try:
            notification = Notification.objects.get(
                pk=pk, receiver=user, is_deleted=False)
        except Notification.DoesNotExist:
            return Response({'error': '해당 알림이 존재하지 않습니다.'}, status=status.HTTP_404_NOT_FOUND)

        notification.is_read = True
        notification.save()

        return Response(status=status.HTTP_200_OK)


# 알림 삭제
class NotificationDelete(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="알림 삭제 API",
        description="""이 엔드포인트는 인증된 사용자가 자신이 수신한 알림을 삭제하는 것을 허용합니다. 삭제 작업은 실제로 데이터베이스에서 알림을 제거하는 것이 아니라 'is_deleted' 필드의 값을 True로 변경하는 방식입니다. 이 방식은 실수로 인한 데이터 손실을 방지하고, 필요한 경우 데이터 복구를 용이하게 합니다.""",
        responses={
            204: OpenApiResponse(description="알림을 삭제 처리하였습니다."),
            401: OpenApiResponse(description="로그인하지 않은 사용자는 이용할 수 없습니다."),
            403: OpenApiResponse(description="알림을 삭제할 권한이 없습니다."),
            404: OpenApiResponse(description="해당 알림이 존재하지 않습니다.")
        }
    )
    def delete(self, request, pk):
        try:
            notification = Notification.objects.get(pk=pk, is_deleted=False)
        except Notification.DoesNotExist:
            return Response({'error': '해당 알림이 존재하지 않습니다.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user == notification.receiver:
            notification.is_deleted = True
            notification.save()

            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': '알림을 삭제할 권한이 없습니다.'}, status=status.HTTP_403_FORBIDDEN)
