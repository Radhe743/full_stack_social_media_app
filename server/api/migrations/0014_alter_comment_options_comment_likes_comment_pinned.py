# Generated by Django 4.1.7 on 2023-04-25 07:40

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0013_userprofile_is_verified'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='comment',
            options={'ordering': ['-pinned', '-created_at']},
        ),
        migrations.AddField(
            model_name='comment',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='liked_post_comment', related_query_name='liked_post_comment', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='comment',
            name='pinned',
            field=models.BooleanField(default=False),
        ),
    ]
