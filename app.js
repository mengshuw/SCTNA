const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

const port = 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Font
app.get('/NationalWeb-Regular_woff', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/vendor/font-usc/NationalWeb-Regular.woff'));
});

app.get('/NationalWeb-Bold_woff', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/vendor/font-usc/NationalWeb-Bold.woff'));
});

app.get('/NationalWeb-Regular_ttf', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/vendor/font-usc/NationalWeb-Regular.ttf'));
});

app.get('/NationalWeb-Bold_ttf', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/vendor/font-usc/NationalWeb-Bold.ttf'));
});

// Tabs
app.get('/', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/home.html'));
});

app.get('/donate', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/donate.html'));
});

app.use('/node_modules/angular-ui-bootstrap', express.static('/home/ubuntu/sctna/node_modules/angular-ui-bootstrap'));

app.get('/about_us', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/aboutus.html'));
});

app.get('/header', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/header.html'));
});

app.get('/footer', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/footer.html'));
});

app.get('/impact_area', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/impactarea.html'));
});

app.get('/impact_area_manage', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/impactarea_manage.html'));
});

app.get('/live_chat', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/live_chat.html'));
});

app.get('/contact_us', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/contactus.html'));
});

app.get('/join_us', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/joinus.html'));
});

app.get('/get_involved', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/getinvolved.html'));
});

app.get('/get_help', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/gethelp.html'));
});

app.get('/organization', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/templates/organization.html'));
});

// GeoJSON
app.get('/upcGeoLoad', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/database/geoDataUPC.json'));
});

app.get('/hscGeoLoad', function(req, res) {
	res.sendFile(path.join('/home/ubuntu/sctna/database/geoDataHSC.json'));
});

app.post('/upcGeoWrite', function(req, res) {
	fs.writeFile('/home/ubuntu/sctna/database/geoDataUPC.json', JSON.stringify(req.body), 'utf-8', callback);
	function callback(err) {
		if (err === null) {
			reply = {"msg" : "Saved"}
		} else {
			reply = {"msg" : err}
		}
		res.send(reply);
	}
});

app.post('/hscGeoWrite', function(req, res) {
	fs.writeFile('/home/ubuntu/sctna/database/geoDataHSC.json', JSON.stringify(req.body), 'utf-8', callback);
	function callback(err) {
		if (err === null) {
			reply = {"msg" : "Saved"}
		} else {
			reply = {"msg" : err}
		}
		res.send(reply);
	}
});

app.use('/templates', express.static('/home/ubuntu/sctna/templates'));
app.use('/css', express.static('/home/ubuntu/sctna/css'));
app.use('/js', express.static('/home/ubuntu/sctna/js'));
app.use('/img', express.static('/home/ubuntu/sctna/img'));

app.listen(port, function(){
	console.log('Listen port ' + port);
})
