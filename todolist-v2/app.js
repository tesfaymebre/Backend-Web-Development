//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item",itemsSchema);

const todo1 = new Item({name: "Grocery shopping for the week"});
const todo2 = new Item({name: "Pay the monthly bills"});
const todo3 = new Item({name: "Clean the house and do laundry"});

const defaultTodos = [todo1,todo2,todo3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List",listSchema);


app.get("/", async function(req, res) {
    try {
        const items = await Item.find();

        if (items.length === 0){
          Item.insertMany(defaultTodos)
              .then(function(docs) {
                  console.log("Default todos inserted successfully:", docs);
              })
              .catch(function(err) {
                  console.error("Error inserting default todos:", err);
              });

          res.redirect('/');
        }else{
          console.log("successfuly get all items: ", items);
          res.render("list", {listTitle: "Today", newListItems: items});
        }

    } catch (err) {
        console.log(err);
    }
});

app.get("/:customListName",async function(req,res){
  const customListName = _.capitalize(req.params.customListName);

  try{
    const listItem = await List.findOne({name: customListName});

  if (!listItem){
    const list = new List({name:customListName,items: defaultTodos})
    list.save();

    res.redirect("/"+customListName);
  } else{
    res.render("list", {listTitle: customListName, newListItems: listItem.items});
  }
  } catch(err){
    console.log(err);
  }
});

app.post("/", async function(req, res){
  const listName = req.body.list;
  const itemName = req.body.newItem;

  const item = new Item({name: itemName});

   if (listName === "Today")  {
    item.save()
              .then(function(docs) {
                  console.log("new item inserted successfully:", docs);
              })
              .catch(function(err) {
                  console.error("Error inserting item:", err);
              });
    res.redirect("/");
}else{
  const foundList = await List.findOne({name: listName});

  if (!foundList){
    const list = new List({
      name: listName,
      items: [item]
    });

    list.save().then(function(docs){
      console.log("new custom item inserted successfully:",docs);
    }).catch(function(err){
      console.error("Error inserting custom item:",err);
    });

    res.redirect("/"+listName);
  } else {
    foundList.items.push(item);

    foundList.save().then(function(docs){
      console.log("new custom item inserted successfully:",docs);
    }).catch(function(err){
      console.error("Error inserting custom item:",err);
    });

    res.redirect("/"+listName);
  }
  }
});

app.post("/delete",async function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){
    try {
      const result = await Item.findByIdAndRemove(checkedItemId);
  
      if (result.deletedCount === 1) {
        console.log('Document deleted successfully.');
      } else {
        console.log('Document not found or already deleted.');
      }
    } catch (err) {
      console.error('Error:', err);
    }
      res.redirect("/");
  }else{
    const filter = { name: listName};
    const update = {$pull: {items:{_id:checkedItemId}} };
    try{
      const result = await List.findOneAndUpdate(filter,update,{new: true});
      console.log("Custom Document deleted successfully.");
    }catch(err){
      console.log("Error: ",err);
    }

    res.redirect("/"+listName);
  }

});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
