from django.forms import ModelForm, EmailField
from .models import Student
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class UserCreateForm(UserCreationForm):
    email = EmailField()
    class Meta:
        model = User
        fields =  ['username', 'email', 'password1', 'password2']

class StudentCreateForm(ModelForm):
    class Meta:
        model = Student
        fields = ['reg_no', 'course','units']

class StudentProfile(ModelForm):
    class Meta:
        model = Student
        fields = ['reg_no', 'course','units']
