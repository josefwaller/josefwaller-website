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


def save_rpg_game (request):

	try:

		# Saves an RPG game in several data fields
		# Incoming JSON should look like this:
		# {
		# 	level: (level as JSON),
		# 	sprites: (sprites as JSON),
		# 	colors: (colors as JSON),
		# 	notes: (the music notes as JSON),
		# 	dialog: (the dialog as JSON)
		#	id: (the optional ID of the existing game)
		#	password: (The password to be saved with the setup)
		# }
		#  Returns the id of the gameSave, which has references to the other saves
	
		# Gets the json data
		json_data = request.body.decode('utf-8')

		# Parses the data
		data = json.loads(json_data)

		# checks if it has an id attached
		if ('id' in data):

			# gets the components from the game
			ids = get_game_component_ids(game_id=data['id'], password=data['password'])
			
			# check if no game was found
			if (ids == None):
				return HttpResponse(json.dumps({"status":"wrongpass"}))

			# Gets the components from ID
			level_save = models.LevelSave.objects.get(pk=ids['level'])
			dialog_save = models.DialogSave.objects.get(pk=ids['dialog'])
			sprite_set_save = models.SpriteSetSave.objects.get(pk=ids['sprite_set'])

			# saves over the components
			level_save.levelJSON = json.dumps(data['level'])

			dialog_save.dialogJSON = json.dumps(data['dialog'])

			sprite_set_save.colorsJSON = json.dumps(data['colors'])

			# saves them
			level_save.save()
			dialog_save.save()
			sprite_set_save.save()

			# saves over the sprites
			for sprite_object_key in ids['sprites']:

				sprite_object_save = models.SpriteObjectSave.objects.get(pk=ids['sprite_objects'][sprite_object_key])

				# the indexes will be edited as sprites are added or removed
				# modefied sprites will be saved over the former sprites
				sprite_indexes = json.loads(sprite_object_save.spritesDictionaryJSON)

				for sprite_key in ids['sprites'][sprite_object_key]:
					
					sprite_id = ids['sprites'][sprite_object_key][sprite_key]

					sprite_data = data['sprites'][sprite_object_key][sprite_key]

					# if the sprite object exists
					if sprite_id is not None:

						if list_is_empty(sprite_data):

							# a sprite object exists, but the data sent is an empty sprite
							# checks if a sprite object exists, and if so deletes it
							# otherwise it is already done

							try:

								sprite_save = models.SpriteSave.objects.get(pk=sprite_id)
								sprite_save.delete()

								sprite_indexes[sprite_key] = None

							except DoesNotExist:
								# already doesn't exist, no action needed
								# this should never be called, but just in case
								pass

						# if a sprite object already exists and data was sent for it
						else:

							# writes to the sprite object
							sprite_save = models.SpriteSave.objects.get(pk=sprite_id)
							sprite_save.spriteJSON = json.dumps(sprite_data)

							sprite_save.save()
							sprite_indexes[sprite_key] = sprite_save.id

					# If the sprite does not exist
					else:

						# checks if data was sent for it
						if not list_is_empty(sprite_data):

							# creates a new object
							sprite_save = models.SpriteSave(
								spriteJSON=json.dumps(sprite_data))
							sprite_save.save()

							# saves its ID
							sprite_indexes[sprite_key] = sprite_save.id

						else:
							# Sprite does not exist and an empty sprite was sent
							# everything is perfect
							pass

				sprite_object_save.spritesDictionaryJSON = json.dumps(sprite_indexes)
				sprite_object_save.save()


			return HttpResponse("Success")
		else:

			# Creates a new save for each field
			
			#checks that the password is legitimate
			invalid_chars = [
				'',
				'/',
				'!',
				'@',
				'#',
				'$',
				'%',
				'^',
				'&',
				'*',
				'(',
				')',
				'<',
				'>',
				'~'
			]
			
			for c in invalid_chars:
				
				if c in data['password']:
					return HttpResponse(json.dumps({"status":"badpass"}))

			sprite_set_save_dict = {}
			# creates a new sprite save for each sprite
			for sprite_object_key in data['sprites']:

				this_sprite_dict = {}

				for sprite_key in data['sprites'][sprite_object_key]:

					# creates a new sprite object for each sprite

					# checks if the array is empty
					# if so, it just saves the value as null, rather than creating a new SpriteSave Object

					if (list_is_empty(data['sprites'][sprite_object_key][sprite_key])):

						this_sprite_dict[sprite_key] = None

					else:

						sprite_save = models.SpriteSave(spriteJSON=json.dumps(data['sprites'][sprite_object_key][sprite_key]))
						sprite_save.save()

						# records the id for the sprite set object
						this_sprite_dict[sprite_key] = sprite_save.id

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

			dialog_save = models.DialogSave(
				dialogJSON=data['dialog']
			)
			dialog_save.save()

			#Creates the game save incorporating all of the ids
			gameSave = models.GameSave(
				levelID=level_save.id,
				spritesID=sprite_set_save.id,
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

def get_rpg_game (request):

	try:

		# gets the GameSave object by id
		# gets each field by the id in GameObject
		#---> For art, gets the references for each SpriteObjectSave Object
		#-------> Then gets the references for each SpriteSave Object
		#-----------> Then adds that data to return
		# Returns data

		# Gets the json data
		json_data = request.body.decode('utf-8')

		# Parses the data
		data = json.loads(json_data)

		# checks it is a game object
		try:
			int(data['id'])
		except:
			return HttpResponse(json.dumps({"status": "notvalid"}))

		# gets the game object
		try:
			game_save = models.GameSave.objects.get(pk=data)
		except :
			return HttpResponse(json.dumps({"status": "notexist"}))

		toReturn = {}

		# Gets all easy to get values
		# I.E. everything but art

		level_save = models.LevelSave.objects.get(pk=game_save.levelID)
		toReturn['level'] = json.loads(level_save.levelJSON)

		dialog_save = models.DialogSave.objects.get(pk=game_save.dialogID)
		toReturn['dialog'] = json.loads(dialog_save.dialogJSON)

		# Gets the sprites

		sprite_set_save = models.SpriteSetSave.objects.get(pk=game_save.spritesID)

		# saves the color
		toReturn['colors'] = json.loads(sprite_set_save.colorsJSON)

		# the sprites as a dictionary
		sprite_dict = {}

		indexes = json.loads(sprite_set_save.spriteDictionaryJSON)

		# gets each SpriteObjectSave Object
		for sprite_object_key in indexes:

			sprite_dict[sprite_object_key] = {}

			# gets the save
			sprite_object_save = models.SpriteObjectSave.objects.get(pk=indexes[sprite_object_key])

			sprite_indexes = json.loads(sprite_object_save.spritesDictionaryJSON)

			for sprite_index_key in sprite_indexes:

				if sprite_indexes[sprite_index_key] == None:
					sprite_dict[sprite_object_key][sprite_index_key] = None

				else:

					sprite_save = models.SpriteSave.objects.get(pk=sprite_indexes[sprite_index_key])

					# adds it 
					sprite_dict[sprite_object_key][sprite_index_key] = json.loads(sprite_save.spriteJSON)


		toReturn['sprites'] = sprite_dict
		#returns the data
		return HttpResponse(json.dumps(toReturn))

	except:

		exc_type, exc_value, exc_traceback = sys.exc_info()
		lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
		print (''.join('!! ' + line for line in lines))  # Log it or whatever here

		error_message = "failure"
		return HttpResponse(json.dumps({"status": error_message}))

# Checks if a sprite is just all null
def list_is_empty(list):

	for x in range(len(list)):
		for y in range(len(list[x])):

			if not list[x][y] == None:
				return False

	return True

# Gets the IDS of all the components (Music, sprites, etc) from the game ID
def get_game_component_ids(game_id, password):

	game_save = models.GameSave.objects.get(id=game_id, password=password)

	level_save = models.LevelSave.objects.get(pk=game_save.levelID)

	dialog_save = models.DialogSave.objects.get(pk=game_save.dialogID)

	# Gets the sprites
	sprite_set_save = models.SpriteSetSave.objects.get(pk=game_save.spritesID)

	# the indexes of the sprite object ids
	indexes = json.loads(sprite_set_save.spriteDictionaryJSON)

	# The indexes to return 

	# the ids of the individual sprites
	returnIndexes = {}

	# gets each SpriteObjectSave Object
	for sprite_object_key in indexes:

		# gets the save
		sprite_object_save = models.SpriteObjectSave.objects.get(pk=indexes[sprite_object_key])

		# adds it to the indexes to return
		returnIndexes[sprite_object_key] = json.loads(sprite_object_save.spritesDictionaryJSON)

	# Gets everything to return
	toReturn = {
		"game": game_id,
		"level": level_save.id,
		"dialog": dialog_save.id,
		"sprite_set": sprite_set_save.id,
		"sprite_objects": indexes,
		"sprites": returnIndexes
	}
	# sprites is saved as [object][sprite]
	# for example toReturn["sprites"]["player"]["runDownOne"] would return the id of the runDownOne SpriteSave

	# objects is saves as [object]
	# for example, toReturn["sprite_objects"]["player"] would return the id of the player SpriteObjectSave

	return toReturn