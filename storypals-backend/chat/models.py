from django.db import models
from users.models import User, Child
from django.contrib.postgres.fields import ArrayField

class Story(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    character = models.CharField(max_length=100)  # e.g., 'Luna', 'Dodo', etc.
    category = models.CharField(max_length=100)  # e.g., 'Space', 'Fantasy', etc.
    content = models.TextField()
    image = models.ImageField(upload_to='story_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['title', 'character']  # Prevent duplicate stories for same character

    def __str__(self):
        return f"{self.title} - {self.character}"

class Chat(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='chats')
    character = models.CharField(max_length=100)  # e.g., 'Luna', 'Dodo', etc.
    story = models.ForeignKey(Story, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.child.name} - {self.character}"

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    is_from_user = models.BooleanField(default=True)  # True if from child, False if from character
    audio_file = models.FileField(upload_to='chat_audio/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # New fields for analytics
    vocabulary_score = models.FloatField(null=True, blank=True)
    grammar_score = models.FloatField(null=True, blank=True)
    sentiment_score = models.FloatField(null=True, blank=True)
    topics = ArrayField(models.CharField(max_length=50), null=True, blank=True)
    reading_level = models.CharField(max_length=20, null=True, blank=True)
    word_count = models.IntegerField(default=0)
    response_time = models.FloatField(null=True, blank=True)  # Time taken to respond in seconds

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.chat} - {'Child' if self.is_from_user else 'Character'} - {self.created_at}"

class ChatAnalytics(models.Model):
    chat = models.OneToOneField(Chat, on_delete=models.CASCADE, related_name='analytics')
    total_messages = models.IntegerField(default=0)
    total_words = models.IntegerField(default=0)
    unique_words = models.IntegerField(default=0)
    average_vocabulary_score = models.FloatField(default=0)
    average_grammar_score = models.FloatField(default=0)
    average_sentiment_score = models.FloatField(default=0)
    total_duration = models.FloatField(default=0)  # Total chat duration in minutes
    topics_covered = ArrayField(models.CharField(max_length=50), null=True, blank=True)
    vocabulary_growth = models.JSONField(default=dict)  # Store vocabulary growth over time
    grammar_improvement = models.JSONField(default=dict)  # Store grammar improvement over time
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Analytics for {self.chat}"

class LearningMilestone(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='milestones')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50)  # e.g., 'Vocabulary', 'Grammar', 'Reading'
    achieved_at = models.DateTimeField(auto_now_add=True)
    metrics = models.JSONField(default=dict)  # Store specific metrics related to the milestone

    class Meta:
        ordering = ['-achieved_at']

    def __str__(self):
        return f"{self.child.name} - {self.title}"

class CharacterInteraction(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='character_interactions')
    character = models.CharField(max_length=100)
    total_time_spent = models.FloatField(default=0)  # Total time spent in minutes
    total_chats = models.IntegerField(default=0)
    favorite_topics = ArrayField(models.CharField(max_length=50), null=True, blank=True)
    last_interaction = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-last_interaction']
        unique_together = ['child', 'character']

    def __str__(self):
        return f"{self.child.name} - {self.character}"
