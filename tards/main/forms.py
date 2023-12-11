from django import forms

class ExamSearchForm(forms.Form):
    search_query = forms.CharField(label='Search for Exam', max_length=100)
