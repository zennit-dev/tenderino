from django.core.validators import MaxValueValidator, MinValueValidator
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
    application = models.ForeignKey(
        "application.Application",
        related_name="application_criteria",
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return f"{self.application} - {self.category}"


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


class Evaluation(models.Model):
    application = models.OneToOneField(
        "application.Application", on_delete=models.CASCADE, related_name="evaluation"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self) -> str:
        return f"Evaluation for {self.application}"


class Score(models.Model):
    evaluation = models.ForeignKey(
        "application.Evaluation", on_delete=models.CASCADE, related_name="scores"
    )
    score = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    criteria_completed = models.ForeignKey(
        "application.CriteriaCompleted",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="scores",
    )
    document_criteria_completed = models.ForeignKey(
        "application.DocumentCriteriaCompleted",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="scores",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(
                    criteria_completed__isnull=False,
                    document_criteria_completed__isnull=True,
                )
                | models.Q(
                    criteria_completed__isnull=True,
                    document_criteria_completed__isnull=False,
                ),
                name="score_must_have_one_criteria",
            )
        ]

    def __str__(self) -> str:
        if self.criteria_completed:
            return f"Score for {self.criteria_completed}"
        return f"Score for {self.document_criteria_completed}"
