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
    // createPagination: paginateHelper.createPagination,
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use("/", require("./routes/indexRouter"));
app.use("/students", require("./routes/studentRouter"));
app.use("/classrooms", require("./routes/classroomRouter"));
app.use("/subjects", require("./routes/subjectRouter"));
// app.use("/cart", require("./routes/cartRouter"));
// app.use("/comments", require("./routes/commentRouter"));
// app.use("/reviews", require("./routes/reviewRouter"));
// app.use("/users", require("./routes/userRouter"));

app.get("/sync", (req, res) => {
  let models = require("./models");
  models.sequelize.sync().then(() => {
    res.send("database sync completed");
  });
});
app.set("port", process.env.PORT || 5001);
app.listen(app.get("port"), () => {
  console.log(`Server is running at port ${app.get("port")}`);
});
