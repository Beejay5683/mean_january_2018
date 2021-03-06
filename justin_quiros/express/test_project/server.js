// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
// create the express app
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose')

var UserSchema = new mongoose.Schema({
 first_name: {type: String, required: true, minlength: 2},
 last_name: {type: String, required: true, minlength: 2},
 age: {type: Number, min: 1, max: 100}, 
 email: {type: String, required: true}
 },
 {timestamps: true}); 
mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'

// Use native promises
mongoose.Promise = global.Promise;


app.use(session({
	secret: 'secretpassword',
	proxy: true,
	resave: false,
	saveUninitialized: true
}));



// use it!
app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');




// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})

app.post('/users', function(req, res) {
	console.log("POST DATA", req.body);
	// This is where we would add the user from req.body to the database.
	var user = new User({name: req.body.name, age: req.body.age});
	user.save(function(err){
 		if(err){
 			console.log('something went wrong');
 		} else{
 			console.log('successfully added a user!');
 			res.redirect('/');
 		}
	})
})


// post route for adding a user
app.post('/submit', function(req, res) {
 console.log("POST DATA", req.body);
 session.form_data = req.body;
 res.redirect("result");
})





app.get('/result', function(req, res) {
	context = {
		'name': session.form_data.name,
		'location': session.form_data.location,
		'language': session.form_data.language,
		'comment': session.form_data.comment
	}
 res.render("result", context);
})





// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  console.log("Client/socket is connected!");
  console.log("Client/socket id is: ", socket.id);
  // all the server socket code goes in here
})
