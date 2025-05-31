const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var mongoStore = require("connect-mongo");
const studentRoutes = require("./router/student.js");
const evaluationRoutes = require("./router/evaluation.js");
const performanceRoutes = require("./router/performance.js");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

// connect to database
const DB_URL = process.env.DB_url;
mongoose
  .connect(DB_URL)
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log(err.message));
// config ejs view engine
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Danilosessionsecret",
    resave: true,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: DB_URL,
    }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);
require("./config/passport.js");
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  const errMsg = req.flash("error");
  let successMsg = req.flash("success");
  return res.render("index", {
    hasErr: errMsg.length > 0,
    errMsg,
    hasSuccess: successMsg.length > 0,
    successMsg: successMsg,
  });
});

app.use("/student", studentRoutes);
app.use("/evaluation", evaluationRoutes);
app.use("/performance", performanceRoutes);
const port = 2000 || process.env.PORT;

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
