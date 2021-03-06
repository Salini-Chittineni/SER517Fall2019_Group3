import json
import pymongo
from flask import jsonify
from bson import json_util
import ingredientFunctions
import re

# adds a recipe to the default table(recipe_info) available to every brewer
def addRecipe(recipe):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe

	collection = db.recipe_info
	if not collection.find_one({'name':recipe['name']}):
		recipe['name'] = recipe['name'].lower()
		result = collection.insert(recipe)
	else:
	    result = False
	if result:
		return 'True'
	else:
		return 'Already Inserted'

# Return the recipe information provided by app coordinator
def showRecipeByName(name):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe

	collection = db.recipe_info

	result = collection.find_one({'name' : name})
	return json.dumps(result, default=json_util.default)


# Deletes the recipe provided by app coordinator
def deleteRecipeAdmin(recipeName):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe

	collection = db.recipe_info

	result = collection.find_one({'name': recipeName['name']})
	search_query = { "name": recipeName['name'] }
	if result:
		delRecipe = collection.delete_one(search_query)
		return True
	else:
		return False


# Returns the list of ingredients needed to brew any default recipe.
def recipeIngredients(recipeName):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe

	collection = db.recipe_info

	result = collection.find_one({'name': recipeName})
	if result['name']: 
		del result['name']
	if result['_id']: 
		del result['_id']
	if 'HopsSchedule' not in result: 
		pass
	else:
		del result['HopsSchedule']
	if 'Directions' not in result: 
		pass
	else:
		del result['Directions']

	return json.dumps(result, default=json_util.default)


# Returns the list of ingredients needed to brew any particular user created recipe.
def userRecipeIngredients(userID, recipeName):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe

	collection = db.recipe_info

	result = collection.find_one({'name': recipeName})
	if result['name']: 
		del result['name']
	if result['_id']: 
		del result['_id']
	if 'HopsSchedule' not in result: 
		pass
	else:
		del result['HopsSchedule']
	if 'Directions' not in result: 
		pass
	else:
		del result['Directions']

	return json.dumps(result, default=json_util.default)


# Returns the list of all recipes provided by the app corodinator. Not specific to any user
def allRecipes():
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe

	collection = db.recipe_info
	result = list(collection.find({}))

	return json.dumps(result, default=json_util.default)


# Creates a user specific recipe
def createUserRecipes(userID, recipeInfo):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe

	collection = db[userID]
	if not collection.find_one({'name': recipeInfo['name']}):
		result = collection.insert_one(recipeInfo)
		return True
	else:
		return False


# Return the list of recipes the user can brew based on the ingredients brewer has.
def whatiCanBrewToday(userID):
	recipes  = json.loads(allRecipes())
	recipeList =[]
	ingredients = json.loads(ingredientFunctions.showIngredient(userID))
	ingredientList = []
	for key in ingredients:
		if key!='userID' and key!='_id':
			ingr = [key,ingredients[key]]
			ingredientList.append(ingr)
	flag = False
	print(ingredients)
	for recipe in recipes:
		print(recipe)
		if 'Hops' in recipe:
			hops = recipe["Hops"]
			for hop in hops:
				hopArr = hop.strip().split(':')
				if len(hopArr) == 2:
					for ingredient in ingredientList:
						if hopArr[1].strip().isdigit():
							floatHop = float(hopArr[1].strip())
							floatIngr = float( ingredient[1])
							if hopArr[0] == ingredient[0] and floatHop <= floatIngr: 
								flag = True
								break
							else:
								flag = False
		if(flag):
			recipeList.append(recipe)
		flag = False
		print("end of recipe")

				
	
	output = recipeList
	return json.dumps(output, default=json_util.default)
	

# Search a recipe using regular expression
def searchRecipe(recipeRegx):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe

	collection = db.recipe_info
	result = list(collection.find({'name': {'$regex': recipeRegx, '$options':'i'}}))
	return json.dumps(result, default=json_util.default)


def viewUserRecipes(userID):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe
	result = []
	if userID != 'recipe_info':
		if userID in db.list_collection_names():
			collection = db[userID]
			result = list(collection.find({}))
		return json.dumps(result, default=json_util.default)

# Returns user specific created, modified or brewed recipes
def viewUserRecipe(userID, recipeName):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe
	result = {}
	if userID != 'recipe_info':
		if userID in db.list_collection_names():
			collection = db[userID]
			result = collection.find_one({'name': recipeName})
	return json.dumps(result, default=json_util.default)


def deleteRecipeUser(userID, recipeName):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe
	if userID in db.list_collection_names():
		collection = db[userID]
		result = collection.find_one({'name': recipeName['name']})
		search_query = { "name": recipeName['name'] }
		if result:
			delRecipe = collection.delete_one(search_query)
			return True
		else:
			return False
	else:
		return False

