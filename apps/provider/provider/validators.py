import os

from django.core.exceptions import ValidationError


def validate_extension(value, valid_extensions):
    ext = os.path.splitext(value.name)[1]
    if not ext.lower() in valid_extensions:
        raise ValidationError("Unsupported file extension.")


def validate_img_extension(value):
    valid_extensions = [".png", ".jpg", ".jpeg"]
    validate_extension(value, valid_extensions)


def validate_video_extension(value):
    valid_extensions = [".mp4", ".webm"]
    validate_extension(value, valid_extensions)


def validate_md_extension(value):
    valid_extensions = [".md"]
    validate_extension(value, valid_extensions)


def validate_cv_extension(value):
    valid_extensions = [".pdf", ".doc", ".docx"]
    validate_extension(value, valid_extensions)
