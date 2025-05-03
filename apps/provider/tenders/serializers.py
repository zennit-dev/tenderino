from rest_framework import serializers

from tenders.models import DocumentTender, Tender, TenderCriteria


class DocumentTenderSerializer(serializers.ModelSerializer):
    document_url = serializers.SerializerMethodField()
    tender = serializers.PrimaryKeyRelatedField(queryset=Tender.objects.all())

    class Meta:
        model = DocumentTender
        fields = ["id", "document_url", "uploaded_at", "tender"]

    def get_document_url(self, obj):
        request = self.context.get("request")
        if obj.document and hasattr(obj.document, "url"):
            if request is not None:
                return request.build_absolute_uri(obj.document.url)
            return obj.document.url
        return None


class TenderCriteriaSerializer(serializers.ModelSerializer):
    tender = serializers.SerializerMethodField()

    class Meta:
        model = TenderCriteria
        fields = [
            "id",
            "category",
            "type",
            "description",
            "weight",
            "tender",
        ]

    def get_tender(self, obj):
        return obj.tender.id


class TenderSerializer(serializers.ModelSerializer):
    criteria = TenderCriteriaSerializer(many=True)
    tender_document = serializers.SerializerMethodField()

    class Meta:
        model = Tender
        fields = (
            "id",
            "title",
            "description",
            "created_at",
            "open_date",
            "expire_date",
            "max_amount",
            "status",
            "category",
            "criteria",
            "tender_document",
        )

    def get_tender_document(self, obj):
        documents = DocumentTender.objects.filter(tender=obj)
        return DocumentTenderSerializer(documents, many=True, context=self.context).data


class TenderWithDocumentsSerializer(serializers.ModelSerializer):
    criteria = serializers.SerializerMethodField()

    class Meta:
        model = Tender
        fields = (
            "id",
            "title",
            "description",
            "created_at",
            "open_date",
            "expire_date",
            "max_amount",
            "status",
            "category",
            "criteria",
        )

    def get_criteria(self, obj):
        criteria = obj.tendercriteria_set.all()
        result = []
        for criterion in criteria:
            criterion_data = TenderCriteriaSerializer(criterion).data
            documents = DocumentTenderSerializer(
                obj.documents.all(),
                many=True,
                context=self.context,
            ).data
            criterion_data["documents"] = documents
            result.append(criterion_data)
        return result
