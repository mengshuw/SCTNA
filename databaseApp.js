const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const assert = require('assert');
const path = require('path');
const express = require('express');
const request = require('request');
const app = express();

const PORT_NUMBER = 8081;

var database = "database1";

app.listen(PORT_NUMBER, function () {
	console.log('Example app listening on port ' + PORT_NUMBER + '!');
});

app.get('/main', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/database.html'));
});

app.use('/js', express.static('/home/ubuntu/sctna/js'));

// Reference Schema (Multiple -> One) (Populate)
// var buildingSchema = mongoose.Schema({
// 	_id: mongoose.Schema.Types.ObjectId,
// 	buildingNumber: Number,
// 	direction: String,
// 	streetNumber: Number,
// 	buildingName: String,
// 	comment: String
// })
// var roomSchema = mongoose.Schema({
// 	roomNumber: Number,
// 	check: Boolean,
// 	buildingName: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		ref: "Building"
// 	},
// 	comment: String
// })


// Embedded Schema (One -> Mutiple)
var roomSchema = mongoose.Schema({
	roomNumber: Number,
	check: Boolean,
	comment: String
})
var buildingSchema = mongoose.Schema({
	buildingNumber: Number,
	streetName: String,
	fullAddress: String,
	buildingName: String,
	rooms: [roomSchema],
	date: String,
	comment: String
})

var Building = mongoose.model("Building", buildingSchema);
var Room = mongoose.model("Room", roomSchema);

app.get('/addBuilding', function(req, res) {

	var buildingNumber = req.query.buildingNumber;
	var streetName = req.query.streetName;
	var fullAddress = req.query.fullAddress;
	var buildingName = req.query.buildingName;
	var date = req.query.date;
	var comment = req.query.comment;

	console.log(buildingNumber);
	console.log(streetName);
	console.log(fullAddress);
	console.log(buildingName);
	console.log(comment);

	mongoose.connect("mongodb://localhost:27017/" + database, function(err, db) {
		if (err) {
			res.send("Connection Error");
			throw err;
		}

		console.log("Connect To Database");

		var queryBuilding = {
			buildingNumber: buildingNumber,
			streetName: streetName
		}

		// Search the buiding first
		Building.findOne(queryBuilding, function (err, building) {
			if (err) {
				throw err;
			}
			// If it's a new building, add it to the database
			// If it's already in the database, do nothing
			if (building == null) {
				console.log("This is a new building");
				var newBuilding = new Building({
					buildingNumber: buildingNumber,
					streetName: streetName,
					fullAddress: fullAddress,
					buildingName: buildingName,
					rooms: [],
					date: date,
					comment: comment
				})
				newBuilding.save(function (err) {
					if (err) {
						throw err;
					}
					console.log("New Building Saved !");
					res.send("Saved");
					mongoose.connection.close();
					console.log("Close Connection");
				})
			} else {
				console.log("This building is already in the database !");
				res.send("Existed");
				mongoose.connection.close();
				console.log("Close Connection");
			}
		});
	});
});


app.get('/searchBuilding', function(req, res) {

	var buildingNumber = req.query.buildingNumber;
	var streetName = req.query.streetName;

	console.log(buildingNumber);
	console.log(streetName);

	mongoose.connect("mongodb://localhost:27017/" + database, function(err, db) {
		if (err) {
			res.send("Connection Error");
			throw err;
		}
		console.log("Connect To Database");
		console.log("Search building");

		var queryBuilding;
		if (buildingNumber != 0 && streetName != "") {
			queryBuilding = {
				buildingNumber: buildingNumber,
				streetName: streetName
			}
		} else if (buildingNumber == 0 && streetName != "") {
			queryBuilding = {
				streetName: streetName
			}
		} else if (buildingNumber != 0 && streetName == "") {
			queryBuilding = {
				buildingNumber: buildingNumber
			}
		}
		// Search the building
		Building.find(queryBuilding, function(err, buildings) {
			if (err) {
				throw err;
			}

			if (buildings.length != 0) {
				console.log(buildings);
				// res.send(JSON.stringify(buildings));
				res.send(buildings);
				mongoose.connection.close();
				console.log("Close Connection");

			} else {
				console.log("This building is not in database");
				res.send([]);
				mongoose.connection.close();
				console.log("Close Connection");
			}
		});
	});
});

app.get('/deleteBuilding', function(req, res) {

	mongoose.connect("mongodb://localhost:27017/" + database, function(err, db) {
		if (err) {
			throw err;
		}

		var buildingNumber = req.query.buildingNumber;
		var streetName = req.query.streetName;
		var buildingName = req.query.buildingName;

		console.log(buildingNumber);
		console.log(streetName);
		console.log(buildingName);

		var queryBuilding = {
			buildingNumber: buildingNumber,
			streetName: streetName,
			buildingName: buildingName
		}

		Building.remove(queryBuilding, function(err, building) {
			if (err) {
				throw err;
			}
			console.log("The Building is Delete From Database");
			res.send("Removed");
			mongoose.connection.close();
			console.log("Close Connection");
		});
	});
});

