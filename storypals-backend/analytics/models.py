from django.db import models
from users.models import Child
from chat.models import Chat

class LearningProgress(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='learning_progress')
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='learning_progress')
    vocabulary_learned = models.JSONField(default=dict)  # Store new words learned
    topics_discussed = models.JSONField(default=dict)    # Store topics covered
    engagement_score = models.FloatField(default=0.0)    # Measure of child's engagement
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.child.name} - {self.chat.character} - {self.updated_at}"

class ParentReview(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='parent_reviews')
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='parent_reviews')
    notes = models.TextField(blank=True)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.child.name} - {self.chat.character} - {self.updated_at}"
