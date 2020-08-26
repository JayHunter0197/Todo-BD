var express = require("express");
var app = express();

/**
 *  ! Without these line ejs won't work
 */
app.set("view engine", "ejs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

/**
 *  ! Without these line our CSS won't work
 */
app.use(express.static("public"));

const mongoose = require("mongoose");	

/**
 *  * Create and make the connection to the DB
 */
mongoose.connect("mongodb://localhost:27017/todolistDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});


/**
 *  * Define the schema of the DB, how we want the data to be structured
 */
const itemsSchema = {
	name: String,
};

const listSchema = {
	name: String,
	items: [itemsSchema]
};

/**
 *  * Create the collection 
 *  @param myParams  Name of the collection in singular (string), the name of the DB schema
 */
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List",listSchema);

/**
 *  * Create the Mongoose Documents 
 *  @param myParam  The schema of the DB (with data)				
 */
const item1 = new Item({name: "Buy Food"});
const item2 = new Item({name: "Cook Food"});
const item3 = new Item({name: "Eat Food"});

const tasks = [item1,item2, item3];


/**
 *  * Initialize the TodoList DB and display the items 				
 */
app.get("/", function(req, res) {
	// Obtain all the data from the DB
	Item.find( {},function (err, docs) {
		// If the db is empty insert default values (tasks)
		if(docs.length==0)
		{
			Item.insertMany(tasks, function (err) {
				if (err) console.log(err);
				else console.log("Data successfully saved into  todolist DB");
			});
		   res.redirect("/");
		}
		// Display the items in the ToDo list
		else
		{
			res.render("list", { listTitle: "Today", newTask: docs });
		}	
	});
});



app.get("/about", function(req, res) {
	res.render("about");
});

/**
 * *Create personalized lists by creating dynamic routes 
 * @params name of the dynamic route, callback function
 */
app.get("/:customListName", function(req,res){
	// Get the name of the list from the url
	const customListName = req.params.customListName;
	
	// Look if a list with the same name already exits
	List.findOne({name: customListName},function(err, foundList){
		if(!err)
		{
			// If a list was not find add it to the DB
			if(!foundList)
			{
				const list = new List({
					name: customListName,
					items: tasks
				});
				list.save();
				res.redirect("/"+customListName);
			}

			else{
				res.render("list", { listTitle: foundList.name, newTask: foundList.items });
			}
		}
	})

});

/**
 * * Add a new item to the ToDo list 
 */
app.post("/", function(req, res) {
	// Obtain the item enter by the user and save it in the schema
	 const itenName = req.body.newTask;
	 const listItem = new Item({name: itenName}); 
	 listItem.save();
	 res.redirect("/");
	 
	
});
/**
 * * Delete an item from the ToDo list 
 */
app.post("/delete", function(req,res){
	
	console.log(req.body.checkbox);
	const checkedItemId = req.body.checkbox; 
	
	Item.findByIdAndRemove(checkedItemId,function(err)
	{
		if(!err)
		{
			console.log("Item successfully deleted from the DB");
			res.redirect("/");
		}
	}); 
});


app.post("/work", function(req, res) {
	let task = req.body.newTask;
	workTasks.push(task);
	res.redirect("/work");
});


/**
 * * Node was runned succesfully
 */
app.listen(3000, function() {
	console.log("Example app listening on port 3000!");
});
