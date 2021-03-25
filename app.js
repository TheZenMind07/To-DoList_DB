const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// let listItems = ["Meditation", "Cooking", "Exercising"];
// let workItems = [];

//Mongoose implementation
// mongoose.connect("mongodb://localhost:27017/todolistDB", {
mongoose.connect("mongodb+srv://rk-mongo:Rajkp@cluster0.vbjj1.mongodb.net/todoList", {
    // urlencoded: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const itemSchema = {
    item: {
        type: String,
        required: [true, "Please enter the item name"]
    }
};

const listSchema = {
    name: String,
    items: [itemSchema]
};

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);
const item1 = new Item({
    item: "It is a item one of the day"
});

const item2 = new Item({
    item: "It is a item two of the day"
});

const item3 = new Item({
    item: "It is a item three of the day"
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
    // let day = date.getDay();
    Item.find({}, function (err, listResult) {
        if (listResult.length == 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Default items are added");
                }
            });
            res.redirect("/");
        } else {
            if (err) {
                console.log(err);
            } else {
                res.render("list", { listTitle: "Today", listItems: listResult });
            }
        }
    });
});

app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work", listItems: workItems });
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/:title", function (req, res) {
    const custTitle = _.capitalize(req.params.title);
    List.findOne({ name: custTitle }, function (err, foundList) {
        if (err) {
            console.log(err);
        } else {
            if (!foundList) {
                const list = new List({
                    name: custTitle,
                    items: defaultItems
                });
                list.save();
                res.render("list", { listTitle: custTitle, listItems: foundList.items });
            } else {
                res.render("list", { listTitle: custTitle, listItems: foundList.items });
            }
        }
    });
});

app.post("/", function (req, res) {
    // if (req.body.button === "Work") {
    //     workItems.push(req.body.newItem);
    //     res.redirect("/work");
    // } else {
    //     listItems.push(req.body.newItem);
    //     res.redirect("/");
    // }
    const newItem = new Item({
        item: req.body.newItem
    });

    const listTitle = req.body.button;
    if (listTitle === "Today") {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listTitle }, function (err, foundList) {
            if (err) {
                console.log(err);
            } else {
                if (foundList) {
                    foundList.items.push(newItem);
                    foundList.save();
                }
            }
        });
        res.redirect("/" + listTitle);
    }
});

app.post("/delete", function (req, res) {
    const listTitle = req.body.listTitle;
    const itemsId = req.body.checkbox;
    if (listTitle === "Today") {
        Item.deleteOne({ _id: itemsId }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Sucessfully deleted");
            }
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({ name: listTitle }, { $pull: { items: { _id: itemsId } } }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listTitle);
            }
        });
    }
});

app.listen(3000, function () {
    console.log("Server 3000 is up and running");
});
