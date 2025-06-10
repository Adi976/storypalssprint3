from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet, MessageViewSet, StoryViewSet, PublicChatView

router = DefaultRouter()
router.register(r'', ChatViewSet, basename='chat')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'stories', StoryViewSet, basename='story')

urlpatterns = [
    path('', include(router.urls)),
    path('public/', PublicChatView.as_view(), name='public-chat'),
] 