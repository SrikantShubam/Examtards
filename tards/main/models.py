from django.db import models

class Exam(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    date_of_notification = models.DateField(null=True, blank=True)
    last_date_for_application = models.DateField(null=True, blank=True)
    exam_date = models.DateField(null=True, blank=True)
    duration = models.CharField(max_length=50, null=True, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    keywords = models.TextField(null=True, blank=True)
    CATEGORY_CHOICES = [
        ('civil', 'Civil Exams'),
        ('engineering', 'Engineering'),
        ('medical', 'Medical'),
        ('popular', 'Popular'),
        # Add more categories as needed
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, null=True, blank=True)
    application_link = models.URLField(null=True, blank=True)
    important_resources_1 = models.URLField(null=True, blank=True)
    important_resources_2 = models.URLField(null=True, blank=True)
    syllabus = models.TextField(null=True, blank=True)
    # Add other fields as needed
    
    def __str__(self):
        return self.name
