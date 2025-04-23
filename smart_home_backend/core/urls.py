from django.urls import path
from .views import (
    RegisterUserView,
    ApplianceListView,
    UpdateApplianceStatusView,
    AuditLogListView,
    ScheduleApplianceActionView,
    ScheduleListView,
    ProfileView,
    AdminUserListView,
    CustomTokenView,
    ApplianceDetailView,
    AdminUserDetailView,
)
from .views import CustomTokenView

urlpatterns = [
    path('register/', RegisterUserView.as_view()),
    path('appliances/', ApplianceListView.as_view()),
    path('appliances/status/<int:appliance_id>/', UpdateApplianceStatusView.as_view()),
    path('audit-logs/', AuditLogListView.as_view()),
    path('appliances/schedule/', ScheduleApplianceActionView.as_view()),
    path('schedules/', ScheduleListView.as_view()),
    path('me/', ProfileView.as_view()),
    path('admin/users/', AdminUserListView),
    path('token/', CustomTokenView.as_view(), name='token_obtain_pair'),
    path('appliances/<int:pk>/', ApplianceDetailView.as_view()),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view()),
    

]
