from django.db import models
from users.models import User, Child

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

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.chat} - {'Child' if self.is_from_user else 'Character'} - {self.created_at}"
