from rest_framework import viewsets
from rest_framework.response import Response

from .models import CardProps, ContactProps, DescriptionItem, ServiceCard
from .serializers import ContactPropsSerializer

# Create your views here.


class ServiceCardViewSet(viewsets.ViewSet):

    def list(self, request):
        queryset = ContactProps.objects.all()
        serializer = ContactPropsSerializer(queryset, many=True)
        return Response(serializer.data)
