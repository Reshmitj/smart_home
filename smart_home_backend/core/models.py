from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

class Appliance(models.Model):
    CONNECTION_CHOICES = (
        ('WiFi', 'WiFi'),
        ('Bluetooth', 'Bluetooth'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)
    connection = models.CharField(max_length=20, choices=CONNECTION_CHOICES)

    def __str__(self):
        return self.name


class ApplianceStatus(models.Model):
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE)
    status = models.CharField(max_length=10)  # ON/OFF/FAULT
    energy_usage = models.FloatField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
     return f"{self.appliance.name} - {self.status}"


class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE)
    action = models.CharField(max_length=10)  # "ON" or "OFF"
    scheduled_at = models.DateTimeField()

    def __str__(self):
        return f"{self.appliance.name} -> {self.action} @ {self.scheduled_at}"

class ApplianceSchedule(models.Model):
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE)
    action = models.CharField(max_length=10, choices=[("ON", "ON"), ("OFF", "OFF")])
    schedule_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
