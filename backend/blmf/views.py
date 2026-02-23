from django.shortcuts import render
from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import CardProps, ContactProps, DescriptionItem, ServiceCard
from .serializers import ContactPropsSerializer

# Create your views here.


class ServiceCardViewSet(viewsets.ModelViewSet):
    queryset = ContactProps.objects.all()
    serializer_class = ContactPropsSerializer
