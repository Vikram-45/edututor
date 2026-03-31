import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from accounts.models import User
from .models import Result
from django.db.models import Avg
from dotenv import load_dotenv
import os
import traceback
import google.generativeai as genai
load_dotenv()


genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
# ✅ Use FAST model
model = genai.GenerativeModel("gemini-flash-latest")




@csrf_exempt
def generate_mcq(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        email = data.get('email')
        subject = data.get('subject')
        difficulty = data.get('difficulty')

        if not email or not subject or not difficulty:
            return JsonResponse({"error": "All fields required"}, status=400)

        user = User.objects.filter(email=email).first()
        if not user:
            return JsonResponse({"error": "User not found"}, status=404)

        # 🔥 Optimized prompt
        prompt = f"""
        Generate exactly 5 MCQs on {subject} ({difficulty} level).

        Rules:
        - No explanation
        - Keep it short
        - 4 options only
        - Return ONLY JSON

        Format:
        [
          {{
            "question": "text",
            "options": ["A", "B", "C", "D"],
            "answer": "A"
          }}
        ]
        """

        try:
            response = model.generate_content(prompt)
            ai_text = response.text.strip()

            # ✅ Clean markdown if exists
            if ai_text.startswith("```"):
                ai_text = ai_text.replace("```json", "").replace("```", "").strip()

            mcqs = json.loads(ai_text)

        except Exception as e:
            return JsonResponse({
                "error": "AI failed",
                "details": str(e)
            }, status=500)

        return JsonResponse({
            "message": "MCQs generated",
            "questions": mcqs
        })
@csrf_exempt
def submit_answers(request):
    """Submit answers and calculate score"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        email = data.get('email')
        subject = data.get('subject')
        answers = data.get('answers', [])

        # ✔️ Validation
        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)
        if not subject:
            return JsonResponse({"error": "Subject is required"}, status=400)
        if not answers or not isinstance(answers, list):
            return JsonResponse({"error": "Answers must be a non-empty list"}, status=400)

        # 🔍 Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

        # 📊 Calculate score
        score = 0
        total_questions = len(answers)

        if total_questions == 0:
            return JsonResponse({"error": "Answers list cannot be empty"}, status=400)

        # If request includes flat answer strings, require correct_answers
        if all(isinstance(item, str) for item in answers):
            correct_answers = data.get('correct_answers')
            if not correct_answers or not isinstance(correct_answers, list) or len(correct_answers) != total_questions:
                return JsonResponse({"error": "correct_answers must be provided and match length of answers"}, status=400)
            for submitted, correct in zip(answers, correct_answers):
                if str(submitted).strip().lower() == str(correct).strip().lower():
                    score += 1

        # Backward compatibility: answer objects with selected/correct fields
        elif all(isinstance(item, dict) for item in answers):
            for answer in answers:
                selected = answer.get('selected', '')
                correct = answer.get('correct', '')
                if str(selected).strip().lower() == str(correct).strip().lower():
                    score += 1

        else:
            return JsonResponse({"error": "Invalid answers format"}, status=400)

        # 💾 Save result to database
        Result.objects.create(
            user=user,
            subject=subject,
            score=score,
            total_questions=total_questions
        )

        return JsonResponse({
            "message": "Test submitted successfully",
            "score": score,
            "total": total_questions
        }, status=200)
@csrf_exempt
def student_dashboard(request):
    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get('email')

        if not email:
            return JsonResponse({"error": "Email is required"})

        user = User.objects.filter(email=email).first()
        if not user:
            return JsonResponse({"error": "User not found"})

        results = Result.objects.filter(user=user)

        total_tests = results.count()
        average_score = results.aggregate(Avg('score'))['score__avg']

        latest = results.order_by('-id').first()
        latest_score = latest.score if latest else 0

        return JsonResponse({
            "name": user.name,
            "total_tests": total_tests,
            "average_score": average_score or 0,
            "latest_score": latest_score
        })
@csrf_exempt
def chatbot(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        message = data.get('message', '').strip()

        if not message:
            return JsonResponse({"error": "Message required"}, status=400)

        prompt = f"""
        You are a friendly tutor.

        Rules:
        - Simple explanation
        - Max 3–5 lines
        - Give example if needed

        Question: {message}
        Answer:
        """

        try:
            response = model.generate_content(prompt)
            ai_text = response.text.strip()

        except Exception as e:
            return JsonResponse({
                "error": "AI failed",
                "details": str(e)
            }, status=500)

        return JsonResponse({"reply": ai_text})