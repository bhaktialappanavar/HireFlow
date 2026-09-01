from django.urls import path
from .views import (RegisterView, MeView, CandidateOnlyView, CandidateProfileView,RecruiterProfileView,
CompanyProfileView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),

    path("me/", MeView.as_view(), name="me"),

    path("candidate-only/", CandidateOnlyView.as_view(),
    name="candidate-only",
    ),

    path("profile/", CandidateProfileView.as_view(), name="candidate-profile"),

    path("recruiter-profile/", RecruiterProfileView.as_view(), name="recruiter-profile"),

    path("company/", CompanyProfileView.as_view(), name="company-profile",)

]