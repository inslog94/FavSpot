import json
from channels.generic.websocket import AsyncWebsocketConsumer


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
