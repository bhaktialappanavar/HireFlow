from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from accounts.models import (
    User,
    Company,
    CandidateProfile,
    RecruiterProfile,
)

from .models import Job, Application


class JobApplicationTests(APITestCase):

    def setUp(self):
        # Candidate
        self.candidate = User.objects.create_user(
            username="testcandidate",
            password="Candidate@123",
            role=User.Role.CANDIDATE,
        )

        self.candidate_profile = CandidateProfile.objects.create(
            user=self.candidate
        )

        # Recruiter
        self.recruiter = User.objects.create_user(
            username="testrecruiter",
            password="Recruiter@123",
            role=User.Role.RECRUITER,
        )

        self.company = Company.objects.create(
            name="Test Company",
            location="Bangalore",
            industry="Software",
        )

        self.recruiter_profile = RecruiterProfile.objects.create(
            user=self.recruiter,
            company=self.company,
        )

        # Job
        self.job = Job.objects.create(
            title="Django Developer",
            description="Looking for a Django developer.",
            deadline="2026-10-30",
            company=self.company,
            recruiter=self.recruiter_profile,
            location="Bangalore",
            job_type="FULL_TIME",
            experience_level="ENTRY",
            salary_min=500000,
            salary_max=800000,
            skills="Python, Django, REST API",
            openings=2,
            status="OPEN",
        )

    def test_candidate_can_apply_for_open_job(self):
        self.client.force_authenticate(
            user=self.candidate
        )

        response = self.client.post(
            "/api/jobs/applications/",
            {
                "job": self.job.id,
                "cover_letter": "I am interested in this position.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertTrue(
            Application.objects.filter(
                candidate=self.candidate_profile,
                job=self.job,
            ).exists()
        )

    def test_candidate_cannot_apply_twice(self):
        Application.objects.create(
            candidate=self.candidate_profile,
            job=self.job,
            cover_letter="First application",
        )

        self.client.force_authenticate(
            user=self.candidate
        )

        response = self.client.post(
            "/api/jobs/applications/",
            {
                "job": self.job.id,
                "cover_letter": "Second application",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_recruiter_cannot_apply_for_job(self):
        self.client.force_authenticate(
            user=self.recruiter
        )

        response = self.client.post(
            "/api/jobs/applications/",
            {
                "job": self.job.id,
                "cover_letter": "I want to apply.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )

    def test_candidate_cannot_apply_for_closed_job(self):
        self.job.status = "CLOSED"
        self.job.save()

        self.client.force_authenticate(
            user=self.candidate
        )

        response = self.client.post(
            "/api/jobs/applications/",
            {
                "job": self.job.id,
                "cover_letter": "I am interested in this position.",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_candidate_can_see_only_own_application(self):
        other_candidate = User.objects.create_user(
            username="othercandidate",
            password="Candidate@123",
            role=User.Role.CANDIDATE,
        )

        other_profile = CandidateProfile.objects.create(
            user=other_candidate
        )

        other_application = Application.objects.create(
            candidate=other_profile,
            job=self.job,
            cover_letter="Other candidate application",
        )

        self.client.force_authenticate(
            user=self.candidate
        )

        response = self.client.get(
            f"/api/jobs/applications/{other_application.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_recruiter_can_see_applications_for_own_job(self):
        application = Application.objects.create(
            candidate=self.candidate_profile,
            job=self.job,
            cover_letter="I am interested in this position.",
        )

        self.client.force_authenticate(
            user=self.recruiter
        )

        response = self.client.get(
            "/api/jobs/applications/recruiter/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data["count"],
            1
        )

        self.assertEqual(
            response.data["results"][0]["id"],
            application.id
        )

    def test_recruiter_can_update_application_status(self):
        application = Application.objects.create(
            candidate=self.candidate_profile,
            job=self.job,
            cover_letter="I am interested in this position.",
        )

        self.client.force_authenticate(
            user=self.recruiter
        )

        response = self.client.patch(
            f"/api/jobs/applications/{application.id}/status/",
            {
                "status": "SHORTLISTED"
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        application.refresh_from_db()

        self.assertEqual(
            application.status,
            "SHORTLISTED"
        )