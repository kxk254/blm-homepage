from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
class ContactProps(models.Model):
    email = models.EmailField(max_length=100)
    instagram = models.URLField(max_length=200)

    def __str__(self):
        return self.email


class CardProps(models.Model):
    product_type = models.CharField(max_length=100)
    product_color = models.CharField(max_length=50)
    product_name = models.CharField(max_length=100)
    product_description = models.TextField()
    product_price = models.PositiveIntegerField()
    image_src = models.ImageField(upload_to="services",blank=True, null=True)
    link = models.URLField(max_length=100)

    def __str__(self):
        return self.product_name

class ServiceCard(models.Model):
    service = models.CharField(max_length=255)
    image_src1 = models.ImageField(upload_to="services",blank=True, null=True)
    image_src2 = models.ImageField(upload_to="services",blank=True, null=True)
    image_src3 = models.ImageField(upload_to="services",blank=True, null=True)
    content = models.TextField() 
    link = models.URLField(blank=True, null=True)
    icon = models.CharField(max_length=100)

    def __str__(self):
        return self.service




class DescriptionItem(models.Model):

    class TypeChoices(models.TextChoices):
        TEXT = "text", "Text"
        LINK = "link", "Link"

    service_id = models.ForeignKey(
            ServiceCard,
            related_name="descriptions",
            on_delete=models.CASCADE
            )
    type_choice = models.CharField(
            max_length=100,
            choices=TypeChoices.choices
            )
    content = models.TextField()
    href = models.URLField(blank=True, null=True) 
    icon = models.CharField(max_length=100) 

    def __str__(self):
        return f"{self.serivce.service} - {self.type_choices}"

    def clean(self):
        if self.type_choice == self.TypeChoices.LINK and not self.href:
            raise ValidationError("Href is required when type is 'link'.")

        if self.type_choice == self.TypeChoices.TEXT and self.href:
            raise ValidationError("Href should be empty when type is 'text'.")


