from rest_framework.routers import DefaultRouter

from application.views import ApplicationViewSet, EvaluationViewSet

router = DefaultRouter()
router.register(r"applications", ApplicationViewSet, basename="application")
router.register(r"evaluations", EvaluationViewSet, basename="evaluation")

urlpatterns = router.urls
