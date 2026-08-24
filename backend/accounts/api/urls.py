from django.urls import path
from .views import RegisterView, MeView, CandidateOnlyView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", MeView.as_view(), name="me"),
    path("candidate-only/", CandidateOnlyView.as_view(),
    name="candidate-only",
    ),

]