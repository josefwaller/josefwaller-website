from django.test import TestCase, Client
import json
import random
from . import models

# Create your tests here.

class EvolutionSaveTestCase(TestCase):

	def test_save_and_retrieve_valid_setup(self):

		# Creates a bunch of random asteroids
		asteroids = []
		while len(asteroids) < 20:
			asteroids.append({
				"x": int(random.random() * 50),
				"y": int(random.random() * 50),
				"w": int(random.random() * 50),
				"h": int(random.random() * 50),
			})

		# Creates genes
		genes = []
		while len(genes) < 5:
			genes.append({
				"dir": None,
				"time": int(random.random() * 10),
				"dur": int(random.random() * 10),
				"speed": int(random.random() * 10),
			})
			if random.random() > 0.5:
				genes[len(genes) - 1]["dir"] = "y"
			else:
				genes[len(genes) - 1]["dir"] = "x"

		# Creates starting Coords
		starting_coords = [
			int(random.random() * 200),
			int(random.random() * 200)
		]

		# Sets up the data
		data = {
			"startingCoords": starting_coords,
			"asteroids": asteroids,
			"genes": genes
		}

		c = Client()
		response = c.post('/evolution_save/', json.dumps(data), content_type='application/json')

		# Checks that the server did not crash
		self.assertEqual(response.status_code, 200)

		content = response.content.decode('utf-8')

		# Checks the server did not send back an error message
		self.assertNotEqual(content, 'failure')

		# Gets the code
		code = content

		# Gets the same scenario
		response = c.post('/evolution_get/', json.dumps({"id": code}), content_type='application/json')

		self.assertEqual(response.status_code, 200)

		# Checks eveything is the same
		content = json.loads(response.content.decode('utf-8'))

		self.assertEqual(content['status'], 'success')

		self.assertEqual(json.loads(content['asteroids']), asteroids)
		self.assertEqual(json.loads(content['genes']), genes)
		self.assertEqual(json.loads(content['starting_coords']), starting_coords)

	def test_bad_code_recieves_error(self):

		# Populates database with saves
		num_of_saves = 5
		i = 0
		while i < num_of_saves:
			s = models.EvolutionSave()
			s.starting_coords = "[1,1]"
			s.asteroids = "[]"
			s.genes = "[]"
			i += 1

		# Tries to get a save that does not exist
		c = Client()
		response = c.post('/evolution_get/', json.dumps({"id": num_of_saves + 1}), content_type="application/json")

		# Checks the server did not crash and returned the proper string
		content = json.loads(response.content.decode('utf-8'))
		self.assertEqual(content['status'], 'notexist')
		self.assertEqual(response.status_code, 200)

	def test_negative_code_receives_error(self):

		c = Client()
		response = c.post('/evolution_get/', json.dumps({"id": -1}), content_type="application/json")

		self.assertEqual(response.status_code, 200)

		content = json.loads(response.content.decode("utf-8"))
		self.assertEqual(content['status'], "notexist")