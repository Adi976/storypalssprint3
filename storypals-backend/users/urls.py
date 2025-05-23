from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ChildViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'children', ChildViewSet, basename='child')

urlpatterns = [
    path('', include(router.urls)),
] 