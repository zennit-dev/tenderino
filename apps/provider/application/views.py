import json

from django.shortcuts import get_object_or_404
from rest_framework import parsers, status, viewsets
from rest_framework.response import Response

from tenders.models import Tender

from .models import Application, CriteriaCompleted, DocumentCriteriaCompleted
from .serializers import ApplicationSerializer


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
