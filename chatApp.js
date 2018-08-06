const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const client = require('socket.io').listen(8082).sockets;

const database = "chat"

var messageSchema = mongoose.Schema({
	name: String,
	text: String
})
var Message = mongoose.model("Message", messageSchema);

mongoose.connect("mongodb://localhost:27017/" + database, function(err, db) {
	if (err) {
		throw err;
	} else {
		console.log("Connect to database");
	}

	client.on('connection', function(socket) {

		function sendStatus(s) {
			socket.emit('status', s);
		}

		// Emit all messages
		// Message.find().limit(100).sort({'_id' : 1}).exec(function(err, messages) {
		// 	if (err) {
		// 		throw err;
		// 	}
		// 	socket.emit('output', messages);
		// })

		socket.on('getAllMessages', function(data) {
			Message.find().limit(100).sort({'_id' : 1}).exec(function(err, messages) {
				if (err) {
					throw err;
				}
				socket.emit('output', messages);
			})
		});



		// Wait for input
		socket.on('input', function(data) {
			var name = data.name;
			var text = data.text;

			if (name == "" || text == "") {
				sendStatus("Status : Name and Text Are Required !");
				return;
			}

			var newMessage = Message({
				name: name,
				text: text
			});

			newMessage.save(function(err) {
				if (err) {
					throw err;
				}
				client.emit('output', [data]); 
				sendStatus({
					message: "Status : Message Sent",
					clear: true
				});
				console.log("New Message Saved");
			});
		});
	});
});

