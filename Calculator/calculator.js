const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));


app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post('/',function(req,res){
    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    var answer = num1 + num2;

    res.send("The total sum is equal to " + answer);
});

app.get('/bmicalculator',function(req,res){
    res.sendFile(__dirname + '/bmiCalculator.html');
});

app.post('/bmicalculator',function(req,res){
    var weight = parseFloat(req.body.weight);
    var height = parseFloat(req.body.height);
    var bmi = weight / (height * height);
    // console.log('here');
    res.send("Your BMI is " + bmi);
});

app.listen(3000,function(){
    console.log("Server is running on port 3000.");
});