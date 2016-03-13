from django.shortcuts import render
from django.http import HttpResponse
from django.views import generic
from . import models

from django.views.decorators.csrf import ensure_csrf_cookie

import json
import pprint
import sys
import traceback

# Create your views here.


class IndexView (generic.TemplateView):
	template_name = 'index.html'

class EvolutionView (generic.TemplateView):
	template_name = 'evolution.html'

class GraphicsView (generic.TemplateView):
	template_name = 'graphics.html'

class RocketView (generic.TemplateView):
	template_name = 'rocket.html'

class RPGMakerView (generic.TemplateView):
	template_name = 'rpgmaker.html'

def save_evolution (request):

	try:
	
		# Gets the json data
		json_data = request.body.decode('utf-8')

		# Parses the data
		data = json.loads(json_data)

		# Creates a new evolution save
		# Since Django models do not have a dictionary field, they are saved as a json string

		new_save = models.EvolutionSave(
			starting_coords=json.dumps(data['startingCoords']),
			genes=json.dumps(data['genes']),
			asteroids=json.dumps(data['asteroids'])
		)

		new_save.save()

		# returns the id
		return HttpResponse(new_save.id)


	except:

		exc_type, exc_value, exc_traceback = sys.exc_info()
		lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
		print (''.join('!! ' + line for line in lines))  # Log it or whatever here

		error_message = "failure"
		return HttpResponse(error_message)

def get_evolution_save (request):

	# Gets the data
	data = json.loads(request.body.decode('utf-8'))

	# gets the id
	id = data['id']

	# Gets the save
	try:
		save = models.EvolutionSave.objects.get(pk=id)
	except :
		return HttpResponse(json.dumps({"status": "notexist"}))

	# Gets a dict to return
	return_dict = {
		"status": "success",
		"genes": save.genes,
		"asteroids": save.asteroids,
		"starting_coords": save.starting_coords
	}

	return HttpResponse(json.dumps(return_dict))
		
def save_evolution (request):

	try:
	
		# Gets the json data
		json_data = request.body.decode('utf-8')

		# Parses the data
		data = json.loads(json_data)

		# Creates a new evolution save
		# Since Django models do not have a dictionary field, they are saved as a json string

		new_save = models.EvolutionSave(
			starting_coords=json.dumps(data['startingCoords']),
			genes=json.dumps(data['genes']),
			asteroids=json.dumps(data['asteroids'])
		)

		new_save.save()

		# returns the id
		return HttpResponse(new_save.id)


	except:

		exc_type, exc_value, exc_traceback = sys.exc_info()
		lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
		print (''.join('!! ' + line for line in lines))  # Log it or whatever here

		error_message = "failure"
		return HttpResponse(error_message)


def save_rpg_game (request):

	try:

		# Saves an RPG game in several data fields
		# Incoming JSON should look like this:
		# {
		# 	level: (level as JSON),
		# 	sprites: (sprites as JSON),
		# 	colors: (colors as JSON),
		# 	notes: (the music notes as JSON),
		# 	musicSettings: (the music volume and speed as JSON),
		# 	dialog: (the dialog as JSON)
		# }
		#  Returns the id of the gameSave, which has references to the other saves
	
		# Gets the json data
		json_data = request.body.decode('utf-8')

		# Parses the data
		data = json.loads(json_data)

			

		# Creates a new save for each field

		sprite_set_save_dict = {}
		# creates a new sprite save for each sprite
		for sprite_object_key in data['sprites']:

			this_sprite_dict = {}

			for sprite_key in data['sprites'][sprite_object_key]:

				# creates a new sprite object for each sprite

				# checks if the array is empty
				# if so, it just saves the value as null, rather than creating a new SpriteSave Object

				if (list_is_empty(data['sprites'][sprite_object_key][sprite_key])):

					this_sprite_dict[sprite_object_key] = None

				else:

					sprite_save = models.SpriteSave(spriteJSON=json.dumps(data['sprites'][sprite_object_key][sprite_key]))
					sprite_save.save()

					# records the id for the sprite set object
					this_sprite_dict[sprite_object_key] = sprite_save.save()

			# adds the sprite set
			# there is one for each object

			sprite_set_save = models.SpriteObjectSave(spritesDictionaryJSON=json.dumps(this_sprite_dict))
			sprite_set_save.save()

			sprite_set_save_dict[sprite_object_key] = sprite_set_save.id

		# saves all the object references as a SpriteSet
		sprite_set_save = models.SpriteSetSave(
			spriteDictionaryJSON=json.dumps(sprite_set_save_dict),
			colorsJSON=json.dumps(data['colors']))

		sprite_set_save.save()


		# jsonifies all the data
		for key in data:
			data[key] = json.dumps(data[key])
			# prints the number of characters
			# print("The value %s is %s characters long." % (key, len(data[key])))


		# Saves everthing else, since sprites has to be such a trouble child
		# look how nice an organized it is
		level_save = models.LevelSave(
			levelJSON=data['level']
		)
		level_save.save()

		music_save = models.MusicSave(
			notesJSON=data['notes'],
			settingsJSON=data['musicSettings']
		)
		music_save.save()

		dialog_save = models.DialogSave(
			dialogJSON=data['dialog']
		)
		dialog_save.save()

		#Creates the game save incorporating all of the ids
		gameSave = models.GameSave(
			levelID=level_save.id,
			spritesID=sprite_set_save.id,
			musicID=music_save.id,
			dialogID=dialog_save.id
		)
		gameSave.save()

		# returns the id
		return HttpResponse(gameSave.id)


	except:

		exc_type, exc_value, exc_traceback = sys.exc_info()
		lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
		print (''.join('!! ' + line for line in lines))  # Log it or whatever here

		error_message = "failure"
		return HttpResponse(error_message)

# Checks if a sprite is just all null
def list_is_empty(list):

	for x in range(len(list)):
		for y in range(len(list[x])):

			if not list[x][y] == None:
				return False

	return True