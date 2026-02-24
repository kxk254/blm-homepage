from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

from . import views

urlpatterns = [
    path(
        "contact/", views.ContactPropsViewSet.as_view({"get": "list"}), name="contact"
    ),
    path("about/", views.ServiceCardViewSet.as_view({"get": "list"}), name="about"),
    path("home/", views.CardPropsViewSet.as_view({"get": "list"}), name="home"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
