from django.db import models
import uuid 


class Exam(models.Model):
    exam_id = models.UUIDField(default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=100, null=True, blank=True)
    date_of_notification = models.DateField(null=True, blank=True)
    last_date_for_application = models.DateField(null=True, blank=True)
    exam_date = models.DateField(null=True, blank=True)
    duration = models.CharField(max_length=50, null=True, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    keywords = models.TextField(null=True, blank=True)
    CATEGORY_CHOICES = [
        ('UPSC', 'UPSC'),
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
    exam_description = models.TextField(null=True, blank=True)   
    eligibility_criteria = models.TextField(null=True, blank=True)
    important_resources = models.TextField(null=True, blank=True)  # Store as JSON string

    def __str__(self):
        return self.name
    def get_exam_id(self):
        return str(self.exam_id)


class SyllabusFile(models.Model):
    exam = models.ForeignKey('Exam', on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255)  # Store the path or reference to the syllabus file
    title = models.CharField(max_length=255,null=True, blank=True)  # Title of the syllabus
    description = models.TextField(null=True, blank=True)  # Description of the syllabus
    keywords = models.TextField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.exam.name} - {self.file_name}"