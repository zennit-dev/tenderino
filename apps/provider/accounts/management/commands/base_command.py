import getpass
from typing import Any, Optional

from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand

from accounts.models import User


class CustomCommand(BaseCommand):
    def handle(self, *args: Any, **options: Any) -> None:
        raise NotImplementedError("You must implement this method in a subclass.")

    def get_user_data(self) -> tuple:
        username = self.get_input_data(User.USERNAME_FIELD, "Email: ")
        username_bool = False
        while not username_bool:
            if User.objects.filter(email=username).exists():
                self.stderr.write("Error: Email already exists.")
                username = self.get_input_data(User.USERNAME_FIELD, "Email: ")
            else:
                username_bool = True

        password = getpass.getpass()
        while (
            not password
            or username.lower() in password.lower()
            or password.lower() in username.lower()
        ):
            if not password:
                self.stderr.write("Error: Password cannot be empty.")
            else:
                self.stderr.write("Error: Password is too similar to the email.")
            password = getpass.getpass("Password: ")

        return username, password

    def get_input_data(
        self, field_name: str, message: str, default: Optional[str] = None
    ) -> Optional[str]:
        raw_value = input(message)
        if default and raw_value == "":
            raw_value = default
        field = User._meta.get_field(field_name)
        try:
            if hasattr(field, "clean"):
                val = field.clean(raw_value, None)
            else:
                raise AttributeError(
                    f"The field {field_name} does not have a 'clean' method."
                )
        except ValidationError as e:
            self.stderr.write("Error: %s" % "; ".join(e.messages))
            val = None

        return val
