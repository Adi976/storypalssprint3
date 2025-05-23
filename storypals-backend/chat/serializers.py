from rest_framework import serializers
from .models import Chat, Message, Story, ChatAnalytics, LearningMilestone, CharacterInteraction
from users.serializers import ChildSerializer

class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Story
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ('vocabulary_score', 'grammar_score', 'sentiment_score', 'topics', 'reading_level', 'word_count', 'response_time')

class ChatSerializer(serializers.ModelSerializer):
    child = ChildSerializer(read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    story = StorySerializer(read_only=True)
    analytics = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = '__all__'

    def get_analytics(self, obj):
        try:
            return ChatAnalyticsSerializer(obj.analytics).data
        except ChatAnalytics.DoesNotExist:
            return None

class ChatAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatAnalytics
        fields = '__all__'

class LearningMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningMilestone
        fields = '__all__'

class CharacterInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacterInteraction
        fields = '__all__'

class ChatHistorySerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    character_name = serializers.CharField(source='character')
    child_name = serializers.CharField(source='child.name')
    total_messages = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'character_name', 'child_name', 'created_at', 'updated_at', 
                 'messages', 'total_messages', 'duration']

    def get_total_messages(self, obj):
        return obj.messages.count()

    def get_duration(self, obj):
        try:
            return obj.analytics.total_duration
        except ChatAnalytics.DoesNotExist:
            return 0 