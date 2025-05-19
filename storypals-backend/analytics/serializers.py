from rest_framework import serializers
from .models import LearningProgress, ParentReview
from users.serializers import ChildSerializer
from chat.serializers import ChatSerializer

class LearningProgressSerializer(serializers.ModelSerializer):
    child = ChildSerializer(read_only=True)
    chat = ChatSerializer(read_only=True)

    class Meta:
        model = LearningProgress
        fields = ('id', 'child', 'chat', 'vocabulary_learned', 'topics_discussed', 
                 'engagement_score', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class ParentReviewSerializer(serializers.ModelSerializer):
    child = ChildSerializer(read_only=True)
    chat = ChatSerializer(read_only=True)

    class Meta:
        model = ParentReview
        fields = ('id', 'child', 'chat', 'notes', 'rating', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at') 