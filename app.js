var express = require("express");
var app = express();

// this is line makes the whole ejs process work
app.set("view engine", "ejs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


var moongose = require("mongoose");

// make the connection to the DB
moongose.connect("mongodb://locashost/27017/todolistDB",{useNewUrlParser: true});

// how we want the data to be structured in the collection
const itemsSchema = new mongoose.Schema({
	name: String,
});


// create the collections params *name of the DB, the schema of the DB*
const Item = mongoose.model("Item", itemsSchema);

// 1 param= location, 2 param callback  function (request and respond)
// do sth with the request/response in the callback function
app.get("/", function(req, res) {
	
	res.render("list", { listTitle: "Today", newTask: tasks });

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
