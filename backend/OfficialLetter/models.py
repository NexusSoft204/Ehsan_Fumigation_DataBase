import uuid
from django.db import models

class OfficialLetter(models.Model):
    tracking_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    destination = models.CharField(max_length=255) # سازمان مقصد
    subject = models.CharField(max_length=255)     # موضوع مکتوب
    content = models.TextField()                    # متن مکتوب
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"مکتوب به {self.destination} - {self.subject}"

    @property
    def qr_url(self):
        # لینکی که بعد از اسکن بارکد، کاربر را برای دیدن اطلاعات مکتوب هدایت می‌کند
        return f"https://ehsanfumigation.com/{self.tracking_id}"
