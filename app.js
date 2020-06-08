var express = require("express");
var app = express();

// this is line makes the whole ejs process work
app.set("view engine", "ejs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


const mongoose = require("mongoose");	

// make the connection to the DB 
mongoose.connect("mongodb://localhost:27017/todolistDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// how we want the data to be structured in the collection
const itemsSchema = {
	name: String,
};


// create the collections -- params: name of the DB, the schema of the DB--
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({name: "Buy Food"});


const item2 = new Item({name: "Cook Food"});
//item2.save();

const item3 = new Item({name: "Eat Food"});
//item3.save();

const tasks = [item1,item2, item3]

// // insert the values in the DB
//  Item.insertMany(tasks, function (err) {
//  	if (err) console.log(err);
//  	else console.log("Data successfully saved into  todolist DB");
//  });

// // executes, passing results to callback
// Item.find( {},function (err, docs) {
// 	if (err) console.log(err);
// 	else console.log(docs)
// });

app.get("/", function(req, res) {
	
	// obtain all the data from the DB
	Item.find( {},function (err, docs) {
		// if the db is empty insert default values (tasks)
		if(docs.length==0)
		{
			// insert the initial values for the todo 
			Item.insertMany(tasks, function (err) {
				if (err) console.log(err);
				else console.log("Data successfully saved into  todolist DB");
			});
		   res.redirect("/");
		}

		else
		{
			res.render("list", { listTitle: "Today", newTask: docs });
		}	
	});


});

app.get("/about", function(req, res) {
	res.render("about");
});


app.get("/work", function(req, res) {
	res.render("list", { listTitle: "Work List", newTask: workTasks });
});

app.post("/", function(req, res) {
	// obtain the item enter by the user
	 const itenName = req.body.newTask;
	 const listItem = new Item({name: itenName});
	 // save the item in the DB
	 listItem.save();
	 res.redirect("/");
	 
	
});

app.post("/delete", function(req,res){

});


app.post("/work", function(req, res) {
	let task = req.body.newTask;
	workTasks.push(task);
	res.redirect("/work");
});

app.listen(3000, function() {
	console.log("Example app listening on port 3000!");
});
