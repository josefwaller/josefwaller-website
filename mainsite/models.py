from django.db import models

# Create your models here.

class EvolutionSave (models.Model):

	starting_coords = models.CharField(max_length=30)
	asteroids = models.CharField(max_length=2500)
	genes = models.CharField(max_length=2000)