from django.shortcuts import render
from django.http import HttpResponse
from django.views import generic
from . import models

from django.views.decorators.csrf import ensure_csrf_cookie

import json
import pprint
# Create your views here.


class IndexView (generic.TemplateView):
	template_name = 'index.html'

class EvolutionView (generic.TemplateView):
	template_name = 'evolution.html'

class GraphicsView (generic.TemplateView):
	template_name = 'graphics.html'

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