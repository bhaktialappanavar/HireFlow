from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        CANDIDATE = "CANDIDATE", "candidate"
        RECRUITER = "RECRUITER", "recruiter"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CANDIDATE)

    def __str__(self):
        return self.username

