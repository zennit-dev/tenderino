from typing import Any

from accounts.management.commands.base_command import CustomCommand
from accounts.models import User


class Command(CustomCommand):
    def handle(self, *args: Any, **options: Any) -> None:
        email, password = self.get_user_data()
        try:
            user = User.objects.create_user(
                email=email,
                password=password,
            )
            self.stdout.write(self.style.SUCCESS(f"Created new user {user.email}."))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error creating user: {e}"))
