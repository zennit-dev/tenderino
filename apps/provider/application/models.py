from django.db import models

from accounts.models import User
from tenders.models import Tender, TenderCategory


class Status(models.TextChoices):
    DRAFT = "Draft", "Draft"
    PUBLISHED = "Published", "Published"
    OPEN = "Open", "Open"
    UNDER_EVALUATION = "Under Evaluation", "Under Evaluation"
    CLOSED = "Closed", "Closed"
    AWARDED = "Awarded", "Awarded"


class ApplicationCategory(models.TextChoices):
    EVALUATION = "Evaluation", "Evaluation"
    APPLICATION = "Application", "Application"
    QUALIFICATION = "Qualification", "Qualification"


class Application(models.Model):
    applicant = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    tender = models.ForeignKey("tenders.Tender", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self) -> str:
        return self.amount


class CriteriaCompleted(models.Model):
    content = models.TextField()
    tender = models.ForeignKey(
        "application.Application",
        related_name="application_criteria",
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return f"{self.tender.content} - {self.category}"


class DocumentCriteriaCompleted(models.Model):
    application = models.ForeignKey(
        "application.Application",
        related_name="documents",
        on_delete=models.CASCADE,
    )
    document = models.FileField(upload_to="application_criteria_documents/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Document for {self.tender}"
