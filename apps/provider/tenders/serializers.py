from rest_framework import serializers
from tenders.models import Tender


class TenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tender
        fields = {
            "id",
            "title",
            "description",
            "created_at",
            "open_date",
            "expire_date",
            "status",
        }
