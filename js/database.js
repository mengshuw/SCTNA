var buildingList = [];
var roomList = [];
var queryBuilding = {};

var BuildingHeader = React.createClass({

	getInitialState: function() {
		return {
			editing: false
		}
	},

	searchBuilding: function() {

		if (isNaN($('#buildingNumber').val())) {
			alert("Invalid Room Number Input, Please Input A Number");
			return;
		}
		
		var buildingNumber = $('#buildingNumber').val();
		var streetName = $('#streetName').val();

		var query = {
			buildingNumber: buildingNumber,
			streetName: streetName
		}

		$.ajax({
			type: 'GET',
			data: query,
			url: 'searchBuilding',
			success: function (res) {
				if (res == "Connection Error") {
					alert("Unable To Connect Database");
					return;
				}
				if(res.length == 0) {
					alert("No Result");
					return;
				} else {
					buildingList = [];
					for (var i = 0; i < res.length; i++) {
						var obj = {
							buildingNumber: res[i].buildingNumber,
							streetName: res[i].streetName,
							fullAddress: res[i].fullAddress,
							buildingName: res[i].buildingName,
							date: res[i].date,
							comment: res[i].comment
						}
						buildingList.push(obj);
					}
				}
				renderBuildingPage();
			},
			error: function (err) {
			}
		});
	},

	addNewBuilding: function() {
		this.setState({
			editing: true
		});
	},

	back: function() {
		this.setState({
			editing: false
		});
	},

	// To Database
	saveNewBuilding: function() {

		if (isNaN($('#buildingNumber').val())) {
			alert("Invalid Building Number Input, Please Input A Number");
			return;
		}

		this.setState({
			editing: false
		});

		var buildingNumber = $('#buildingNumber').val();
		var streetName = $('#streetName').val();
		var buildingName = $('#buildingName').val();
		var comment = $('#comment').val();
		var d = $('#d').val();
		var st = $('#st').val();
		var fullAddress = buildingNumber.concat(" ", d, " ", streetName, " ", st, ", ", buildingName);
		var date = getDate();

		var query = {
			buildingNumber: buildingNumber,
			streetName: streetName,
			fullAddress: fullAddress,
			buildingName: buildingName,
			comment: comment,
			date: date
		}

		$.ajax({
			type: 'GET',
			data: query,
			url: 'addBuilding',
			success: function (res) {
				if (res == "Connection Error") {
					alert("Unable To Connect Database");
					return;
				}
				if (res == "Saved") {
					// alert("New Building Saved !");
					buildingList.push(query);
				} else if (res == "Existed") {
					alert("This building is already in the database !")
				}
				renderBuildingPage();
			},
			error: function (err) {
			}
		});
	},

	renderNormal: function() {
		return (
			<div className = "set-spacing">
				<div className = "panel panel-default" >
					<div className = "panel-heading">
						<strong>Search Buildings</strong>
					</div>
					<div className = "panel-body">
						<div className="row" style = {{paddingBottom : "15px"}}>
							<div className="col-sm-6">
								<label>Building Number :</label>
								<input id="buildingNumber" type="text" className="form-control"></input>
							</div>
							<div className="col-sm-6">
								<label>Street Name :</label>
								<input id="streetName" type="text" className="form-control"></input>
							</div>
						</div>
						<div style = {{float : "right"}}>
							<button onClick = {this.searchBuilding} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Search Buildings</button>
							<button onClick = {this.addNewBuilding} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Add New Building</button>
						</div>
					</div>
				</div>
			</div>
		);
	},

	renderAddBuilding: function() {
		return (
			<div className = "set-spacing">
				<div className = "panel panel-default" >
					<div className = "panel-heading">
						<div style = {{width : "100%", display : "inline-block"}}>
							<strong>Add New Building</strong>
						</div>
					</div>
					<div className = "panel-body">
						<div className="row" style = {{paddingBottom : "15px"}}>
							<div className="col-sm-6">
								<label>Building Number :</label>
								<input id="buildingNumber" type="text" className="form-control"></input>
							</div>
							<div className="col-sm-6">
								<label>E / S / W / N :</label>
								<input id="d" type="text" className="form-control"></input>
							</div>
						</div>
						<div className="row" style = {{paddingBottom : "15px"}}>
							<div className="col-sm-6">
								<label>Streen Name :</label>
								<input id="streetName" type="text" className="form-control"></input>
							</div>
							<div className="col-sm-6">
								<label>St / Blvd / Ave / Pl :</label>
								<input id="st" type="text" className="form-control"></input>
							</div>
						</div>
						<div className="row" style = {{paddingBottom : "15px"}}>
							<div className="col-sm-12">
								<label>Building / House Name :</label>
								<input id="buildingName" type="text" className="form-control"></input>
							</div>
						</div>
						<div className="row" style = {{paddingBottom : "15px"}}>
							<div className="col-sm-12">
								<label>Comment :</label>
								<textarea id="comment" type="text" className="form-control"></textarea>
							</div>
						</div>
						<div style = {{float : "right"}}>
							<button onClick = {this.back} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Back</button>
							<button onClick = {this.saveNewBuilding} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Save</button>
						</div>
					</div>
				</div>
			</div>
		);
	},

	render: function() {
		if (this.state.editing) {
			return this.renderAddBuilding();
		} else {
			return this.renderNormal();
		}
	}
});


