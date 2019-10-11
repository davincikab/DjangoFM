from django.db import models
from django.contrib.auth.models import User

class Employee(models.Model):
    profession_choice = (
        ('P','Plumbing'),
        ('E','Electrical Works'),
        ('M', 'Power Mechanics')
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    emp_id = models.CharField('Employee PIN',max_length=50)
    profession = models.CharField(max_length=2, choices=profession_choice)

class Supervisor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Student(object):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reg_no = models.TextField()
    course = models.TextField()
