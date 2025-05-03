import json

from rest_framework import parsers, status, viewsets
from rest_framework.response import Response

from provider.views import QuerySetPagination

from .models import DocumentTender, Tender, TenderCriteria
from .serializers import (
    DocumentTenderSerializer,
    TenderCriteriaSerializer,
    TenderSerializer,
)


class TenderViewSet(viewsets.ModelViewSet):
    queryset = Tender.objects.all()
    serializer_class = TenderSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    pagination_class = QuerySetPagination

    def create(self, request, *args, **kwargs):
        tender_data_json = request.data.get("tenderData")
        if not tender_data_json:
            return Response(
                {"error": "tenderData is required"}, status=status.HTTP_400_BAD_REQUEST
            )
        try:
            tender_data = json.loads(tender_data_json)
        except Exception as e:
            return Response(
                {"error": "Invalid JSON in tenderData", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        criteria_data = tender_data.pop("criteria", [])
        tender = Tender.objects.create(**tender_data)

        # Create criteria
        for crit in criteria_data:
            TenderCriteria.objects.create(tender=tender, **crit)

        # Handle document uploads
        files = request.FILES
        for idx, file_key in enumerate(files):
            if file_key.startswith("document_criteria["):
                DocumentTender.objects.create(tender=tender, document=files[file_key])

        serializer = self.get_serializer(tender, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TenderCriteriaViewSet(viewsets.ModelViewSet):
    queryset = TenderCriteria.objects.all()
    serializer_class = TenderCriteriaSerializer


class DocumentTenderViewSet(viewsets.ModelViewSet):
    queryset = DocumentTender.objects.all()
    serializer_class = DocumentTenderSerializer