var BuildingList = React.createClass({

	getInitialState: function() {
		return {
			editing: false
		}
	},

	updateBuilding: function() {
		this.setState({
			editing: true
		});
	},

	saveUpdate: function() {
		var val = $('#textarea').val();
		this.props.updateList(val, this.props.index);
		this.setState({
			editing: false
		});
	},

	deleteBuilding: function() {
		if (window.confirm('Are you sure you wish to delete this builing?')) {
			this.props.deleteList(this.props.index);
		}		
	},

	// Search Rooms
	seeDetails: function() {
		this.props.seeDetails(this.props.index);
	},

	back: function() {
		this.setState({
			editing: false
		});
	},

	renderUpdate: function() {
		return (
			<div className = "set-spacing">
				<div className = "panel panel-default" >
					<div className = "panel-heading">
						<strong>Update Building Information</strong>
					</div>
					<div className = "panel-body">
						<div style = {{paddingBottom : "15px"}}>
							<label>Comment :</label>
							<textarea id="textarea" type="text" className="form-control" defaultValue = {this.props.comment}></textarea>
						</div>
						<div style = {{float : "right"}}>
							<button onClick = {this.back} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Back</button>
							<button onClick = {this.saveUpdate} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Save</button>
						</div>
					</div>
				</div>
			</div>
		);
	},

	renderNormal: function() {
		return (
			<div className = "set-spacing">
				<div className = "panel panel-default" >
					<div className = "panel-heading">
						<strong>{this.props.fullAddress}</strong>
					</div>
					<div className = "panel-body">
						<p><strong>Date : </strong>{this.props.date}</p>
						<p style = {{wordWrap : "break-word"}}><strong>Comment : </strong>{this.props.comment}</p>
						<div style = {{float : "right"}}>
							<button onClick = {this.deleteBuilding} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Delete</button>
							<button onClick = {this.updateBuilding} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Update</button>
							<button onClick = {this.seeDetails} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Details</button>
						</div>
					</div>
				</div>
			</div>
		);
	},

	render: function() {
		if (this.state.editing) {
			return this.renderUpdate();
		} else {
			return this.renderNormal();
		}
	}
});


var BuildingListBoard = React.createClass({

	getInitialState: function() {
		return {
			buildingList : buildingList
		}
	},

	// Delete From Database
	deleteList: function(index) {
		var query = {
			buildingNumber: buildingList[index].buildingNumber,
			streetName: buildingList[index].streetName,
			buildingName: buildingList[index].buildingName
		}

		$.ajax({
			type: 'GET',
			data: query,
			url: 'deleteBuilding',
			success: function (res) {
				if (res == "Removed") {
					// alert("The Building is Delete From Database");
					buildingList.splice(index, 1);
					renderBuildingPage();
				}
			},
			error: function (err) {
			}
		});
	},

	// Update Database
	updateList: function(newComment, index) {

		var query = {
			buildingNumber: buildingList[index].buildingNumber,
			streetName: buildingList[index].streetName,
			buildingName: buildingList[index].buildingName,
			comment: newComment
		}

		$.ajax({
			type: 'GET',
			data: query,
			url: 'updateBuilding',
			success: function (res) {
				if (res == "Updated") {
					// alert("Update Building Information");
					buildingList[index].comment = newComment;
					renderBuildingPage();
				}
			},
			error: function (err) {
			}
		});
	},

	// See Details !!!
	seeDetails: function(index) {

		roomList = [];

		queryBuilding = {
			buildingNumber: buildingList[index].buildingNumber,
			streetName: buildingList[index].streetName,
			buildingName: buildingList[index].buildingName,
			fullAddress: buildingList[index].fullAddress
		}

		$.ajax({
			type: 'GET',
			data: queryBuilding,
			url: 'searchRoom',
			success: function (res) {
				if(res.length == 0) {
					// alert("No Room Information In This Building");
				} else {
					for (var i = 0; i < res.length; i++) {
						var obj = {
							roomNumber: res[i].roomNumber,
							check: res[i].check,
							comment: res[i].comment
						}
						roomList.push(obj);
					}
				}
				renderRoomPage();
			},
			error: function (err) {
			}
		});

	},

	eachList: function(building, index) {
		return (
			<BuildingList 
				key = {index} 
				index = {index} 
				fullAddress = {building.fullAddress} 
				date = {building.date}
				comment = {building.comment} 
				deleteList = {this.deleteList}
				updateList = {this.updateList}
				seeDetails = {this.seeDetails}
			/>
		);
	},

	render: function() {
		return (
			<div>
				{this.state.buildingList.map(this.eachList)}
			</div>
		);
	}
});


