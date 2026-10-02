from django.contrib import admin
from .models import Certificate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    # فیلدهایی که در لیست اصلی ادمین نمایش داده می‌شوند
    list_display = (
        'certificateNumber', 
        'company', 
        'exporterName', 
        'countryOfDestination', 
        'issueDate', 
        'created_at'
    )
    
    # فیلدهایی که با کلیک روی آن‌ها صفحه ویرایش باز می‌شود
    list_display_links = ('certificateNumber', 'company')
    
    # فیلترهای سمت راست پنل برای دسترسی سریع‌تر
    list_filter = ('issueDate', 'countryOfDestination', 'company', 'created_at')
    
    # قابلیت جستجو بر اساس فیلدهای کلیدی
    search_fields = (
        'certificateNumber', 
        'registrationNo', 
        'exporterName', 
        'importerName', 
        'billOfLadingNo'
    )
    
    # دسته‌بندی مرتب فیلدها در صفحه ساخت و ویرایش (دقیقاً مشابه فرانت‌اند شما)
    fieldsets = (
        ('ارتباطات کمپانی', {
            'fields': ('company',)
        }),
        ('اطلاعات گواهی (Certificate Information)', {
            'fields': ('certificateNumber', 'registrationNo', 'issueDate', 'phytosanitaryNo'),
            'classes': ('wide',),
        }),
        ('اطلاعات وسیله نقلیه (Vehicle / Transport)', {
            'fields': ('plateNo', 'containerNumber'),
        }),
        ('اطلاعات محموله (Shipment Information)', {
            'fields': ('countryOfOrigin', 'countryOfDestination', 'portOfLoading', 'quantity', 'commodity', 'consignmentLink'),
        }),
        ('مشخصات صادرکننده (Exporter)', {
            'fields': ('exporterName', 'exporterAddress'),
        }),
        ('مشخصات واردکننده (Consignee / Importer)', {
            'fields': ('importerName', 'importerAddress'),
        }),
        ('🧪 مشخصات ضدعفونی (Fumigation / Treatment)', {
            'fields': (
                'treatmentType', 'fumigantType', 'prescribedDose', 'appliedDose', 
                'minTemperature', 'exposurePeriod', 'dateOfFumigation', 'placeOfFumigation', 
                'fumigatorLicense', 'accreditationNumber'
            ),
        }),
        ('اسناد و مدارک (Documents)', {
            'fields': ('exporterInvoiceNo', 'billOfLadingNo'),
        }),
    )

    # فیلدهایی که فقط قابل خواندن هستند و ادمین نمی‌تواند دستی تغییر دهد
    readonly_fields = ('created_at',)
    
    # مرتب‌سازی پیش‌فرض (نمایش جدیدترین گواهی‌ها در ابتدا)
    ordering = ('-created_at',)
