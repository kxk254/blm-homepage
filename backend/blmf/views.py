from rest_framework import viewsets
from rest_framework.response import Response

from .models import CardProps, ContactProps, DescriptionItem, ServiceCard
from .serializers import (
    CardPropsSerializer,
    ContactPropsSerializer,
    DescriptionItemSerializer,
    ServiceCardSerializer,
)

# Create your views here.


class ContactPropsViewSet(viewsets.ModelViewSet):
    queryset = ContactProps.objects.all()
    serializer_class = ContactPropsSerializer


class CardPropsViewSet(viewsets.ModelViewSet):
    queryset = CardProps.objects.all()
    serializer_class = CardPropsSerializer


class ServiceCardViewSet(viewsets.ModelViewSet):
    queryset = ServiceCard.objects.all()
    serializer_class = ServiceCardSerializer
