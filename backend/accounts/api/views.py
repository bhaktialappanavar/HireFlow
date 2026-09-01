from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsCandidate, IsRecruiter
from .serializers import(RegisterSerializer,CandidateProfileSerializer,
RecruiterProfileSerializer,
CompanySerializer,
)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "role": request.user.role,
        })

class CandidateOnlyView(APIView):
    permission_classes = [IsCandidate]

    def get(self, request):
        return Response({
            "message":"You are allowed to access the candidate area",
            "user" : request.user.username,
            "role": request.user.role,
        })

class CandidateProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CandidateProfileSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    def get_object(self):
        return self.request.user.candidate_profile

class RecruiterProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = RecruiterProfileSerializer

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_object(self):
        return self.request.user.recruiter_profile

class CompanyProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CompanySerializer

    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def get_object(self):
        return self.request.user.recruiter_profile.company