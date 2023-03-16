const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

mongoose.connect("mongodb+srv://orbarkalifa:test123@cluster0.ddck8ke.mongodb.net/todolistDB").catch(error => console.log(error));


const itemsSchema = { name: { type: String, required: true } };

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({ name: "Welcome to your to-do list." });
const item2 = new Item({ name: "To add an item click the + button." });
const item3 = new Item({ name: "<-- Hit this to delete an item. " });

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {

    const foundItems = await Item.find();

    if (foundItems.length === 0) {
        Item.insertMany(defaultItems).then(res => {
            if (err) {
                console.log("Error loading docs: " + err);
            }
        }).catch(err => {
            console.log("Successfully loaded docs to DB.");
        });
    }

    res.render("list", { listTitle: "Today", newListItems: foundItems });
});


app.get("/:listName", async (req, res) => {

    if (req.params.listName == "favicon.ico") req.params.listName = null;

    const listName = _.capitalize(req.params.listName);

    List.findOne({ name: listName }).then((foundList) => {
        if (!foundList) {
            console.log("no such list. creating...");
            const list = new List({ name: listName, items: defaultItems });
            list.save();
            res.redirect("/" + listName);
        } else {
            res.render('list', { listTitle: foundList.name, newListItems: foundList.items });
        }
    });


});

app.post("/", (req, res) => {
    const listName = req.body.list;
    const item = new Item({ name: req.body.newItem });
    if (listName == 'Today') {
        Item.create(item).then(res => {
            if (res) console.log("Item added successfully");
        }).catch(err => {
            if (err) console.log(err);
        });
        res.redirect("/");
    } else {
        List.findOne({ name: listName }).then(foundList => {
            foundList.items.push(item);
            foundList.save();
        }).catch(err => console.log(err));
        res.redirect("/" + listName);
    }

});

app.post("/delete", (req, res) => {
    const checked = req.body.checkbox;
    const listName = req.body.listName;

    if (listName == "Today") {

        Item.findByIdAndRemove(checked).then(result => {
            if (result) console.log("Successfuly deleted item.");
        }).catch(err => {
            console.log("Error: " + err);
        });
        res.redirect("/");

    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checked } } }).then(result => {
            if (result) console.log("Successfuly deleted item.");
        }).catch(err => {
            console.log("Error: " + err);
        });
        res.redirect("/" + listName);

    }

});



app.listen(3000, () => {
    console.log("Server is now up and running on port 3000");
});
