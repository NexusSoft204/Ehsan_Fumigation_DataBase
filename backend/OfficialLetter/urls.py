# your_app_name/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # آدرس ثبت مکتوب جدید
    path('create/', views.create_letter, name='create_letter'),
    
    # آدرس نمایش جزئیات مکتوب بر اساس شناسه (که در مرحله اول ساخته بودیم)
    path('<uuid:tracking_id>/', views.get_letter_detail, name='letter_detail'),
]
