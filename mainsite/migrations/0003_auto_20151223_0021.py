# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2015-12-23 08:21
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainsite', '0002_auto_20151222_1910'),
    ]

    operations = [
        migrations.RenameField(
            model_name='evolutionsave',
            old_name='evolver',
            new_name='genes',
        ),
    ]