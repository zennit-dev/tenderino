from rest_framework.routers import DefaultRouter

from .views import DocumentTenderViewSet, TenderCriteriaViewSet, TenderViewSet

router = DefaultRouter()
router.register(r"tenders", TenderViewSet, basename="tender")
router.register(r"tender-criteria", TenderCriteriaViewSet, basename="tender-criteria")
router.register(r"tender-documents", DocumentTenderViewSet, basename="tender-documents")

urlpatterns = router.urls
