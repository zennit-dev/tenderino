import json

from rest_framework import parsers, status, viewsets
from rest_framework.response import Response

from .models import DocumentTenderCriteria, Tender, TenderCriteria
from .serializers import TenderSerializer


class TenderViewSet(viewsets.ModelViewSet):
    queryset = Tender.objects.all()
    serializer_class = TenderSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

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
        criteria_objs = []
        for crit in criteria_data:
            crit_obj = TenderCriteria.objects.create(tender=tender, **crit)
            criteria_objs.append(crit_obj)

        # Attach each uploaded file to the corresponding TenderCriteria by index
        files = request.FILES
        for idx, crit_obj in enumerate(criteria_objs):
            file_key = f"document_criteria[{idx}][document]"
            if file_key in files:
                DocumentTenderCriteria.objects.create(
                    tender_criteria=crit_obj, document=files[file_key]
                )

        serializer = self.get_serializer(tender, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
