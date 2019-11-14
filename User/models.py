from django.db import models
from django.contrib.auth.models import User
from facility.models import Timetable

class Employee(models.Model):
    profession_choice = (
        ('P','Plumbing'),
        ('E','Electrical Works'),
        ('M', 'Power Mechanics')
    )

    rank = (
        ('SV','Supervisor'),
        ('SB','Subordinate')
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    emp_id = models.CharField('Employee PIN',max_length=50)
    profession = models.CharField(max_length=2, choices=profession_choice)
    rank = models.CharField(max_length=2, choices = rank, default='SB')

    def __str__(self):
        return f'{self.user.username} Profile'

class Student(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reg_no = models.TextField()
    course = models.TextField()
    units = models.ManyToManyField(Timetable)

    def __str__(self):
        return f'{self.user.username} Profile'
