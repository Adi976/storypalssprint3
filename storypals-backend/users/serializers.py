from rest_framework import serializers
from .models import User, Child

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'phone_number', 'created_at')
        read_only_fields = ('id', 'created_at')

class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = ('id', 'name', 'age', 'avatar', 'created_at')
        read_only_fields = ('id', 'created_at')

class UserWithChildrenSerializer(serializers.ModelSerializer):
    children = ChildSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'phone_number', 'children', 'created_at')
        read_only_fields = ('id', 'created_at') 