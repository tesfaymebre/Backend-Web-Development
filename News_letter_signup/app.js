const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/c0afb22fb4";
  const options = {
    method: "POST",
    auth: "Tesfa:a6d33d54d85b776023386e72abe563a2c-us21",
  };

  const request = https.request(url, options, function (response) {
    let responseBody = "";

    response.on("data", function (chunk) {
      responseBody += chunk;
    });

    response.on("end", function () {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
       res.sendFile(__dirname + "/failure.html");
      }
    });
  });


  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});
