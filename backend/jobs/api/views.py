from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from accounts.api.permissions import IsRecruiter
from jobs.models import Job, Application

from .serializers import JobSerializer,ApplicationSerializer
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
            recruiter = recruiter_profile
        )

class JobListView(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    permission_classes =[
        IsAuthenticated,
        ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = JobFilter

    search_fields = [
        "title",
        "description",
        "location",
        "skills",
    ]

    ordering_fields = [
        "created_at",
        "salary_min",
        "salary_max",
    ]

    ordering = [
        "-created_at"
    ]

class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    permission_classes = [
        IsAuthenticated
    ]

class ApplicationCreateView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = ApplicationSerializer

    permission_classes = [
        IsAuthenticated
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