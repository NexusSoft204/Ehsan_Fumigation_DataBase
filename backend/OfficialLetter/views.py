from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import OfficialLetter
from .serializers import OfficialLetterSerializer

@api_view(['POST'])
@permission_classes([AllowAny]) # در صورت نیاز به احراز هویت، می‌توانید این بخش را تغییر دهید
def create_letter(request):
    # دادن داده‌های ورودی مستقیم به سریالایزر جهت بررسی صحت داده‌ها
    serializer = OfficialLetterSerializer(data=request.data)
    
    if serializer.is_valid():
        # ذخیره مکتوب در دیتابیس
        new_letter = serializer.save()
        
        # بازگرداندن پاسخ موفقیت آمیز همراه با اطلاعات مکتوب ساخته شده
        return Response({
            "message": "مکتوب با موفقیت ثبت شد",
            "tracking_id": str(new_letter.tracking_id)
        }, status=status.HTTP_201_CREATED)
    
    # در صورت وجود هرگونه خطا در داده‌های ارسالی فرانت‌آند، خطاها خودکار برگشت داده می‌شوند
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_letter_detail(request, tracking_id):
    try:
        letter = OfficialLetter.objects.get(tracking_id=tracking_id)
        serializer = OfficialLetterSerializer(letter)
        
        # ترکیب اطلاعات سریالایزر شده با لینک هوشمند بارکد برای فرانت‌آند
        response_data = serializer.data
        response_data['qr_url'] = letter.qr_url
        response_data['created_at'] = letter.created_at.strftime("%Y/%m/%d") # فرمت تاریخ شمسی یا میلادی دلخواه
        
        return Response(response_data, status=status.HTTP_200_OK)
    except OfficialLetter.DoesNotExist:
        return Response({"error": "مکتوب مورد نظر یافت نشد."}, status=status.HTTP_404_NOT_FOUND)




from rest_framework.generics import ListAPIView
class AllofficalLetterListApi(ListAPIView):
    queryset = OfficialLetter.objects.all()
    serializer_class = OfficialLetterSerializer