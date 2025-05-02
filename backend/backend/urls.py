from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('authservice.urls'))
        
]+static(settings.MEDIA_URL , document_root = settings.MEDIA_ROOT)