app.get('/updateBuilding', function(req, res) {

	mongoose.connect("mongodb://localhost:27017/" + database, function(err, db) {
		if (err) {
			throw err;
		}

		var buildingNumber = req.query.buildingNumber;
		var streetName = req.query.streetName;
		var buildingName = req.query.buildingName;
		var comment = req.query.comment;

		console.log(buildingNumber);
		console.log(streetName);
		console.log(buildingName);
		console.log(comment);

		var queryBuilding = {
			buildingNumber: buildingNumber,
			streetName: streetName,
			buildingName: buildingName
		}

		Building.findOne(queryBuilding, function(err, building) {
			if (err) {
				throw err;
			}
			building.comment = comment;
			building.save(function(err) {
				if (err) {
					throw err;
				}
				console.log("Update Complete");
				res.send("Updated");
				mongoose.connection.close();
				console.log("Close Connection");
			});
		});
	});
});


app.get('/searchRoom', function(req, res) {

	mongoose.connect("mongodb://localhost:27017/" + database, function(err, db) {
		if (err) {
			throw err;
		}

		var buildingNumber = req.query.buildingNumber;
		var streetName = req.query.streetName;
		var buildingName = req.query.buildingName;

		var queryBuilding = {
			buildingNumber: buildingNumber,
			streetName: streetName,
			buildingName: buildingName
		}

		Building.findOne(queryBuilding, function(err, building) {
			if (err) {
				throw err;
			}
			console.log("Found The Building");
			res.send(building.rooms);
			mongoose.connection.close();
			console.log("Close Connection");
		});
	});
});

app.get('/addRoom', function(req, res) {

	mongoose.connect("mongodb://localhost:27017/" + database, function(err, db) {
		if (err) {
			throw err;
		}

		var buildingNumber = req.query.buildingNumber;
		var streetName = req.query.streetName;
		var buildingName = req.query.buildingName;

		var queryBuilding = {
			buildingNumber: buildingNumber,
			streetName: streetName,
			buildingName: buildingName
		}

		Building.findOne(queryBuilding, function(err, building) {
			if (err) {
				throw err;
			}
			var newRoom = {
				roomNumber: req.query.roomNumber,
				check: req.query.check,
				comment: req.query.comment
			}
			var theRoomExisted = false;
			var rooms = building.rooms;
			rooms.forEach(function(room) {
				if (room.roomNumber == newRoom.roomNumber) {
					console.log("This Room Already Existed");
					theRoomExisted = true;
					res.send("Existed");
					mongoose.connection.close();
					console.log("Close Connection");
				}
			})
			if (!theRoomExisted) {
				building.rooms.push(newRoom);
				building.save(function(err) {
					if (err) {
						throw err;
					}
					console.log("Add New Room");
					res.send("Saved");
					mongoose.connection.close();
					console.log("Close Connection");
				});
			}
		});
	});
})


app.get('/deleteRoom', function(req, res) {

	mongoose.connect("mongodb://localhost:27017/" + database, function(err, db) {
		if (err) {
			throw err;
		}

		var buildingNumber = req.query.buildingNumber;
		var streetName = req.query.streetName;
		var buildingName = req.query.buildingName;
		var roomNumber = req.query.roomNumber;

		var queryBuilding = {
			buildingNumber: buildingNumber,
			streetName: streetName,
			buildingName: buildingName
		}

		Building.findOne(queryBuilding, function(err, building) {
			if (err) {
				throw err;
			}
			var rooms = building.rooms;
			rooms.forEach(function(room) {
				if (room.roomNumber == roomNumber) {
					rooms.remove(room);
					building.save(function(err) {
						if (err) {
							throw err;
						}
						console.log("Delete A Room");
						res.send("Removed");
						mongoose.connection.close();
						console.log("Close Connection");
					});
				}
			});
		});
	});	
});



app.get('/updateRoom', function(req, res) {

	mongoose.connect("mongodb://localhost:27017/" + database, function(err, db) {
		if (err) {
			throw err;
		}

		var buildingNumber = req.query.buildingNumber;
		var streetName = req.query.streetName;
		var buildingName = req.query.buildingName;
		var roomNumber = req.query.roomNumber;
		var check = req.query.check;
		var comment = req.query.comment;

		var queryBuilding = {
			buildingNumber: buildingNumber,
			streetName: streetName,
			buildingName: buildingName
		}

		Building.findOne(queryBuilding, function(err, building) {
			if (err) {
				throw err;
			}
			var rooms = building.rooms;
			rooms.forEach(function(room) {
				if (room.roomNumber == roomNumber) {
					room.check = check;
					room.comment = comment;
					building.save(function(err) {
						if (err) {
							throw err;
						}
						console.log("Update A Room");
						res.send("Updated");
					});
				}
			});
		});
	});
});


function deleteDatabase() {
	mongoose.connect("mongodb://localhost:27017/" + database, function (err, db) {
		if (err) {throw err;}
		db.dropDatabase();
		console.log("Delete Database");
		// process.exit();
	})
}

// deleteDatabase();