from django.urls import include, path

from . import views

urlpatterns = [
    path("contact/", views.ServiceCardViewSet.as_view({"get": "list"})),
]
