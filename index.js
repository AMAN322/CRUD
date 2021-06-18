const express = require('express');

const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const User = require('./models/user');

const MongoDBStore = require("connect-mongo");


mongoose.connect('mongodb://localhost:27017/internship', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(methodOverride('_method'))

app.get("/User", async (req, res) => {
    const user = await User.find({});
    res.render("home", { user });
});

app.post("/User", async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.redirect(`/User/${newUser._id}`)
});

app.get("/User/new", (req, res) => {
    res.render("new");
})

app.get("/User/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("view", { user });
});

app.put('/User/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user })
    res.redirect(`/User/${user._id}`);
})

app.delete("/User/:id", async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect("/User");
})

app.get("/User/:id/edit", async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("edit", { user });
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})
