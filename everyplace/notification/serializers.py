from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    sender_email = serializers.ReadOnlyField(source='sender.email')

    class Meta:
        model = Notification
        fields = ['message', 'sender', 'receiver',
                  'is_read', 'created_at', 'sender_email']
