var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

// Get dev values
const pool = require("./dev/databaseDetails");
const secret = require("./dev/session");

var app = express();
// Routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var dummyQuery = require("./routes/dummyQuery");
var authRouter = require("./routes/auth");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    name: "tierartorAuthSession",
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, aameSite: true, secure: false },
  })
);

app.use(authRouter);

app.use("/", indexRouter);
app.use("/users", usersRouter);

// dummy
app.get("/dummy", dummyQuery.getUsers);
app.get("/dummy/:id", dummyQuery.getUserById);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
