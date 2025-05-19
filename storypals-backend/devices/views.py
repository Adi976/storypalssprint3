from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
import uuid
from .models import Device, DeviceSession, DeviceInteraction
from .serializers import DeviceSerializer, DeviceSessionSerializer, DeviceInteractionSerializer

# Create your views here.

class DeviceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DeviceSerializer

    def get_queryset(self):
        return Device.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def start_session(self, request, pk=None):
        device = self.get_object()
        session = DeviceSession.objects.create(
            device=device,
            session_id=str(uuid.uuid4()),
            is_active=True
        )
        return Response(DeviceSessionSerializer(session).data)

    @action(detail=True, methods=['post'])
    def end_session(self, request, pk=None):
        device = self.get_object()
        session = device.sessions.filter(is_active=True).first()
        if session:
            session.is_active = False
            session.ended_at = timezone.now()
            session.save()
            return Response(DeviceSessionSerializer(session).data)
        return Response({'error': 'No active session found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def record_interaction(self, request, pk=None):
        device = self.get_object()
        session = device.sessions.filter(is_active=True).first()
        if not session:
            return Response({'error': 'No active session found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = DeviceInteractionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(device=device, session=session)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def get_interactions(self, request, pk=None):
        device = self.get_object()
        interactions = DeviceInteraction.objects.filter(device=device).order_by('-timestamp')
        serializer = DeviceInteractionSerializer(interactions, many=True)
        return Response(serializer.data)
