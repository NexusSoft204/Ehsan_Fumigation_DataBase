from django.contrib import admin
from .models import Company, CompanyRepresentative

# نمایش اطلاعات نماینده به صورت درجا داخل صفحه شرکت
class CompanyRepresentativeInline(admin.StackedInline):
    model = CompanyRepresentative
    can_delete = False
    verbose_name_plural = 'Representative Information'
    fk_name = 'company'
    extra = 1

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    # ستون‌هایی که در لیست اصلی شرکت‌ها نمایش داده می‌شوند
    list_display = ('company_name', 'company_type', 'city', 'status')
    
    # فیلترهایی که در سمت راست پنل ادمین ظاهر می‌شوند
    list_filter = ('company_type', 'status', 'province')
    
    # قابلیت جستجو بر اساس نام شرکت، شماره ثبت و صنعت
    search_fields = ('company_name', 'registration_number', 'industry')
    
    # اضافه کردن بخش نماینده به داخل فرم شرکت
    inlines = [CompanyRepresentativeInline]

# اگر بخواهید به طور جداگانه هم به لیست کل نماینده‌ها دسترسی داشته باشید (اختیاری)
@admin.register(CompanyRepresentative)
class CompanyRepresentativeAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'position', 'phone')
    search_fields = ('name', 'company__company_name', 'email')
