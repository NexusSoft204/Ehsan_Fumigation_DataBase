from rest_framework import serializers
from .models import OfficialLetter

class OfficialLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfficialLetter
        fields = ['id','tracking_id', 'destination', 'subject', 'content', 'created_at']
        read_only_fields = ['tracking_id', 'created_at']