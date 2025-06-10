from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LearningProgressViewSet, ParentReviewViewSet

router = DefaultRouter()
router.register(r'learning-progress', LearningProgressViewSet, basename='learning-progress')
router.register(r'parent-reviews', ParentReviewViewSet, basename='parent-review')

urlpatterns = [
    path('', include(router.urls)),
] 