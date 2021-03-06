import json
import pymongo
from flask import jsonify
from bson import json_util


# Returns the shopping list of any particular user
def showShoppingList(userID):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/shoppingList?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.shoppingList

	collection = db.userShoppingList

	result = collection.find_one({'userID' : userID})
	return json.dumps(result, default=json_util.default)

# There will be uniques items combining shop list and auto shop list
# if the user will try to add any item in the shop list and it is already present in shop list or auto shop list 
# it will not be updated, user has to go to the view shop list and change the quantity.
def addShoppingList(userID, userShopList):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/shoppingList?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.shoppingList

	collection = db.userShoppingList
	result = False
	currShoplist = showShoppingList(userID)
	if not collection.find_one({'userID' : userID}):
		result = collection.insert_one(userShopList).inserted_id
	else:
		search_query = { "userID": userID}
		shopListSet = distinctShopListItems(userID,collection)
		for key,value in userShopList.items():
			if key != 'userID':
				if key not in shopListSet and key not in currShoplist:
					new_values = {"$set" : {key:value}}
					result = collection.update(search_query,new_values,upsert = True)
	if result:
		return True
	else:
		return False

# Overides the quantity of any particular item present in the shopping list
def updateShoppingList(userID, shopList):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/shoppingList?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.shoppingList

	collection = db.userShoppingList

	result = collection.find_one({'userID': userID})
	search_query = { "userID": userID }
	if result:
		for key,value in shopList.items():
			new_value = {"$set" : {key:str(int(value))}}
			updateCollection = collection.update(search_query, new_value, upsert=True)
		return True
	else:
		return False


# Adds the new quantity to the quatity of the item previously in the shopping list
def addMoreShoppingList(userID, shopList):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/shoppingList?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.shoppingList

	collection = db.userShoppingList

	result = collection.find_one({'userID': userID})
	search_query = { "userID": userID }
	if result:
		for key,value in shopList.items():
			new_value = {"$set" : {key:int(value)+int(result[key])}}
			updateCollection = collection.update(search_query, new_value, upsert=True)
		return True
	else:
		return False


# Deletes the item from the shopping list
def deleteShoppingListItems(userID, shopList):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/shoppingList?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.shoppingList

	collection = db.userShoppingList

	result = collection.find_one({'userID': userID})
	search_query = { "userID": userID }
	if result:
		for key,value in shopList.items():
			search_query = {"$and": [{"userID": userID}, {key: {'$exists':True}}]}
			updateCollection = collection.update(search_query, {'$unset' : {key:1}})
			if not updateCollection['updatedExisting']:
				return False
		return True
	return False


# Auto Shop List functions

# Only the items not in shop list will be added.
def createAutoShopList(userID):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/ingredient?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.ingredient

	collection = db.userIngredient
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/shoppingList?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db_asl = client.shoppingList
	collection_asl = db_asl.userAutoShopList

	result = collection.find_one({'userID': userID})
	del result['userID']
	del result['_id']
	dic = {}
	for key,value in result.items():
		if int(value) < 2:
			dic.__setitem__(key,value)
	result_asl = collection_asl.find_one({'userID': userID})
	if not result_asl:
		dic.__setitem__('userID',userID)
		updateCollection = collection_asl.insert_one(dic).inserted_id
	else:
		search_query = { "userID": userID }
		for key,value in dic.items():
			if key not in distinctShopListItems(userID, client.shoppingList.userShoppingList):
				new_values = {"$set" : {key:value}}
				updateCollection = collection_asl.update(search_query, new_values, upsert=True)
	
	return json.dumps(collection_asl.find_one({'userID' : userID}), default=json_util.default)


# Removes the repeated elements from the shopping and autoshopping list
def distinctShopListItems(userID,collection):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/shoppingList?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db_asl = client.shoppingList
	collection_asl = db_asl.userAutoShopList

	result_asl = collection_asl.find_one({'userID': userID})
	result = collection.find_one({'userID' : userID})
	newSet = set(result.keys())
	newSet.update(result_asl.keys())
	newSet.remove('_id')
	newSet.remove('userID')
	return newSet


# Moves an item from the autoshopping list to shopping list
def moveToShoppingList(userID, itemList):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/shoppingList?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.shoppingList

	collection = db.userShoppingList
	result = False
	search_query = { "userID": userID}
	for key,value in itemList.items():
		new_values = {"$set" : {key:value}}
		result = collection.update(search_query,new_values,upsert = True)

	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/shoppingList?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db_asl = client.shoppingList
	collection_asl = db_asl.userAutoShopList

	result = collection_asl.find_one({'userID': userID})
	search_query = { "userID": userID }
	if result:
		for key,value in itemList.items():
			search_query = {"$and": [{"userID": userID}, {key: {'$exists':True}}]}
			updateCollection = collection_asl.update(search_query, {'$unset' : {key:1}})
			if not updateCollection['updatedExisting']:
				break
		
	return json.dumps(collection_asl.find_one({'userID' : userID}), default=json_util.default)


# Moves the items shopped to the ingredient list with the respective quantity shopped
# Removes the item from the shopping list
def itemsShopped(userID, itemList):
	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/shoppingList?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.shoppingList

	collection = db.userShoppingList

	result = collection.find_one({'userID': userID})
	search_query = { "userID": userID }
	if result:
		for key,value in itemList.items():
			search_query = {"$and": [{"userID": userID}, {key: {'$exists':True}}]}
			updateCollection = collection.update(search_query, {'$unset' : {key:1}})

	client = pymongo.MongoClient("mongodb://test1:project2019@gettingstarted-shard-00-00-2kb0f.mongodb.net:27017,gettingstarted-shard-00-01-2kb0f.mongodb.net:27017,gettingstarted-shard-00-02-2kb0f.mongodb.net:27017/ingredient?ssl=true&replicaSet=GettingStarted-shard-0&authSource=admin&retryWrites=true&w=majority")
	db = client.ingredient

	collection = db.userIngredient
	search_query = { "userID": userID }
	result = collection.find_one({'userID': userID})
	if result:
		for key,value in itemList.items():
			new_value = {"$set" : {key:value}}
			updateCollection = collection.update_one(search_query, new_value, upsert= True)

	return True


