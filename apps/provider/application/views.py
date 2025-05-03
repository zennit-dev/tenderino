import json

from django.shortcuts import get_object_or_404
from rest_framework import parsers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from tenders.models import Tender

from .models import (
    Application,
    CriteriaCompleted,
    DocumentCriteriaCompleted,
    Evaluation,
)
from .serializers import ApplicationSerializer, EvaluationSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def create(self, request, *args, **kwargs):
        application_data_json = request.data.get("applicationData")
        if not application_data_json:
            return Response(
                {"error": "applicationData is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            application_data = json.loads(application_data_json)
        except Exception as e:
            return Response(
                {"error": "Invalid JSON in applicationData", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get the user instance from the request
        application_data["applicant"] = request.user

        # Get the tender instance
        tender_id = application_data.pop("tender")
        tender = get_object_or_404(Tender, id=tender_id)
        application_data["tender"] = tender

        criteria_data = application_data.pop("criteria", [])
        application = Application.objects.create(**application_data)
        criteria_objs = []
        for crit in criteria_data:
            crit_obj = CriteriaCompleted.objects.create(
                tender=application, content=crit["content"]
            )
            criteria_objs.append(crit_obj)

        files = request.FILES
        for idx, crit_obj in enumerate(criteria_objs):
            file_key = f"document_criteria[{idx}][document]"
            if file_key in files:
                DocumentCriteriaCompleted.objects.create(
                    application=application, document=files[file_key]
                )

        serializer = self.get_serializer(application, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer

    def get_queryset(self):
        return Evaluation.objects.select_related("application").prefetch_related(
            "scores"
        )

    @action(detail=False, methods=["get"])
    def by_application(self, request):
        application_id = request.query_params.get("application_id")
        if not application_id:
            return Response(
                {"error": "application_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        evaluation = get_object_or_404(
            Evaluation.objects.select_related("application").prefetch_related("scores"),
            application_id=application_id,
        )
        serializer = self.get_serializer(evaluation)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        # Check if evaluation already exists for this application
        application_id = request.data.get("application")
        if not application_id:
            return Response(
                {"error": "application field is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verify application exists
        try:
            Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            return Response(
                {"error": f"Application with id {application_id} does not exist"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Evaluation.objects.filter(application_id=application_id).exists():
            return Response(
                {"error": "Evaluation already exists for this application"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid data", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            evaluation = serializer.save()
            return Response(
                self.get_serializer(evaluation).data,
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response(
                {"error": "Failed to create evaluation", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        # If scores are provided, delete existing scores
        if "scores" in request.data:
            instance.scores.all().delete()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(
                {"error": "Invalid data", "details": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            evaluation = serializer.save()
            return Response(self.get_serializer(evaluation).data)
        except Exception as e:
            return Response(
                {"error": "Failed to update evaluation", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
