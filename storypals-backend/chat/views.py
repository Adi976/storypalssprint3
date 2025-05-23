from django.shortcuts import render
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Chat, Message, Story, ChatAnalytics, LearningMilestone, CharacterInteraction
from .serializers import (
    ChatSerializer, MessageSerializer, StorySerializer, ChatAnalyticsSerializer,
    LearningMilestoneSerializer, CharacterInteractionSerializer, ChatHistorySerializer
)
from users.models import Child
import requests
import json
from django.db.models import Count, Avg, Sum, Q
from django.utils import timezone
from datetime import timedelta

# Create your views here.

class PublicChatView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            character = request.data.get('character')
            content = request.data.get('content')

            if not character or not content:
                return Response(
                    {'error': 'Character and content are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # First check if Ollama is running
            try:
                models_response = requests.get('http://localhost:11434/api/tags', timeout=5)
                models_response.raise_for_status()
                available_models = [model['name'] for model in models_response.json().get('models', [])]
            except requests.exceptions.RequestException as e:
                return Response(
                    {'error': 'Ollama service is not running. Please start Ollama with "ollama serve" command.'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

            # Try to use character-specific model first, then fallback to gemma:2b
            model_name = f"{character.lower()}:latest"
            if model_name not in available_models:
                model_name = 'gemma:2b'
                if model_name not in available_models:
                    return Response(
                        {'error': 'No suitable model available. Please install at least one model using "ollama pull gemma:2b"'},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )

            try:
                response = requests.post(
                    'http://localhost:11434/api/generate',
                    json={
                        'model': model_name,
                        'prompt': f"Character: {character}\nUser: {content}\nAssistant:",
                        'stream': False,
                        'options': {
                            'temperature': 0.7,
                            'top_p': 0.9,
                            'max_tokens': 500
                        }
                    },
                    timeout=30
                )
                response.raise_for_status()
                response_data = response.json()
                return Response({'response': response_data.get('response', '')})
            except requests.exceptions.Timeout:
                return Response(
                    {'error': 'Ollama request timed out. The model might be too slow or overloaded.'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            except requests.exceptions.RequestException as e:
                return Response(
                    {'error': f'Error communicating with Ollama: {str(e)}'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
        except Exception as e:
            return Response(
                {'error': f'An unexpected error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'character', 'category']
    ordering_fields = ['created_at', 'updated_at']

class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['character']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        return Chat.objects.filter(child__parent=self.request.user)

    @action(detail=False, methods=['get'])
    def history(self, request):
        child_id = request.query_params.get('child')
        character = request.query_params.get('character')
        
        if not child_id:
            return Response([])

        try:
            child = Child.objects.get(id=child_id, parent=request.user)
        except Child.DoesNotExist:
            return Response([])

        try:
            chats = Chat.objects.filter(child=child)
            if character:
                chats = chats.filter(character=character)

            if not chats.exists():
                return Response([])

            # Get the latest chat for this character
            latest_chat = chats.order_by('-created_at').first()
            messages = Message.objects.filter(chat=latest_chat).order_by('created_at')
            
            # Transform messages to match frontend format
            formatted_messages = [{
                'text': msg.content,
                'sender': 'user' if msg.is_from_user else 'bot',
                'timestamp': msg.created_at.isoformat(),
                'characterId': character,
                'status': 'sent'
            } for msg in messages]

            return Response(formatted_messages)
        except Exception as e:
            print(f"Error fetching chat history: {str(e)}")
            return Response([])

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        child_id = request.query_params.get('child_id')
        if not child_id:
            return Response(
                {'error': 'child_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            child = Child.objects.get(id=child_id, parent=request.user)
        except Child.DoesNotExist:
            return Response(
                {'error': 'Child not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get time range from query params
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)

        # Get all chats for analytics
        chats = Chat.objects.filter(child=child, created_at__gte=start_date)
        messages = Message.objects.filter(chat__in=chats)
        analytics = ChatAnalytics.objects.filter(chat__in=chats)

        # Calculate overall metrics
        total_chats = chats.count()
        total_messages = messages.count()
        total_duration = analytics.aggregate(total=Sum('total_duration'))['total'] or 0
        avg_vocabulary = analytics.aggregate(avg=Avg('average_vocabulary_score'))['avg'] or 0
        avg_grammar = analytics.aggregate(avg=Avg('average_grammar_score'))['avg'] or 0

        # Calculate character-specific metrics
        character_metrics = {}
        for chat in chats:
            char_analytics = analytics.filter(chat=chat).first()
            if char_analytics:
                if chat.character not in character_metrics:
                    character_metrics[chat.character] = {
                        'total_chats': 0,
                        'total_messages': 0,
                        'total_duration': 0,
                        'avg_vocabulary': 0,
                        'avg_grammar': 0,
                        'topics': set()
                    }
                
                metrics = character_metrics[chat.character]
                metrics['total_chats'] += 1
                metrics['total_messages'] += char_analytics.total_messages
                metrics['total_duration'] += char_analytics.total_duration
                metrics['avg_vocabulary'] = (metrics['avg_vocabulary'] * (metrics['total_chats'] - 1) + 
                                          char_analytics.average_vocabulary_score) / metrics['total_chats']
                metrics['avg_grammar'] = (metrics['avg_grammar'] * (metrics['total_chats'] - 1) + 
                                       char_analytics.average_grammar_score) / metrics['total_chats']
                if char_analytics.topics_covered:
                    metrics['topics'].update(char_analytics.topics_covered)

        # Convert sets to lists for JSON serialization
        for metrics in character_metrics.values():
            metrics['topics'] = list(metrics['topics'])

        # Get learning milestones
        milestones = LearningMilestone.objects.filter(
            child=child,
            achieved_at__gte=start_date
        )

        return Response({
            'overall': {
                'total_chats': total_chats,
                'total_messages': total_messages,
                'total_duration': total_duration,
                'average_vocabulary_score': avg_vocabulary,
                'average_grammar_score': avg_grammar
            },
            'by_character': character_metrics,
            'milestones': LearningMilestoneSerializer(milestones, many=True).data
        })

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        try:
            chat = self.get_object()
            content = request.data.get('content')
            is_from_user = request.data.get('is_from_user', True)

            if not content:
                return Response(
                    {'error': 'Content is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create message
            message = Message.objects.create(
                chat=chat,
                content=content,
                is_from_user=is_from_user
            )

            # If it's a user message, get response from Ollama
            if is_from_user:
                try:
                    # First check if Ollama is running
                    try:
                        models_response = requests.get('http://localhost:11434/api/tags', timeout=5)
                        models_response.raise_for_status()
                        available_models = [model['name'] for model in models_response.json().get('models', [])]
                    except requests.exceptions.RequestException as e:
                        return Response(
                            {'error': 'Ollama service is not running. Please start Ollama with "ollama serve" command.'},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE
                        )
                    
                    # Try to use character-specific model first, then fallback to gemma:2b
                    model_name = f"{chat.character.lower()}:latest"
                    if model_name not in available_models:
                        model_name = 'gemma:2b'
                        if model_name not in available_models:
                            return Response(
                                {'error': 'No suitable model available. Please install at least one model using "ollama pull gemma:2b"'},
                                status=status.HTTP_503_SERVICE_UNAVAILABLE
                            )

                    try:
                        response = requests.post(
                            'http://localhost:11434/api/generate',
                            json={
                                'model': model_name,
                                'prompt': f"Character: {chat.character}\nUser: {content}\nAssistant:",
                                'stream': False,
                                'options': {
                                    'temperature': 0.7,
                                    'top_p': 0.9,
                                    'max_tokens': 500
                                }
                            },
                            timeout=30
                        )
                        response.raise_for_status()
                        response_data = response.json()
                        assistant_response = response_data.get('response', 'Sorry, I could not process your request.')

                        # Create assistant message
                        assistant_message = Message.objects.create(
                            chat=chat,
                            content=assistant_response,
                            is_from_user=False
                        )

                        # Update analytics
                        try:
                            analytics, _ = ChatAnalytics.objects.get_or_create(chat=chat)
                            analytics.total_messages += 2
                            analytics.total_words += len(content.split()) + len(assistant_response.split())
                            analytics.save()
                        except Exception as e:
                            print(f"Error updating analytics: {str(e)}")

                        return Response({
                            'response': assistant_response
                        })
                    except requests.exceptions.Timeout:
                        return Response(
                            {'error': 'Ollama request timed out. The model might be too slow or overloaded.'},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE
                        )
                    except requests.exceptions.RequestException as e:
                        return Response(
                            {'error': f'Error communicating with Ollama: {str(e)}'},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE
                        )
                except Exception as e:
                    print(f"Error communicating with Ollama: {str(e)}")
                    return Response(
                        {'error': 'Unable to connect to Ollama. Please make sure it is running.'},
                        status=status.HTTP_503_SERVICE_UNAVAILABLE
                    )
            else:
                return Response({'response': message.content})
        except Exception as e:
            print(f"Error in send_message: {str(e)}")
            return Response(
                {'error': 'An unexpected error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(chat__child__parent=self.request.user)

    def perform_create(self, serializer):
        message = serializer.save()
        # Update chat analytics
        chat = message.chat
        analytics, _ = ChatAnalytics.objects.get_or_create(chat=chat)
        
        # Update basic metrics
        analytics.total_messages += 1
        analytics.total_words += len(message.content.split())
        
        # Update character interaction
        interaction, _ = CharacterInteraction.objects.get_or_create(
            child=chat.child,
            character=chat.character
        )
        interaction.total_chats = Chat.objects.filter(
            child=chat.child,
            character=chat.character
        ).count()
        interaction.save()
        
        analytics.save()

class LearningMilestoneViewSet(viewsets.ModelViewSet):
    serializer_class = LearningMilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LearningMilestone.objects.filter(child__parent=self.request.user)

class CharacterInteractionViewSet(viewsets.ModelViewSet):
    serializer_class = CharacterInteractionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CharacterInteraction.objects.filter(child__parent=self.request.user)
