import re
import subprocess
import sys
from typing import Any, List

from django.core.checks import register
from django.core.checks.messages import DEBUG, ERROR, INFO, WARNING, CheckMessage


# The check framework is used for multiple different kinds of checks. As such, errors
# and warnings can originate from models or other django objects. The `CheckMessage`
# requires an object as the source of the message, and so we create a temporary object
# that simply displays the file and line number from mypy (i.e. "location")
class MyPyErrorLocation:
    def __init__(self, location: str) -> None:
        self.location = location

    def __str__(self) -> str:
        return self.location


@register()
def mypy(app_configs: Any, **kwargs: Any) -> List:
    print("Performing mypy checks...\n", file=sys.stdout)

    # By default, run mypy against the whole database everytime checks are performed.
    # If performance is an issue then `app_configs` can be inspected and the scope
    # of the mypy check can be restricted
    result = subprocess.run(["mypy", "."], capture_output=True, text=True)

    if result.returncode == 0:
        print(result.stdout)
        return []

    error_messages = result.stdout
    #
    # Example: myproject/checks.py:17: error: Need shape annotation for 'errors'
    pattern = re.compile(r"^(.+\d+): (\w+): (.+)")

    errors = []
    for message in error_messages.rstrip().split("\n"):
        parsed = re.match(pattern, message)
        if not parsed:
            continue

        location = parsed.group(1)
        mypy_level = parsed.group(2)
        message = parsed.group(3)

        level = DEBUG
        if mypy_level == "note":
            level = INFO
        elif mypy_level == "warning":
            level = WARNING
        elif mypy_level == "error":
            level = ERROR
        else:
            print(f"Unrecognized mypy level: {mypy_level}")

        errors.append(CheckMessage(level, message, obj=MyPyErrorLocation(location)))

    return errors


@register()
def black(app_configs: Any, **kwargs: Any) -> List:
    print("Black reformatting...", file=sys.stdout)
    subprocess.run(["black", "."])
    return []


@register()
def isort(app_configs: Any, **kwargs: Any) -> List:
    print("Sorting imports")
    result = subprocess.run(["isort", "."], capture_output=True, text=True)

    if result.returncode == 0:
        print(result.stdout)
        return []

    return []
