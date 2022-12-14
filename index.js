const express = require("express");
const app = express();

// Set Public Static Folder
app.use(express.static(__dirname + "/public"));

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// cookie
const cookieParser = require("cookie-parser");
const session = require("express-session");
app.use(
  session({
    cookie: { httpOnly: true, maxAge: null },
    secret: "rCiPDCKy6gE77Y",
    resave: false,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  // res.locals.isLoggedIn = req.session.user ? true : false;
  next();
});
// Use View Engine
const expressHbs = require("express-handlebars");
const helpers = require("./helpers/handlebar");
const paginateHelper = require("express-handlebars-paginate");
const hbs = expressHbs.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: __dirname + "/views/layouts/",
  partialsDir: __dirname + "/views/partials/",
  helpers: {
    ...helpers,
    dateFormat: require('handlebars-dateformat'),
    // createPagination: paginateHelper.createPagination,
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
    next();
  } else {
    if(res.originUrl) {
      res.redirect(`/users/login?returnURL=${res.originUrl}`);
    } else {
      res.redirect(`/users/login`);
    }
  }
};

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use("/users", require("./routes/userRouter"));

app.use("/students", isLoggedIn, require("./routes/studentRouter"));
app.use("/classrooms", isLoggedIn, require("./routes/classroomRouter"));
app.use("/subjects", isLoggedIn, require("./routes/subjectRouter"));
app.use("/settings", isLoggedIn, require("./routes/settingRouter"));
app.use("/scores", isLoggedIn, require("./routes/scoreRouter"));
app.use("/reports", isLoggedIn, require("./routes/reportRouter"));
app.get("/sync", (req, res) => {
  let models = require("./models");
  models.sequelize.sync().then(() => {
    res.send("database sync completed");
  });
});
app.use("/", isLoggedIn, require("./routes/indexRouter"));

app.set("port", process.env.PORT || 5001);
app.listen(app.get("port"), () => {
  console.log(`Server is running at port ${app.get("port")}`);
});
