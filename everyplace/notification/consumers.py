import json
from channels.generic.websocket import AsyncWebsocketConsumer

from django.db.models.signals import post_save
from django.dispatch import receiver
from board.models import BoardComment, BoardLike
from user.models import Follow
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # 특정 유저에게 알림을 보내기 위해 user_id를 channel name으로 사용
        self.room_name = self.scope["url_route"]["kwargs"]["user_id"]
        self.room_group_name = f'notification_{self.room_name}'

        # 채널 방 접속
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # 채널 방 퇴장
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data=None, bytes_data=None):
        pass

    # 채널 방에서 알림 메세지 수령
    async def send_notification(self, event):
        message = event['message']

        # WebSocket에 알림 메세지 전송
        await self.send(text_data=json.dumps({
            'message': message,
        }))


# BoardComment가 생성되었을때 실행되는 데코레이터
@receiver(post_save, sender=BoardComment)
def send_comment_notification(sender, instance, created, **kwargs):
    # 생성 트리거 확인
    if created:
        # 댓글 단 보드의 주인 유저 확인
        board_owner_id = instance.board_id.user_id.id
        # 댓글 단 보드의 주인과 댓글 단 유저가 다를 시 알림 보냄
        if board_owner_id != instance.user_id.id:
            channel_layer = get_channel_layer()
            message = f"'{instance.board_id.title}' 보드에 새 댓글이 달렸습니다"

            # WebSocket 연결을 통해 보드 주인에게 알림
            async_to_sync(channel_layer.group_send)(
                f'notification_{board_owner_id}',
                {
                    "type": "send.notification",
                    "message": message,
                }
            )
            # DB에 알림 저장
            Notification.objects.create(
                message=message,
                sender=instance.user_id,
                receiver=instance.board_id.user_id,
                is_read=False,
                is_deleted=False,
                related_url=f"{instance.board_id.id}",
            )


# BoardLike가 생성되었을때 실행되는 데코레이터
@receiver(post_save, sender=BoardLike)
def send_like_notification(sender, instance, created, **kwargs):
    # 생성 트리거 확인
    if created:
        # 좋아요한 보드의 주인 유저 확인
        board_owner_id = instance.board_id.user_id.id
        # 좋아요한 보드의 주인과 좋아요한 유저가 다를 시 알림 보냄
        if board_owner_id != instance.user_id.id:
            channel_layer = get_channel_layer()
            message = f"'{instance.user_id.email}'님이 '{instance.board_id.title}' 보드를 좋아합니다"

            # WebSocket 연결을 통해 보드 주인에게 알림
            async_to_sync(channel_layer.group_send)(
                f'notification_{board_owner_id}',
                {
                    "type": "send.notification",
                    "message": message,
                }
            )
            # DB에 알림 저장
            Notification.objects.create(
                message=message,
                sender=instance.user_id,
                receiver=instance.board_id.user_id,
                is_read=False,
                is_deleted=False,
                related_url=f"{instance.board_id.id}",
            )


# Follow가 생성되었을때 실행되는 데코레이터
@receiver(post_save, sender=Follow)
def send_follow_notification(sender, instance, created, **kwargs):
    # 생성 트리거 확인
    if created:
        channel_layer = get_channel_layer()
        message = f"'{instance.following_user.email}'님이 당신을 팔로우하였습니다"

        # WebSocket 연결을 통해 보드 주인에게 알림
        async_to_sync(channel_layer.group_send)(
            f'notification_{instance.followed_user.id}',
            {
                "type": "send.notification",
                "message": message,
            }
        )
        # DB에 알림 저장
        Notification.objects.create(
            message=message,
            sender=instance.following_user,
            receiver=instance.followed_user,
            is_read=False,
            is_deleted=False,
            related_url="",
        )
