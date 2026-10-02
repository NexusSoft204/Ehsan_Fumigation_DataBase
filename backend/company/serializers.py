from rest_framework import serializers
from .models import Company, CompanyRepresentative

class CompanyRepresentativeSerializer(serializers.ModelSerializer):
    # فیلد id را اختیاری می‌گذاریم تا در زمان آپدیت بتوانیم افراد را شناسایی کنیم
    id = serializers.IntegerField(required=False)

    class Meta:
        model = CompanyRepresentative
        fields = ['id', 'name', 'position', 'phone', 'email']


class CompanySerializer(serializers.ModelSerializer):
    # اتصال سریالایزر مسئولین به صورت یک لیست داخل شرکت
    representatives = CompanyRepresentativeSerializer(many=True)

    class Meta:
        model = Company
        fields = [
            'id', 'company_name', 'registration_number', 'company_type', 
            'industry', 'phone_number', 'email', 'website', 'province', 
            'district', 'city', 'full_address', 'status', 'representatives'
        ]

    # ۱. منطق سفارشی برای ساخت همزمان (Create)
    def create(self, validated_data):
        representatives_data = validated_data.pop('representatives', [])
        # ساخت شرکت
        company = Company.objects.create(**validated_data)
        # ساخت مسئولین متصل به شرکت
        for rep_data in representatives_data:
            CompanyRepresentative.objects.create(company=company, **rep_data)
        return company

    # ۲. منطق سفارشی برای آپدیت همزمان (Update)
    def update(self, instance, validated_data):
        representatives_data = validated_data.pop('representatives', None)
        
        # بروزرسانی فیلدهای خود شرکت
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # بروزرسانی مسئولین شرکت
        if representatives_data is not None:
            # روش بهینه: حذف موارد قدیمی و جایگزینی با لیست جدید ارسالی از فرانت‌هند
            instance.representatives.all().delete()
            for rep_data in representatives_data:
                # حذف id احتمالی برای ثبت جدید بدون تداخل
                rep_data.pop('id', None)
                CompanyRepresentative.objects.create(company=instance, **rep_data)
                
        return instance
