from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from django.db.models import Count
from accounts.api.permissions import IsRecruiter, IsCandidate
from jobs.models import Job, Application

from .serializers import JobSerializer,ApplicationSerializer,ApplicationStatusSerializer
from .filters import JobFilter


class JobCreateView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def perform_create(self, serializer):
        recruiter_profile = self.request.user.recruiter_profile

        serializer.save(
            recruiter=recruiter_profile,
            company=recruiter_profile.company
        )

class JobListView(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    search_fields = [
        "title",
        "description",
        "skills",
        "location",
    ]

    filterset_fields = [
    "location",
    "job_type",
    ]

    ordering_fields = [
        "created_at",
        "salary_min",
        "salary_max",
    ]

    ordering = ["-created_at"]

class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    permission_classes = [
        IsAuthenticated
    ]

class RecruiterJobUpdateView(generics.UpdateAPIView):
    serializer_class = JobSerializer

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_queryset(self):
        return Job.objects.filter(
            recruiter=self.request.user.recruiter_profile
        )

class RecruiterJobDeleteView(generics.DestroyAPIView):

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_queryset(self):
        return Job.objects.filter(
            recruiter=self.request.user.recruiter_profile
        )

class RecruiterJobCloseView(generics.UpdateAPIView):
    serializer_class = JobSerializer

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_queryset(self):
        return Job.objects.filter(
            recruiter=self.request.user.recruiter_profile
        )

    def perform_update(self, serializer):
        serializer.save(status=Job.Status.CLOSED)


class RecruiterJobListView(generics.ListAPIView):
    serializer_class = JobSerializer

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_queryset(self):
        return Job.objects.filter(
            recruiter=self.request.user.recruiter_profile
        ).order_by("-created_at")

class ApplicationCreateView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = ApplicationSerializer

    permission_classes = [
        IsAuthenticated,
        IsCandidate,
    ]

    def perform_create(self, serializer):
        candidate_profile = self.request.user.candidate_profile

        serializer.save(
            candidate=candidate_profile
        )

class MyApplicationView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        return Application.objects.filter(
            candidate=self.request.user.candidate_profile
        ).order_by("-applied_at")

class CandidateApplicationStatsView(generics.GenericAPIView):
    permission_classes = [
        IsAuthenticated,
        IsCandidate,
    ]

    def get(self, request):
        applications = Application.objects.filter(
            candidate = request.user.candidate_profile
        )
        stats = applications.values("status").annotate(
            count=Count("id")
        )
        result = {
            "total":applications.count(),
            "APPLIED":0,
            "UNDER_REVIEW":0,
            "SHORTLISTED":0,
            "INTERVIEW":0,
            "SELECTED":0,
            "REJECTED":0,

        }
        for item in stats:
            result[item["status"]] = item["count"]

        return Response(result)

class RecruiterApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        return Application.objects.filter(
            job__recruiter=self.request.user.recruiter_profile
        ).order_by("-applied_at")

class RecruiterApplicationStatsView(generics.GenericAPIView):
    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get(self, request):
        applications = Application.objects.filter(
            job__recruiter=request.user.recruiter_profile
        )

        stats = applications.values("status").annotate(
            count=Count("id")
        )

        result = {
            "total":applications.count(),
            "APPLIED":0,
            "UNDER_REVIEW":0,
            "SHORTLISTED":0,
            "INTERVIEW":0,
            "SELECTED":0,
            "REJECTED":0,
        }
        for item in stats:
            result[item["status"]] = item["count"]

        return Response(result)

class ApplicationStatusUpdateView(generics.UpdateAPIView):
    serializer_class = ApplicationStatusSerializer
    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_queryset(self):
        return Application.objects.filter(
            job__recruiter=self.request.user.recruiter_profile
        )

class ApplicationDetailView(generics.RetrieveAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        user = self.request.user

        if hasattr(user, "candidate_profile"):
            return Application.objects.filter(
                candidate=user.candidate_profile
            )
        if hasattr(user, "recruiter_profile"):
            return Application.objects.filter(
                job__recruiter=user.recruiter_profile
            )
        return Application.objects.none()