var RoomHeader = React.createClass({

	getInitialState: function() {
		return {
			editing: false,
			check: false
		}
	},

	backToBuildingList: function() {
		renderBuildingPage();
	},

	backToRoomHeader() {
		this.setState({
			editing: false
		});
	},

	addNewRoom: function() {
		this.setState({
			editing: true,
			check: false
		});
	},

	checkYes: function() {
		this.setState({
			check: true
		});
	},

	checkNo: function() {
		this.setState({
			check: false
		});
	},

	saveNewRoom: function() {

		if (isNaN($('#roomNumber').val())) {
			alert("Invalid Room Number Input, Please Input A Number");
			return;
		}

		this.setState({
			editing: false
		});

		var roomNumber = $('#roomNumber').val();
		var check = this.state.check;
		var comment = $('#comment').val();

		var query = {
			buildingNumber: queryBuilding.buildingNumber,
			streetName: queryBuilding.streetName,
			buildingName: queryBuilding.buildingName,
			roomNumber: roomNumber,
			check: check,
			comment: comment
		}

		$.ajax({
			type: 'GET',
			data: query,
			url: 'addRoom',
			success: function (res) {
				if (res == "Saved") {
					// alert("New Room Saved !");
					var newRoom = {
						roomNumber: query.roomNumber,
						check: query.check,
						comment: query.comment
					}
					roomList.push(newRoom);
				} else if (res == "Existed") {
					alert("This room is already in the building !")
				}
				renderRoomPage();
			},
			error: function (err) {
			}
		});
	},

	renderAddRoom: function() {

		return (
			<div className = "set-spacing">
				<div className = "panel panel-default" >
					<div className = "panel-heading">
						<strong>Add A New Room</strong>
					</div>
					<div className = "panel-body">
						<div className="row" style = {{paddingBottom : "15px"}}>
							<div className="col-sm-6">
								<label>Room Number :</label>
								<input id="roomNumber" type="text" className="form-control"></input>
							</div>
							<div className="col-sm-6">
								<label>Talk ?</label>
								<div>
									<label class="radio-inline"><input onClick = {this.checkYes} type="radio" name="optradio"></input>Yes</label>
									<label class="radio-inline" style = {{marginLeft : "20px"}}><input onClick = {this.checkNo} type="radio" name="optradio"></input>No</label>
								</div>
							</div>
						</div>
						<div className="row" style = {{paddingBottom : "15px"}}>
							<div className="col-sm-12">
								<label>Comment :</label>
								<textarea id="comment" type="text" className="form-control"></textarea>
							</div>
						</div>
						<div style = {{float : "right"}}>
							<button onClick = {this.backToRoomHeader} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Back</button>
							<button onClick = {this.saveNewRoom} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Save</button>
						</div>
					</div>
				</div>
			</div>
		);
	},

	renderNormal: function() {
		return (
			<div className = "set-spacing">
				<div className = "panel panel-default" >
					<div className = "panel-heading">
						<strong>{queryBuilding.fullAddress}</strong>
					</div>
					<div className = "panel-body">
						<div style = {{float : "right"}}>
							<button onClick = {this.backToBuildingList} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Back</button>
							<button onClick = {this.addNewRoom} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Add New Room</button>
						</div>
					</div>
				</div>
			</div>
		);
	},

	render: function() {
		if (this.state.editing) {
			return this.renderAddRoom();
		} else {
			return this.renderNormal();
		}
	}
});



