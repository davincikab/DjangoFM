# Generated by Django 2.2.5 on 2019-09-28 14:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='FeatureRoadcenterlin',
        ),
        migrations.DeleteModel(
            name='FeatureSewer',
        ),
        migrations.DeleteModel(
            name='FeatureSites',
        ),
        migrations.DeleteModel(
            name='FeatureTanks',
        ),
        migrations.DeleteModel(
            name='FeatureWaterTank',
        ),
    ]