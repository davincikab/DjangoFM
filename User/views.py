from django.shortcuts import render, redirect
from .models import  Student, Employee
from .forms import StudentProfile, UserCreateForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required

# Create login
def register_view(request):
    if request.method == 'POST':
        form = UserCreateForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data.get('username')
            messages.success(request, f'Your account has been created')
            form.save()
            return redirect('login')
    else:
        form = UserCreateForm()
    return render(request,'user/user_registration.html',{'form':form})

def profile(request):
    return render(request, 'user/profile.html')
