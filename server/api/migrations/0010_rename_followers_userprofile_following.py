# Generated by Django 4.1.7 on 2023-04-17 09:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_userprofile'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userprofile',
            old_name='followers',
            new_name='following',
        ),
    ]
