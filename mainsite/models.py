from django.db import models

# Create your models here.

class EvolutionSave (models.Model):

	starting_coords = models.CharField(max_length=6)
	asteroids = models.CharField(max_length=200)
	genes = models.CharField(max_length=300)