# Generated by Django 5.1.4 on 2025-05-19 13:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_child_age_group_child_favorite_topics_child_gender_and_more'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
            ],
        ),
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
    ]
