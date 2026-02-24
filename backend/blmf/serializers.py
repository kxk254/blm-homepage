from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import CardProps, ContactProps, DescriptionItem, ServiceCard


class CardPropsSerializer(serializers.ModelSerializer):

    class Meta:
        model = CardProps
        fields = "__all__"

    image_src = serializers.ImageField(use_url=False)


class ContactPropsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactProps
        fields = "__all__"


class DescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DescriptionItem
        fields = "__all__"

    def validate(self, data):
        type_choice = data.get("type")
        href = data.get("href")

        if self.type_choice == self.TypeChoices.LINK and not self.href:
            raise ValidationError("Href is required when type is 'link'.")

        if self.type_choice == self.TypeChoices.TEXT and self.href:
            raise ValidationError("Href should be empty when type is 'text'.")

        return data


class ServiceCardSerializer(serializers.ModelSerializer):
    descriptions = DescriptionItemSerializer(many=True)

    class Meta:
        model = ServiceCard
        fields = "__all__"
