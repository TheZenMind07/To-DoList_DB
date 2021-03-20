const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let listItems = ["Meditation", "Cooking", "Exercising"];
let workItems = [];

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    let day = date.getDay();

    res.render("list", { listTitle: day, listItems: listItems });
});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work", listItems: workItems });
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.post("/", function (req, res) {
    if (req.body.button === "Work") {
        workItems.push(req.body.newItem);
        res.redirect("/work");
    } else {
        listItems.push(req.body.newItem);
        res.redirect("/");
    }
});

app.listen(3000, function () {
    console.log("Server 3000 is up and running");
});
