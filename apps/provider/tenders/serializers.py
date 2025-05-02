from rest_framework import serializers

from tenders.models import DocumentTenderCriteria, Tender, TenderCriteria


class DocumentTenderCriteriaSerializer(serializers.ModelSerializer):
    document_url = serializers.SerializerMethodField()

    class Meta:
        model = DocumentTenderCriteria
        fields = [
            "id",
            "document",
            "document_url",
            "uploaded_at",
        ]

    def get_document_url(self, obj):
        request = self.context.get("request")
        if obj.document and hasattr(obj.document, "url"):
            if request is not None:
                return request.build_absolute_uri(obj.document.url)
            return obj.document.url
        return None


class TenderCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenderCriteria
        fields = [
            "id",
            "category",
            "content",
        ]


class TenderSerializer(serializers.ModelSerializer):
    criteria = TenderCriteriaSerializer(many=True)
    document_criteria = serializers.SerializerMethodField()

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
            "document_criteria",
        )

    def get_document_criteria(self, obj):
        documents = DocumentTenderCriteria.objects.filter(
            tender_criteria__tender_id=obj.id
        )
        return DocumentTenderCriteriaSerializer(
            documents, many=True, context=self.context
        ).data


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
            documents = DocumentTenderCriteriaSerializer(
                criterion.documenttendercriteria_set.all(),
                many=True,
                context=self.context,
            ).data
            criterion_data["documents"] = documents
            result.append(criterion_data)
        return result
