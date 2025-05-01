from typing import Any

from django.db.models import QuerySet
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.request import Request
from rest_framework.response import Response


class CustomPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"

    def get_paginated_response(self, data: Any) -> Response:
        return Response(
            {
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "count": self.page.paginator.count,
                "totalPages": self.page.paginator.num_pages,
                "currentPage": self.page.number,
                "results": data,
            }
        )


class QuerySetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "pageSize"
    model = None

    def paginate_queryset(
        self, queryset: QuerySet, request: Request, view=None
    ) -> QuerySet:
        self.model = queryset.model
        if hasattr(view, "page_size"):  # Check if view has page_size attribute
            self.page_size = view.page_size  # Use it as page_size
        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data: list) -> Response:
        total_count = self.model.objects.all().count()

        return Response(
            {
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "count": total_count,
                "filterCount": self.page.paginator.count,
                "totalPages": self.page.paginator.num_pages,
                "currentPage": self.page.number,
                "pageSize": self.page_size,
                "results": data,
            },
            status=status.HTTP_200_OK,
        )
