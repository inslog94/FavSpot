from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


# Create your models here.
class Notification(models.Model):
    message = models.CharField(max_length=255)
    related_url = models.CharField(max_length=255, blank=True)
    sender = models.ForeignKey(
        User, related_name='notification_sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        User, related_name='notification_receiver', on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
