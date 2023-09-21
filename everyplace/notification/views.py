from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Notification
from .serializers import NotificationSerializer


# 알림 목록 조회
class NotificationList(APIView):
    permission_classes = [IsAuthenticated]

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

    def post(self, request, pk):
        user = request.user

        try:
            notification = Notification.objects.get(
                pk=pk, receiver=user, is_deleted=False)
        except Notification.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        notification.is_read = True
        notification.save()

        return Response(status=status.HTTP_200_OK)


# 알림 삭제
class NotificationDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk)

        if request.user == notification.receiver:
            notification.is_deleted = True
            notification.save()

            return Response({"detail": "알림을 삭제 처리하였습니다."}, status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "알림을 삭제할 권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)