# Enter the particular beer in the brewing beer database
# adds the following attributes
# 1. timesBrewed
# 2. lastModified
# 3. beerStatus(default 1)
# 4. recipeName
def brewBeer(userID, recipeData):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/brewingStatus?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.brewingStatus
	result = {}
	timesBrewed = 0
	if userID not in db.list_collection_names():
		collection = db[userID]
		timesBrewed = timesBrewed + 1
		recipeData.__setitem__("timesBrewed", timesBrewed)
		lastModified = recipeData['startTime']
		recipeData.__setitem__("lastModified", lastModified)
		recipeData.__setitem__("beerStatus", 1)
		result = collection.insert_one(recipeData)
		
		if result:
			removeBrewBeerIngredients(userID, recipeData['recipeName'])
			return True
		else: 
			return False
		
		
		### recipeName, beerStatus, startTime, lastUpdate, timesBrewed 
	else:
		collection = db[userID]
		result1 = collection.find_one({'recipeName':recipeData['recipeName']})
		if result1:
			timesBrewed = result1['timesBrewed'] + 1
			recipeData.__setitem__("timesBrewed", timesBrewed)
			lastModified = recipeData['startTime']
			recipeData.__setitem__("lastModified", lastModified)
			recipeData.__setitem__("beerStatus", 1)
			search_query = { 'recipeName':recipeData['recipeName'] }
			recipeName = recipeData['recipeName']
			del recipeData['recipeName']
			for key,value in recipeData.items():
				new_values = {"$set" : {key:value}}
				result = collection.update(search_query,new_values,upsert = True)
			if result:
				removeBrewBeerIngredients(userID, recipeName)
				return True
			else:
				return False
		else:
			timesBrewed = timesBrewed + 1
			recipeData.__setitem__("timesBrewed", timesBrewed)
			lastModified = recipeData['startTime']
			recipeData.__setitem__("lastModified", lastModified)
			recipeData.__setitem__("beerStatus", 1)
			result = collection.insert_one(recipeData)
			if result:
				removeBrewBeerIngredients(userID, recipeName)
				return True
			else:
				return False


# updates the brewing status of the brewing beer( from status 1->2, 2->3)
# changes the beerStatus and lastModified attribute of the brewing beer
def brewBeerUpdate(userID, updateData):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/brewingStatus?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.brewingStatus
	collection = db[userID]
	result = collection.find_one({'recipeName': updateData['recipeName']})
	search_query = {'recipeName': updateData['recipeName']}
	if result:
		new_status = {"$set" : {'beerStatus':result['beerStatus'] + 1}}
		collection.update(search_query,new_status,upsert = True)
		new_time = {"$set" : {'lastModified':updateData['lastModified']}}
		collection.update(search_query,new_time,upsert = True)
		return True
	else:
		return False



# removes the ingrdients from user's inventory(Ingredient list) once the user start brewing any beer
def removeBrewBeerIngredients(userID, recipeName):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/recipe?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.recipe

	collection = db[userID]
	recipeIngredients = json.loads(userRecipeIngredients(userID,recipeName))

	recipeIngredientsHops = {}
	for i in recipeIngredients['Hops']:
		arr = i.split(':')
		recipeIngredientsHops.__setitem__(arr[0],int(arr[1]))

	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/ingredient?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.ingredient

	collection = db.userIngredient

	result = collection.find_one({'userID': userID})
	search_query = { "userID": userID }
	if result:
		for key,value in recipeIngredientsHops.items():
			# new_value = {"$set" : {key:int(value)+int(result[key])}}
			if (int(result[key])-value) == 0:
				updateCollection = collection.update(search_query, {'$unset' : {key:1}})
			else:
				new_value = {"$set" : {key:int(result[key])-value}}
				updateCollection = collection.update(search_query, new_value, upsert=True)

	# recipeIngredientsGrains = {}
	# for i in recipeIngredients['Grains']:
	# 	arr = i.split(':')
	# 	#print arr
	# 	recipeIngredientsGrains.__setitem__(arr[0],int(arr[1]))

	# if result:
	# 	for key,value in recipeIngredientsGrains.items():
	# 		# new_value = {"$set" : {key:int(value)+int(result[key])}}
	# 		if (int(result[key])-value) == 0:
	# 			updateCollection = collection.update(search_query, {'$unset' : {key:1}})
	# 		else:
	# 			new_value = {"$set" : {key:int(result[key])-value}}
	# 			updateCollection = collection.update(search_query, new_value, upsert=True)





