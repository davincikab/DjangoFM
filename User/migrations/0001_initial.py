# Generated by Django 2.2.6 on 2019-11-11 12:37

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('facility', '0002_auto_20191103_0630'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reg_no', models.TextField()),
                ('course', models.TextField()),
                ('units', models.ManyToManyField(to='facility.Timetable')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('emp_id', models.CharField(max_length=50, verbose_name='Employee PIN')),
                ('profession', models.CharField(choices=[('P', 'Plumbing'), ('E', 'Electrical Works'), ('M', 'Power Mechanics')], max_length=2)),
                ('rank', models.CharField(choices=[('SV', 'Supervisor'), ('SB', 'Subordinate')], default='SB', max_length=2)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
