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
	
	# Gets the json data
	json_data = request.body.decode('utf-8')

	# Parses the data
	data = json.loads(json_data)

	# Creates a new evolution save
	new_save = models.EvolutionSave(
		starting_coords=data['startingCoords'],
		genes=data['genes'],
		asteroids=data['asteroids']
	)
	new_save.save()
	
	# returns the id
	return HttpResponse(new_save.id)