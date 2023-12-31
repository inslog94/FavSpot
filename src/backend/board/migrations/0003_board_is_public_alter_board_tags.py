# Generated by Django 4.2.4 on 2023-08-28 02:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0002_alter_board_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='board',
            name='is_public',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='board',
            name='tags',
            field=models.ManyToManyField(blank=True, to='board.boardtag'),
        ),
    ]
