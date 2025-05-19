from rest_framework import serializers
from .models import Chat, Message, Story
from users.serializers import ChildSerializer

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = ('id', 'title', 'description', 'character', 'category', 
                 'content', 'image', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'content', 'is_from_user', 'audio_file', 'created_at')
        read_only_fields = ('id', 'created_at')

class ChatSerializer(serializers.ModelSerializer):
    child = ChildSerializer(read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    story = StorySerializer(read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'child', 'character', 'story', 'messages', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at') 