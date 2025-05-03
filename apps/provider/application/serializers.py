import logging

from rest_framework import serializers

from accounts.models import User
from application.models import (
    Application,
    CriteriaCompleted,
    DocumentCriteriaCompleted,
    Evaluation,
    Score,
)

logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "access", "is_active"]


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


class ScoreSerializer(serializers.ModelSerializer):
    criteria_id = serializers.IntegerField(write_only=True)
    is_document = serializers.BooleanField(write_only=True, default=False)
    feedback = serializers.CharField(source="notes", required=False)

    class Meta:
        model = Score
        fields = ["criteria_id", "score", "feedback", "is_document"]

    def validate(self, data):
        criteria_id = data["criteria_id"]
        is_document = data.get("is_document", False)
        logger.info(
            f"Validating score for criteria_id: {criteria_id}, is_document: {is_document}"
        )

        if is_document:
            try:
                criteria = DocumentCriteriaCompleted.objects.get(id=criteria_id)
                logger.info(f"Found document criteria: {criteria.id}")
            except DocumentCriteriaCompleted.DoesNotExist:
                logger.error(f"Document criteria with ID {criteria_id} does not exist")
                raise serializers.ValidationError(
                    {
                        "criteria_id": f"Document criteria with ID {criteria_id} does not exist"
                    }
                )
        else:
            try:
                criteria = CriteriaCompleted.objects.get(id=criteria_id)
                logger.info(f"Found regular criteria: {criteria.id}")
            except CriteriaCompleted.DoesNotExist:
                logger.error(f"Criteria with ID {criteria_id} does not exist")
                raise serializers.ValidationError(
                    {"criteria_id": f"Criteria with ID {criteria_id} does not exist"}
                )

        return data


class EvaluationSerializer(serializers.ModelSerializer):
    scores = ScoreSerializer(many=True, required=False)
    application_id = serializers.PrimaryKeyRelatedField(
        queryset=Application.objects.all(), source="application", write_only=True
    )

    class Meta:
        model = Evaluation
        fields = [
            "id",
            "application_id",
            "scores",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, data):
        logger.info("Validating evaluation data")
        if "scores" in data and not data["scores"]:
            logger.error("No scores provided in evaluation")
            raise serializers.ValidationError(
                {"scores": "At least one score is required"}
            )
        return data

    def create(self, validated_data):
        logger.info("Creating evaluation with data")
        scores_data = validated_data.pop("scores", [])
        evaluation = Evaluation.objects.create(**validated_data)
        logger.info(f"Created evaluation: {evaluation.id}")

        for score_data in scores_data:
            logger.info(f"Creating score with data: {score_data}")
            score_serializer = ScoreSerializer(
                data=score_data, context={"evaluation": evaluation}
            )
            if not score_serializer.is_valid():
                logger.error(f"Score validation errors: {score_serializer.errors}")
                raise serializers.ValidationError({"scores": score_serializer.errors})
            score = score_serializer.save()
            logger.info(f"Created score: {score.id}")

        return evaluation


class ApplicationSerializer(serializers.ModelSerializer):
    criteria_completed = serializers.SerializerMethodField()
    document_criteria_completed = serializers.SerializerMethodField()
    applicant = UserSerializer(read_only=True)
    evaluation = serializers.SerializerMethodField()

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
            "evaluation",
        )

    def get_criteria_completed(self, obj):
        criteria = obj.application_criteria.all()
        return CriteriaCompletedSerializer(criteria, many=True).data

    def get_document_criteria_completed(self, obj):
        documents = DocumentCriteriaCompleted.objects.filter(application=obj)
        return DocumentCriteriaCompletedSerializer(
            documents, many=True, context=self.context
        ).data

    def get_evaluation(self, obj):
        try:
            evaluation = obj.evaluation
            return {
                "id": evaluation.id,
                "scores": ScoreSerializer(evaluation.scores.all(), many=True).data,
                "notes": evaluation.notes,
                "created_at": evaluation.created_at,
                "updated_at": evaluation.updated_at,
            }
        except Evaluation.DoesNotExist:
            return None


class ApplicationWithDocumentsSerializer(serializers.ModelSerializer):
    criteria = serializers.SerializerMethodField()
    applicant = UserSerializer(read_only=True)

    class Meta:
        model = Application
        fields = (
            "id",
            "amount",
            "created_at",
            "application",
            "criteria",
            "applicant",
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
