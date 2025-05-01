from datetime import timedelta
from email.mime.image import MIMEImage
from typing import List, Optional, Union

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from rest_framework import serializers

from accounts.models import User


class MsDurationField(serializers.Field):
    def to_representation(self, delta: timedelta) -> int:
        total_milliseconds = delta.days * 24 * 60 * 60 * 1000 + delta.seconds * 1000
        return total_milliseconds

    def to_internal_value(self, milliseconds: int) -> timedelta:
        if milliseconds:
            return timedelta(seconds=int(milliseconds) / 1000)
        else:
            return timedelta()


def generate_temp_login_id() -> str:
    while True:
        temp_login_id = get_random_string(
            length=32,
        )

        if not User.objects.filter(temp_login_id=temp_login_id).exists():
            return temp_login_id


def validate_email(value: str) -> str:
    try:
        User.objects.get(email=value)
    except User.DoesNotExist:
        raise serializers.ValidationError("User with the given email does not exist")
    return value


def send_email_function(
    sender: Optional[Union[User, str]],
    recipients: Union[List[User], User, str],
    data: dict,
    template_name_html: str,
    template_name_txt: str,
    attachments: Optional[List[str]] = None,
) -> None:
    if isinstance(sender, User):
        subject = sender.email
        from_email = sender.email
    else:
        subject = sender
        from_email = sender

    if isinstance(recipients, User):
        to_emails = [recipients.email]
    elif isinstance(recipients, list):
        to_emails = [recipient.email for recipient in recipients]
    else:
        to_emails = [recipients]

    text_content = render_to_string(template_name_txt, data)
    html_content = render_to_string(template_name_html, data)

    msg = EmailMultiAlternatives(subject, text_content, from_email, to_emails)
    msg.attach_alternative(html_content, "text/html")

    if attachments:
        for attachment in attachments:
            with open(attachment, "rb") as img:
                msg_img = MIMEImage(img.read())
                msg_img.add_header("Content-ID", "<logo>")
                msg.attach(msg_img)

    msg.send()
