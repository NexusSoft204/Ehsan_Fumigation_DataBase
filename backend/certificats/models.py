from django.db import models
from company.models import Company  

class Certificate(models.Model):
    company = models.ForeignKey(
        Company, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="certificates",
        verbose_name="کمپانی صادرکننده",
    )

    # --- CERTIFICATE INFORMATION ---
    certificateNumber = models.CharField(max_length=100, unique=True, verbose_name="شماره گواهی")
    registrationNo = models.CharField(max_length=100, verbose_name="شماره ثبت")
    issueDate = models.DateField(verbose_name="تاریخ صدور") 
    phytosanitaryNo = models.CharField(max_length=100, blank=True, null=True, verbose_name="شماره قرنطینه نباتی")

    # --- VEHICLE / TRANSPORT ---
    plateNo = models.CharField(max_length=50, blank=True, null=True, verbose_name="شماره پلاک وسیله نقلیه")
    containerNumber = models.CharField(max_length=100, blank=True, null=True, verbose_name="شماره کانتینر")

    # --- SHIPMENT INFORMATION ---
    countryOfOrigin = models.CharField(max_length=100, verbose_name="کشور مبدا")
    countryOfDestination = models.CharField(max_length=100, verbose_name="کشور مقصد")
    portOfLoading = models.CharField(max_length=100, blank=True, null=True, verbose_name="بندر بارگیری")
    quantity = models.CharField(max_length=100, verbose_name="مقدار / تعداد")
    commodity = models.CharField(max_length=255, verbose_name="نوع کالا / محصول")
    consignmentLink = models.URLField(max_length=500, blank=True, null=True, verbose_name="لینک محموله")

    # --- EXPORTER ---
    exporterName = models.CharField(max_length=255, verbose_name="نام صادرکننده")
    exporterAddress = models.TextField(verbose_name="آدرس صادرکننده")

    # --- CONSIGNEE / IMPORTER ---
    importerName = models.CharField(max_length=255, verbose_name="نام واردکننده")
    importerAddress = models.TextField(verbose_name="آدرس واردکننده")

    # --- FUMIGATION / TREATMENT ---
    treatmentType = models.CharField(max_length=100, blank=True, null=True, verbose_name="نوع فرآوری")
    fumigantType = models.CharField(max_length=100, blank=True, null=True, verbose_name="ماده ضدعفونی کننده")
    prescribedDose = models.CharField(max_length=100, blank=True, null=True, verbose_name="دوز تجویز شده")
    appliedDose = models.CharField(max_length=100, blank=True, null=True, verbose_name="دوز اعمال شده")
    minTemperature = models.CharField(max_length=50, blank=True, null=True, verbose_name="حداقل دما")
    exposurePeriod = models.CharField(max_length=100, blank=True, null=True, verbose_name="مدت زمان قرارگیری")
    dateOfFumigation = models.DateField(blank=True, null=True, verbose_name="تاریخ ضدعفونی") # یا CharField
    placeOfFumigation = models.CharField(max_length=255, blank=True, null=True, verbose_name="محل ضدعفونی")
    fumigatorLicense = models.CharField(max_length=100, blank=True, null=True, verbose_name="مجوز ضدعفونی کننده")
    accreditationNumber = models.CharField(max_length=100, blank=True, null=True, verbose_name="شماره اعتبارنامه")

    # --- DOCUMENTS ---
    exporterInvoiceNo = models.CharField(max_length=100, blank=True, null=True, verbose_name="شماره فاکتور صادرکننده")
    billOfLadingNo = models.CharField(max_length=100, blank=True, null=True, verbose_name="شماره بارنامه / CMR")

    # سیستمی
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Certificate {self.certificateNumber} - {self.exporterName}"
