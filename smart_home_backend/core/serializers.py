from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Appliance, ApplianceStatus, AuditLog, ApplianceSchedule

# ✅ Custom token serializer to include role
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        return data

# ✅ User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

# ✅ Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# ✅ Appliance Serializer
class ApplianceSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    energy_usage = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()


    class Meta:
        model = Appliance
        fields = ['id', 'name', 'type', 'connection', 'user', 'status', 'energy_usage']

    def get_user(self, obj):
        if obj.user:
            return {
                "id": obj.user.id,
                "username": obj.user.username,
                "email": obj.user.email,
                "role": obj.user.role
            }
        return None
    def get_status(self, obj):
        latest_status = ApplianceStatus.objects.filter(appliance=obj).order_by('-updated_at').first()
        return latest_status.status if latest_status else 'UNKNOWN'

    def get_energy_usage(self, obj):
        latest_status = ApplianceStatus.objects.filter(appliance=obj).order_by('-updated_at').first()
        return latest_status.energy_usage if latest_status and latest_status.energy_usage is not None else 0

# ✅ Appliance Status Serializer
class ApplianceStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplianceStatus
        fields = '__all__'

# ✅ Audit Log Serializer
class AuditLogSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    appliance = serializers.CharField(source='appliance.name', read_only=True)

    class Meta:
        model = AuditLog
        fields = ['id', 'user', 'appliance', 'action', 'scheduled_at']

# ✅ Appliance Schedule Serializer
class ApplianceScheduleSerializer(serializers.ModelSerializer):
    appliance_name = serializers.CharField(source='appliance.name', read_only=True)

    class Meta:
        model = ApplianceSchedule
        fields = ['id', 'appliance', 'appliance_name', 'action', 'schedule_time', 'created_at']