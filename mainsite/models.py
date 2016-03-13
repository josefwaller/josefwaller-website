from django.db import models

# Create your models here.

class EvolutionSave (models.Model):

	starting_coords = models.CharField(max_length=30)
	asteroids = models.CharField(max_length=2500)
	genes = models.CharField(max_length=2000)

# RPGMaker save

class SpriteSave (models.Model):

	# Saves an individual sprite as JSON
	spriteJSON = models.CharField(max_length=1600)

class SpriteObjectSave (models.Model):

	# a dictionary of the prites for this object
	# for example, player would have runDownOne, runDownTwo, etc
	# and each would be an id pointing towards a SpriteSave object
	spritesDictionaryJSON = models.CharField(max_length=100)

class SpriteSetSave (models.Model):

	# A dictionary of the objects
	# For example, the key 'player' points towards the
	# SpriteObjectSave object that saves all the sprites 
	# for player
	spriteDictionaryJSON = models.CharField(max_length=4000)
	colorsJSON = models.CharField(max_length=1000)


class MusicSave (models.Model):

	notesJSON = models.CharField(max_length=2000)
	settingsJSON = models.CharField(max_length=100)

class DialogSave (models.Model):

	dialogJSON = models.CharField(max_length=1000)

class LevelSave (models.Model):

	levelJSON = models.CharField(max_length=1000)

class GameSave (models.Model):

	spritesID = models.IntegerField()
	musicID = models.IntegerField()
	dialogID = models.IntegerField()
	levelID = models.IntegerField()