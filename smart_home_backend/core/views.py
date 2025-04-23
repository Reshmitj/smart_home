from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from .models import Appliance, ApplianceStatus, AuditLog, ApplianceSchedule
from .serializers import (
    RegisterSerializer,
    ApplianceSerializer,
    ApplianceStatusSerializer,
    AuditLogSerializer,
    ApplianceScheduleSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework import serializers




User = get_user_model()

# ✅ Custom Token View to include user role in response
class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ✅ Register new user
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

# ✅ Get appliances (admin sees all, users see own)
class ApplianceListView(generics.ListCreateAPIView):
    serializer_class = ApplianceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Appliance.objects.all()
        return Appliance.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role == 'admin' and 'user' in self.request.data:
            try:
                user = User.objects.get(id=self.request.data['user'])
                serializer.save(user=user)
            except User.DoesNotExist:
                raise serializers.ValidationError("User not found")
        else:
            serializer.save(user=self.request.user)


# ✅ Update appliance status
class UpdateApplianceStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, appliance_id):
        try:
            if request.user.role == 'admin':
                appliance = Appliance.objects.get(id=appliance_id)
            else:
                appliance = Appliance.objects.get(id=appliance_id, user=request.user)

            status_obj, _ = ApplianceStatus.objects.get_or_create(appliance=appliance)
            new_status = request.data.get("status")

            if new_status not in ["ON", "OFF"]:
                return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

            status_obj.status = new_status
            status_obj.save()

            return Response({"message": f"Appliance '{appliance.name}' status updated to {new_status}"})
        except Appliance.DoesNotExist:
            return Response({"error": "Appliance not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)

# ✅ View audit logs
class AuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return AuditLog.objects.all().order_by('-scheduled_at')
        return AuditLog.objects.filter(user=self.request.user).order_by('-scheduled_at')

# ✅ Schedule appliance action
class ScheduleApplianceActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        appliance_id = request.data.get('appliance_id')
        action = request.data.get('action')
        scheduled_time = request.data.get('schedule_time')

        try:
            if user.role == 'admin':
                appliance = Appliance.objects.get(id=appliance_id)
            else:
                appliance = Appliance.objects.get(id=appliance_id, user=user)
        except Appliance.DoesNotExist:
            return Response({"error": "Appliance not found."}, status=status.HTTP_404_NOT_FOUND)

        ApplianceSchedule.objects.create(
            appliance=appliance,
            action=action,
            schedule_time=scheduled_time
        )

        AuditLog.objects.create(
            user=user,
            appliance=appliance,
            action=action,
            scheduled_at=scheduled_time
        )

        return Response({"message": "Schedule saved successfully."}, status=status.HTTP_201_CREATED)

# ✅ View schedule list
class ScheduleListView(generics.ListAPIView):
    serializer_class = ApplianceScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return ApplianceSchedule.objects.all().order_by('-schedule_time')
        return ApplianceSchedule.objects.filter(appliance__user=self.request.user).order_by('-schedule_time')

# ✅ Profile endpoint
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        })

# ✅ Admin: View all users
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def AdminUserListView(request):
    if request.user.role != 'admin':
        return Response({'error': 'Forbidden'}, status=403)

    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

class ApplianceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appliance.objects.all()
    serializer_class = ApplianceSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        kwargs['partial'] = True  # ✅ enable partial update
        return self.update(request, *args, **kwargs)
    
def patch(self, request, *args, **kwargs):
    kwargs['partial'] = True
    return self.partial_update(request, *args, **kwargs)

class AdminUserDetailView(RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)
        return super().delete(request, *args, **kwargs)