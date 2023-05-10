# Generated by Django 4.1.7 on 2023-04-28 08:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_alter_userprofile_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='gender',
            field=models.CharField(choices=[('PreferNotSay', 'Prefer Not to Say'), ('Male', 'Male'), ('Female', 'Female')], default='PreferNotSay', max_length=20),
        ),
    ]