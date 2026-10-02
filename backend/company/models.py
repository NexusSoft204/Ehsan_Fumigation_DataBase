from django.db import models

class Company(models.Model):
    # ساختار استاندارد انتخاب نوع شرکت در جنگو
    class CompanyType(models.TextChoices):
        PRIVATE = 'private', 'Private'
        PUBLIC = 'public', 'Public'
        LLC = 'llc', 'LLC'

    company_name = models.CharField(max_length=200, verbose_name='Company Name')
    registration_number = models.CharField(max_length=255, verbose_name='Registration Number')
    company_type = models.CharField(
        max_length=20, 
        choices=CompanyType.choices, 
        default=CompanyType.PRIVATE, 
        verbose_name='Company Type'
    )
    industry = models.CharField(max_length=150, verbose_name='Industry') # فیلد اصلاح شده
    phone_number = models.CharField(max_length=15, verbose_name='Phone Number')
    email = models.EmailField(verbose_name='Email')
    website = models.URLField(verbose_name='Website', blank=True, null=True)
    province = models.CharField(max_length=130, verbose_name='Province')
    district = models.CharField(max_length=120, verbose_name='District')
    city = models.CharField(max_length=50, verbose_name='City')
    full_address = models.TextField(verbose_name='Full Address')
    status = models.BooleanField(default=True, verbose_name='Status')

    class Meta:
        verbose_name = "Company"
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.company_name


class CompanyRepresentative(models.Model):
    # اتصال مستقیم به مدل شرکت - با حذف شرکت، اطلاعات نماینده هم حذف می‌شود
    company = models.ForeignKey(
        Company, 
        on_delete=models.CASCADE, 
        related_name='representatives', 
        verbose_name='Company'
    )
    name = models.CharField(max_length=150, verbose_name='Representative Name')
    position = models.CharField(max_length=100, verbose_name='Position')
    phone = models.CharField(max_length=15, verbose_name='Representative Phone')
    email = models.EmailField(verbose_name='Representative Email')

    class Meta:
        verbose_name = "Representative"
        verbose_name_plural = "Representatives"

    def __str__(self):
        return f"{self.name} ({self.company.company_name})"
