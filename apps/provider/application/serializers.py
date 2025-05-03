from rest_framework import serializers

from application.models import Application, CriteriaCompleted, DocumentCriteriaCompleted


class DocumentCriteriaCompletedSerializer(serializers.ModelSerializer):
    document_url = serializers.SerializerMethodField()

    class Meta:
        model = DocumentCriteriaCompleted
        fields = [
            "id",
            "document",
            "document_url",
            "created_at",
        ]

    def get_document_url(self, obj):
        request = self.context.get("request")
        if obj.document and hasattr(obj.document, "url"):
            if request is not None:
                return request.build_absolute_uri(obj.document.url)
            return obj.document.url
        return None


class CriteriaCompletedSerializer(serializers.ModelSerializer):
    class Meta:
        model = CriteriaCompleted
        fields = [
            "id",
            "content",
        ]


class ApplicationSerializer(serializers.ModelSerializer):
    criteria_completed = serializers.SerializerMethodField()
    document_criteria_completed = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = (
            "id",
            "amount",
            "applicant",
            "created_at",
            "tender",
            "criteria_completed",
            "document_criteria_completed",
        )

    def get_criteria_completed(self, obj):
        criteria = obj.application_criteria.all()
        return CriteriaCompletedSerializer(criteria, many=True).data

    def get_document_criteria_completed(self, obj):
        documents = DocumentCriteriaCompleted.objects.filter(application=obj)
        return DocumentCriteriaCompletedSerializer(
            documents, many=True, context=self.context
        ).data


class ApplicationWithDocumentsSerializer(serializers.ModelSerializer):
    criteria = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = (
            "id",
            "amount",
            "created_at",
            "application",
            "criteria",
        )

    def get_criteria(self, obj):
        criteria = obj.applicationcriteria_set.all()
        result = []
        for criterion in criteria:
            criterion_data = CriteriaCompletedSerializer(criterion).data
            documents = DocumentCriteriaCompletedSerializer(
                criterion.documentapplicationcriteria_set.all(),
                many=True,
                context=self.context,
            ).data
            criterion_data["documents"] = documents
            result.append(criterion_data)
        return result
