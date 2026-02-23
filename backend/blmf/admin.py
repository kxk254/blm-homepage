from django.contrib import admin

from .models import CardProps, ContactProps, DescriptionItem, ServiceCard

# Register your models here.
admin.site.register(ContactProps)
admin.site.register(CardProps)
admin.site.register(ServiceCard)
admin.site.register(DescriptionItem)
