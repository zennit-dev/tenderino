from django.shortcuts import render
from tenders.models import Tender
from tenders.serializers import TenderSerializer
from rest_framework.viewsets import ModelViewSet
from api.minxin import PermissionPolicyMixin
from rest_framework.permissions import IsAuthenticated
from django.db.models import QuerySet
from api.pagination import QuerySetPagination   

# Create your views here.
class TenderViewSet(ModelViewSet, PermissionPolicyMixin):
    serializer_class = TenderSerializer
    permission_classes_per_method = {
        "retrieve": [IsAuthenticated],
        "list": [IsAuthenticated],
        "create": [IsAuthenticated],
        "update": [IsAuthenticated],
        "partial_update": [IsAuthenticated],
        "destroy": [IsAuthenticated],
    }
    
    pagination_class = QuerySetPagination

    def get_queryset(self):
        return Tender.objects.all().order_by("-id")