# Generated by Django 4.1.7 on 2023-04-27 08:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_alter_comment_options_comment_likes_comment_pinned'),
    ]

    operations = [
        migrations.CreateModel(
            name='SavedPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.post')),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.userprofile')),
            ],
        ),
        migrations.AddField(
            model_name='userprofile',
            name='saved_posts',
            field=models.ManyToManyField(blank=True, through='api.SavedPost', to='api.post'),
        ),
    ]
