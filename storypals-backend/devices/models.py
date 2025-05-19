from django.db import models
from django.conf import settings

class Device(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='devices')
    device_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    last_seen = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.device_id})"

class DeviceSession(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='sessions')
    session_id = models.CharField(max_length=100, unique=True)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Session {self.session_id} for {self.device.name}"

class DeviceInteraction(models.Model):
    INTERACTION_TYPES = [
        ('AUDIO_IN', 'Audio Input'),
        ('AUDIO_OUT', 'Audio Output'),
        ('ERROR', 'Error'),
    ]

    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='interactions')
    session = models.ForeignKey(DeviceSession, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_TYPES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.interaction_type} at {self.timestamp}"
