from django.urls import path
from . import views
urlpatterns = [
    path('submit-answers/', views.submit_answers, name='submit_answers'),
    path('generate-mcq/', views.generate_mcq, name='generate_mcq'),
    path('student_dashboard/', views.student_dashboard, name='student_dashboard'),
    path('chatbot/', views.chatbot, name='chatbot')
] 