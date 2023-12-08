const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const expressHandlebars = require("express-handlebars");
const hbs = require("hbs");
const registerM = require("./model/register");
const blogM = require("./model/blog");
const routes = require("./routes/main");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");

mongoose.connect("mongodb://localhost:27017/blog-web");

app.use(
  session({
    secret: "123456",
    resave: false,
    saveUninitialized: true,
  })
);
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}
app.get("/", (req, res) => {
  res.render("login.hbs");
});
app.get("/logined", isAuthenticated, async (req, res) => {
  const blogdatabse = await blogM.find({});
  res.render("registered.hbs", {
    blogdatabse: blogdatabse,
    user: req.session.user,
  });
});
app.post("/submit-form", async (req, res) => {
  try {
    const registerdata = new registerM(req.body);
    await registerdata.save();
    res.redirect("/logined");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/blog_insert", isAuthenticated, async (req, res) => {
  try {
    const blogdata = new blogM(req.body);
    await blogdata.save();
    res.redirect("/logined");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/create_blog", isAuthenticated, async (req, res) => {
  res.render("create_blog.hbs");
});
app.post("/login-check", async (req, res) => {
  try {
    const user = await registerM.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (user) {
      req.session.user = {userId: user._id, email: user.email}
      return res.redirect("/logined");
    } else {
      res.status(200).render("index.hbs");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
app.get('/name/:id', async(req, res)=>{
  const id = req.params.id;
  const displaydata = await blogM.findOne({
    _id: id})
    res.render('sucess.hbs' , {displaydata:displaydata})
});
app.use("/user", routes);
app.listen(3000, () => {
  console.log("server is listening on port 3000");
});
