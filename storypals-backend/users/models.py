from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Child(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    AGE_GROUP_CHOICES = [
        ('3-5', '3-5 years'),
        ('6-8', '6-8 years'),
        ('9-12', '9-12 years'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='children')
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='O')
    age_group = models.CharField(max_length=20, choices=AGE_GROUP_CHOICES, default='5-8')
    avatar = models.ImageField(upload_to='child_avatars/', null=True, blank=True)
    
    # Preferences and abilities
    interests = models.JSONField(default=list)  # List of interests/hobbies
    languages = models.JSONField(default=list)  # List of languages known
    reading_level = models.CharField(max_length=50, default='Beginner')  # e.g., 'Beginner', 'Intermediate'
    favorite_topics = models.JSONField(default=list)  # List of favorite story topics
    learning_goals = models.JSONField(default=list)  # List of learning objectives
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.user.email}"
