const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

let tasks = [];
let workTasks = [];

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/",function(req,res){
    let today = date.getDate();
    
    res.render('list',{listTitle: today,tasks: tasks});
    
    
});

app.post("/",function(req,res){
    var task = req.body.newTask;

    if (req.body.list === "Work"){
        workTasks.push(task);
        res.redirect('/work');
    }else{
        tasks.push(task);
        res.redirect('/');
    }
});

app.get("/work",function(req,res){
    res.render('list',{listTitle: "Work List",tasks: workTasks});
});

app.listen(3000,function(){
    console.log("Server started on port 3000");
});