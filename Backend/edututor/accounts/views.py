    
import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import User

@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"error":"Only POST allowed"}, status=405)

    data = json.loads(request.body)
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name:
        return JsonResponse({"error": "Name is required"}, status=400)
    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)
    if not password:
        return JsonResponse({"error": "Password is required"}, status=400)
    if len(password) < 5:
        return JsonResponse({"error": "Password must be at least 5 characters"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "Email already exists"}, status=400)

    hashed_password = make_password(password)
    user = User(name=name, email=email, password=hashed_password)
    user.save()
    return JsonResponse({"message": "User registered successfully"})

@csrf_exempt
def login(request):
    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get('email')
        password = data.get('password')

        # 🔴 Check missing fields
        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)
        if not password:
            return JsonResponse({"error": "Password is required"}, status=400)

        # 🧑‍🏫 Teacher login (hardcoded)
        if email == "teacher@gmail.com" and password == "123":
            return JsonResponse({
                "message": "Teacher login successful",
                "role": "teacher"
            })

        # 👨‍🎓 Student login (DB check)
        user = User.objects.filter(email=email).first()

        if not user:
            return JsonResponse({"error": "User not found"}, status=404)

        # 🔐 Check password
        if not check_password(password, user.password):
            return JsonResponse({"error": "Invalid password"}, status=401)

        return JsonResponse({
            "message": "Student login successful",
            "role": "student",
            "name": user.name,
            "email": user.email
        })