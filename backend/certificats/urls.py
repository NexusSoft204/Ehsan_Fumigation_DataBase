from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CertificateView, VerifyCertificateView

router = DefaultRouter()
router.register(r'certificates', CertificateView, basename='certificate')

urlpatterns = [
    path('', include(router.urls)), 
    
    # آدرس را به این شکل تغییر دهید تا متغیر را از مسیر بخواند
    path(
        "certificates/verify/<str:certificate_number>/",
        VerifyCertificateView.as_view(),
        name="verify-certificate"
    ),
]
