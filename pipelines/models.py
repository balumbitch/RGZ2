from django.db import models

class Pipeline(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class Task(models.Model):
    pipeline = models.ForeignKey(Pipeline, related_name='tasks', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=[
        ('Pending', 'Pending'),
        ('Running', 'Running'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed')
    ])
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    logs = models.TextField(blank=True)
