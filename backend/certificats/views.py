from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Certificate
from .serializers import CertificateSerializer


class CertificateView(ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [IsAuthenticated]





# ________________Verification __certificate_____________ 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import Certificate
from .serializers import CertificateSerializer


class VerifyCertificateView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):

        certificate_number = request.query_params.get(
            "certificate"
        )

        if not certificate_number:
            return Response(
                {
                    "detail": "Certificate number is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            certificate = Certificate.objects.get(
                certificate_number=certificate_number
            )

        except Certificate.DoesNotExist:
            return Response(
                {
                    "detail": "Certificate not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CertificateSerializer(certificate)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
