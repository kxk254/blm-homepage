from django.shortcuts import render
from rest_framework import permissions, viewsets

from .models import CardProps, ContactProps, DescriptionItem, ServiceCard
from .serializers import ContactPropsSerializer

# Create your views here.


class ServiceCardViewSet(viewsets.ModelViewSet):
    queryset = ServiceCard.objects.all()
    serializer_class = ContactPropsSerializer
