from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CertificateView
from .views import VerifyCertificateView

router = DefaultRouter()
router.register(r'certificates', CertificateView, basename='certificate')

urlpatterns = [
    path('api/', include(router.urls)),
    path(
        "verify/",
        VerifyCertificateView.as_view(),
        name="verify-certificate"
    ),
]
