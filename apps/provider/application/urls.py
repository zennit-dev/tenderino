from rest_framework.routers import DefaultRouter

from application.views import ApplicationViewSet

router = DefaultRouter()
router.register(r"applications", ApplicationViewSet, basename="application")

urlpatterns = router.urls
