
from django.urls import path, include
import views 


urlpatterns = [
    path('', include('blmf.urls')),
    ]
