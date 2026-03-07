from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"home", views.CardPropsViewSet, basename="home")
router.register(r"about", views.ServiceCardViewSet, basename="about")
router.register(r"contact", views.ContactPropsViewSet, basename="contact")
urlpatterns = router.urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
