# Generated by Django 2.2.5 on 2019-10-11 08:26

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facility', '0002_auto_20190928_1741'),
    ]

    operations = [
        migrations.CreateModel(
            name='Road',
            fields=[
                ('gid', models.AutoField(primary_key=True, serialize=False)),
                ('objectid', models.BigIntegerField(blank=True, null=True)),
                ('surface', models.CharField(blank=True, max_length=254, null=True)),
                ('walk_speed', models.BigIntegerField(blank=True, null=True)),
                ('cycle_spee', models.BigIntegerField(blank=True, null=True)),
                ('distance', models.DecimalField(blank=True, decimal_places=65535, max_digits=65535, null=True)),
                ('way', models.BigIntegerField(blank=True, null=True)),
                ('type', models.CharField(blank=True, max_length=254, null=True)),
                ('id', models.BigIntegerField(blank=True, null=True)),
                ('drive_spee', models.BigIntegerField(blank=True, null=True)),
                ('source', models.SmallIntegerField(blank=True, null=True)),
                ('target', models.SmallIntegerField(blank=True, null=True)),
                ('geom', django.contrib.gis.db.models.fields.MultiLineStringField(blank=True, null=True, srid=4326)),
            ],
            options={
                'db_table': 'road',
                'managed': False,
            },
        ),
        migrations.DeleteModel(
            name='FeatureFps',
        ),
    ]