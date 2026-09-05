from django.urls import path

from .views import (
    JobCreateView,
    JobListView,
    JobDetailView,
    RecruiterJobListView,
    RecruiterJobUpdateView,
    RecruiterJobDeleteView,
    RecruiterJobCloseView,
    ApplicationCreateView,
    MyApplicationView,
    RecruiterApplicationsView,
    ApplicationStatusUpdateView,
    ApplicationDetailView,
    RecruiterApplicationStatsView,
    CandidateApplicationStatsView,
    RecruiterCandidateProfileView,
)

urlpatterns = [

    # Job listing
    path(
        "",
        JobListView.as_view(),
        name="job-list",
    ),

    # Recruiter job management
    path(
        "create/",
        JobCreateView.as_view(),
        name="job-create",
    ),

    path(
        "my/",
        RecruiterJobListView.as_view(),
        name="recruiter-job-list",
    ),

    path(
        "<int:pk>/update/",
        RecruiterJobUpdateView.as_view(),
        name="recruiter-job-update",
    ),

    path(
        "<int:pk>/delete/",
        RecruiterJobDeleteView.as_view(),
        name="recruiter-job-delete",
    ),

    path(
        "<int:pk>/close/",
        RecruiterJobCloseView.as_view(),
        name="recruiter-job-close",
    ),

    # Applications
    path(
        "applications/",
        ApplicationCreateView.as_view(),
        name="application-create",
    ),

    path(
        "applications/my/",
        MyApplicationView.as_view(),
        name="my-application",
    ),

    path(
    "applications/my/stats/",
    CandidateApplicationStatsView.as_view(),
    name="candidate-application-stats",
    ),

    path(
        "applications/recruiter/",
        RecruiterApplicationsView.as_view(),
        name="recruiter-applications",
    ),

    path(
        "applications/<int:pk>/status/",
        ApplicationStatusUpdateView.as_view(),
        name="application-status-update",
    ),

    path(
    "applications/<int:pk>/candidate/",
    RecruiterCandidateProfileView.as_view(),
    name="recruiter-candidate-profile",
    ),

    path(
        "applications/<int:pk>/",
        ApplicationDetailView.as_view(),
        name="application-detail",
    ),

    # Job detail — keep this LAST
    path(
        "<int:pk>/",
        JobDetailView.as_view(),
        name="job-detail",
    ),

    path(
        "applications/stats/",
        RecruiterApplicationStatsView.as_view(),
        name="recruiter-application-stats",
    ),
]