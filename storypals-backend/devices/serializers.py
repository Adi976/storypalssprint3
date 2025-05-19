from rest_framework import serializers
from .models import Device, DeviceSession, DeviceInteraction

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id', 'device_id', 'name', 'is_active', 'last_seen', 'created_at']
        read_only_fields = ['id', 'last_seen', 'created_at']

class DeviceSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceSession
        fields = ['id', 'session_id', 'started_at', 'ended_at', 'is_active']
        read_only_fields = ['id', 'started_at']

class DeviceInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceInteraction
        fields = ['id', 'interaction_type', 'content', 'timestamp']
        read_only_fields = ['id', 'timestamp'] 