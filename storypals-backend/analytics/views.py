from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import LearningProgress, ParentReview
from .serializers import LearningProgressSerializer, ParentReviewSerializer
from chat.models import Chat

# Create your views here.

class LearningProgressViewSet(viewsets.ModelViewSet):
    serializer_class = LearningProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LearningProgress.objects.filter(child__user=self.request.user)

    @action(detail=False, methods=['get'])
    def child_progress(self, request):
        child_id = request.query_params.get('child_id')
        if not child_id:
            return Response(
                {'error': 'child_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        progress = self.get_queryset().filter(child_id=child_id)
        serializer = self.get_serializer(progress, many=True)
        return Response(serializer.data)

class ParentReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ParentReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ParentReview.objects.filter(child__user=self.request.user)

    @action(detail=False, methods=['get'])
    def child_reviews(self, request):
        child_id = request.query_params.get('child_id')
        if not child_id:
            return Response(
                {'error': 'child_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reviews = self.get_queryset().filter(child_id=child_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
