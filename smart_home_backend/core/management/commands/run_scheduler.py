from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import ApplianceSchedule, ApplianceStatus

class Command(BaseCommand):
    help = 'Execute scheduled appliance actions'

    def handle(self, *args, **kwargs):
        now = timezone.now()
        due_actions = ApplianceSchedule.objects.filter(schedule_time__lte=now)

        for schedule in due_actions:
            # Update or create ApplianceStatus
            status_obj, _ = ApplianceStatus.objects.get_or_create(appliance=schedule.appliance)
            status_obj.status = schedule.action
            status_obj.save()

            self.stdout.write(f"{schedule.appliance.name} set to {schedule.action}")

            # Optionally delete schedule after execution
            schedule.delete()
