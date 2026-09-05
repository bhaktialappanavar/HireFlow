from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        CANDIDATE = "CANDIDATE", "candidate"
        RECRUITER = "RECRUITER", "recruiter"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CANDIDATE)

    def __str__(self):
        return self.username

class Company(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    logo = models.ImageField(upload_to="company_logos/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class CandidateProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="candidate_profile"
    )
    phone = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    education = models.TextField(blank=True)
    experience = models.TextField(blank=True)

    profile_photo = models.ImageField(
        upload_to="profile_photos/",
        blank=True,
        null=True
    )

    resume = models.FileField(
        upload_to="resumes/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

class RecruiterProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="recruiter_profile"
    )
    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="recruiters"
    )
    phone = models.CharField(max_length=15, blank=True)
    designation = models.CharField(max_length=100, blank=True)

    profile_photo = models.ImageField(
        upload_to="profile_photos/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username