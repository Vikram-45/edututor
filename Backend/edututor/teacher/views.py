from urllib import request

from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
def teacher(request):
    return HttpResponse("This is the teacher page.")