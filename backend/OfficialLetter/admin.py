from django.contrib import admin
from django.utils.html import format_html
from .models import OfficialLetter

@admin.register(OfficialLetter)
class OfficialLetterAdmin(admin.ModelAdmin):
    # فیلدهایی که در لیست اصلی ادمین نمایش داده می‌شوند
    list_display = ('tracking_id', 'destination', 'subject', 'created_at', 'view_qr_link')
    
    # فیلدهایی که کاربر می‌تواند با کلیک روی آن‌ها وارد صفحه جزئیات شود
    list_display_links = ('tracking_id', 'destination')
    
    # ابزار جستجو بر اساس سازمان مقصد، موضوع و شناسه مکتوب
    search_fields = ('destination', 'subject', 'tracking_id')
    
    # فیلتر مکتوبات بر اساس تاریخ ثبت
    list_filter = ('created_at',)
    
    # فیلدهایی که در صفحه ویرایش فقط قابل خواندن هستند و نباید تغییر کنند
    readonly_fields = ('tracking_id', 'created_at', 'show_qr_url')
    
    # دسته‌بندی فیلدها در صفحه ویرایش/مشاهده مکتوب
    fieldsets = (
        ('اطلاعات اصلی مکتوب', {
            'fields': ('destination', 'subject', 'content')
        }),
        ('سیستم ردیابی و بارکد', {
            'fields': ('tracking_id', 'show_qr_url', 'created_at'),
            'description': 'این اطلاعات به صورت خودکار توسط سیستم تولید شده و قابل تغییر نیستند.'
        }),
    )

    # نمایش لینک بارکد به صورت کلیک‌شدنی در لیست اصلی
    def view_qr_link(self, obj):
        return format_html('<a href="{0}" target="_blank" style="color: #10b981; font-weight: bold;">مشاهده لینک بارکد</a>', obj.qr_url)
    view_qr_link.short_description = 'لینک اسکن'

    # نمایش آدرس کامل لینک بارکد در صفحه جزئیات مکتوب
    def show_qr_url(self, obj):
        return obj.qr_url
    show_qr_url.short_description = 'آدرس کامل بارکد (QR URL)'
