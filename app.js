var express = require("express");
var app = express();

// this is line makes the whole ejs process work
app.set("view engine", "ejs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// in order to use a module we create we need to give it´s path
var date = require(__dirname + "/date.js");

var tasks = ["Buy Food", "Cook the Food", "Eat Food"];
var workTasks = [];

// 1 param= location, 2 param callback  function (request and respond)
// do sth with the request/response in the callback function
app.get("/", function(req, res) {
	let day = date.getDate();

	// send the value to the ejs file so it can be displayed.
	// params *name of the ejs file, js object with a key and the value *
	res.render("list", { listTitle: day, newTask: tasks });
	//res.sendFile(__dirname + "/index.html");
});

app.get("/about", function(req, res) {
	res.render("about");
});

app.get("/work", function(req, res) {
	res.render("list", { listTitle: "Work List", newTask: workTasks });
});

app.post("/", function(req, res) {
	let task = req.body.newTask;
	//console.log(req.body);
	if (req.body.list === "Work") {
		workTasks.push(task);
		res.redirect("/work");
	} else {
		tasks.push(task);
		res.redirect("/");
	}
});

app.post("/work", function(req, res) {
	let task = req.body.newTask;
	workTasks.push(task);
	res.redirect("/work");
});

app.listen(3000, function() {
	console.log("Example app listening on port 3000!");
});
