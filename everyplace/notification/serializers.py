from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    sender_profile_img = serializers.ImageField(source='sender.profile_img')

    class Meta:
        model = Notification
        fields = ['id', 'message', 'sender', 'receiver',
                  'is_read', 'created_at', 'sender_profile_img', 'related_url']
