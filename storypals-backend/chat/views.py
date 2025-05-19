from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Chat, Message, Story
from .serializers import ChatSerializer, MessageSerializer, StorySerializer
from users.models import Child
import requests
import json

# Create your views here.

class PublicChatView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        character = request.data.get('character')
        content = request.data.get('content')

        if not character or not content:
            return Response(
                {'error': 'Character and content are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Get response from Ollama
            response = requests.post(
                'http://localhost:11434/api/generate',
                json={
                    'model': 'gemma:2b',
                    'prompt': f"Character: {character}\nUser: {content}\nAssistant:",
                    'stream': False
                }
            )
            response_data = response.json()
            assistant_response = response_data.get('response', 'Sorry, I could not process your request.')

            return Response({
                'character': character,
                'user_message': content,
                'assistant_message': assistant_response
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Story.objects.all()
        character = self.request.query_params.get('character')
        category = self.request.query_params.get('category')
        
        if character:
            queryset = queryset.filter(character=character)
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Chat.objects.filter(child__user=self.request.user)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        chat = self.get_object()
        content = request.data.get('content')
        audio_file = request.FILES.get('audio_file')

        # Create user message
        message = Message.objects.create(
            chat=chat,
            content=content,
            is_from_user=True,
            audio_file=audio_file
        )

        # Get response from Ollama
        try:
            response = requests.post(
                'http://localhost:11434/api/generate',
                json={
                    'model': 'gemma:2b',
                    'prompt': f"Character: {chat.character}\nUser: {content}\nAssistant:",
                    'stream': False
                }
            )
            response_data = response.json()
            assistant_response = response_data.get('response', 'Sorry, I could not process your request.')

            # Create assistant message
            Message.objects.create(
                chat=chat,
                content=assistant_response,
                is_from_user=False
            )

            return Response({
                'user_message': MessageSerializer(message).data,
                'assistant_message': assistant_response
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MessageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(chat__child__user=self.request.user)