var RoomList = React.createClass({

	getInitialState: function() {
		return {
			editing: false,
			check: this.props.check
		}
	},

	updateRoom: function() {
		this.setState({
			editing: true
		});
	},

	saveUpdate: function() {
		var check = this.state.check;
		var comment = $('#textarea').val();
		this.props.updateList(check, comment, this.props.index);
		this.setState({
			editing: false
		});
	},

	deleteRoom: function() {
		if (window.confirm('Are you sure you wish to delete this room?')) {
			this.props.deleteList(this.props.index);
		}
	},

	back: function() {
		this.setState({
			editing: false
		});
	},

	checkYes: function() {
		this.setState({
			check: true
		});
	},

	checkNo: function() {
		this.setState({
			check: false
		});
	},

	renderUpdate: function() {
		return (
			<div className = "set-spacing">
				<div className = "panel panel-default" >
					<div className = "panel-heading">
						<strong>Update Room Information</strong>
					</div>
					<div className = "panel-body">
						<label>Talk ? </label>
						<label class="radio-inline" style = {{marginLeft : "20px"}}><input onClick = {this.checkYes} type="radio" name="optradio"></input>Yes</label>
						<label class="radio-inline" style = {{marginLeft : "20px"}}><input onClick = {this.checkNo} type="radio" name="optradio"></input>No</label>
						<div style = {{paddingBottom : "15px"}}>
							<label>Comment :</label>
							<textarea id="textarea" type="text" className="form-control" defaultValue = {this.props.comment}></textarea>
						</div>
						<div style = {{float : "right"}}>
							<button onClick = {this.back} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Back</button>
							<button onClick = {this.saveUpdate} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Save</button>
						</div>
					</div>
				</div>
			</div>
		);
	},

	renderNormal: function() {
		return (
			<div className = "set-spacing">
				<div className = "panel panel-default" >
					<div className = "panel-heading">
						<strong># {this.props.roomNumber}</strong>
					</div>
					<div className = "panel-body">
						<p><strong style = {{marginRight : "20px"}}>Talk ? </strong><strong>{this.state.check ? "Yes" : "No"}</strong></p>
						<p style = {{wordWrap : "break-word"}}><strong>Comment : </strong>{this.props.comment}</p>
						<div style = {{float : "right"}}>
							<button onClick = {this.deleteRoom} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Delete</button>
							<button onClick = {this.updateRoom} type="button" className = "btn btn-red" style = {{marginLeft : "5px"}}>Update</button>
						</div>
					</div>
				</div>
			</div>
		);
	},

	render: function() {
		if (this.state.editing) {
			return this.renderUpdate();
		} else {
			return this.renderNormal();
		}
	}


});


var RoomListBoard = React.createClass({

	getInitialState: function() {
		return {
			roomList: roomList
		}
	},

	// Delete From Database
	deleteList: function(index) {

		var query = {
			buildingNumber: queryBuilding.buildingNumber,
			streetName: queryBuilding.streetName,
			buildingName: queryBuilding.buildingName,
			roomNumber: roomList[index].roomNumber
		}

		$.ajax({
			type: 'GET',
			data: query,
			url: 'deleteRoom',
			success: function (res) {
				if (res == "Removed") {
					// alert("The Room is Delete From The Building");
					roomList.splice(index, 1);
					renderRoomPage();
				}
			},
			error: function (err) {
			}
		});
	},

	// Update Database !!!
	updateList: function(check, newComment, index) {

		var query = {
			buildingNumber: queryBuilding.buildingNumber,
			streetName: queryBuilding.streetName,
			buildingName: queryBuilding.buildingName,
			roomNumber: roomList[index].roomNumber,
			check: check,
			comment: newComment
		}

		$.ajax({
			type: 'GET',
			data: query,
			url: 'updateRoom',
			success: function (res) {
				if (res == "Updated") {
					// alert("Update Room Information");
					roomList[index].check = check;
					roomList[index].comment = newComment;
					renderRoomPage();
				}
			},
			error: function (err) {
			}
		});
	},

	eachList: function(room, index) {
		return (
			<RoomList 
				key = {index} 
				index = {index} 
				deleteList = {this.deleteList}
				updateList = {this.updateList}
				roomNumber = {room.roomNumber}
				check = {room.check}
				comment = {room.comment}
			/>
		);
	},

	render: function() {
		return (
			<div>
				{this.state.roomList.map(this.eachList)}
			</div>
		);
	}
});

var Empty = React.createClass({
	render: function() {
		return null;
	}
});


function getDate() {

	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();

	if(dd < 10) {
		dd = '0' + dd
	} 

	if( mm < 10) {
		mm = '0' + mm
	} 

	today = mm + '/' + dd + '/' + yyyy;
	return today;
}

function refreshPage() {
	ReactDOM.render(<Empty />, document.getElementById('listHeader'));
	ReactDOM.render(<Empty />, document.getElementById('listBody'));
}

function renderBuildingPage() {
	refreshPage();
	ReactDOM.render(<BuildingHeader />, document.getElementById('listHeader'));
	ReactDOM.render(<BuildingListBoard />, document.getElementById('listBody'));
}

function renderRoomPage() {
	refreshPage();
	ReactDOM.render(<RoomHeader />, document.getElementById('listHeader'));
	ReactDOM.render(<RoomListBoard />, document.getElementById('listBody'));
}

renderBuildingPage();


