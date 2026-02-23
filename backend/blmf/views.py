from django.shortcuts import render
from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CardProps, ContactProps, DescriptionItem, ServiceCard
from .serializers import ContactPropsSerializer

# Create your views here.


class ServiceCardViewSet(APIView):

    def get(self, request, format=None):

        queryset = [email.email for email in ContactProps.objects.all()]
        return Response(queryset)
