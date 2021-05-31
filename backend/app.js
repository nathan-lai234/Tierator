// Default requires
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");

//
const pgSession = require("connect-pg-simple")(session);

// Get dev values
const pool = require("./dev/databaseDetails");
const secret = require("./dev/session");

const app = express();
// Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authQuery = require("./routes/auth");
const profileQuery = require("./routes/profile");
const tierlistQuery = require("./routes/tierlist");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("hello"));
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
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, aameSite: true, secure: false },
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(authQuery);

// dummy
// app.get("/dummy", dummyQuery.getUsers);
app.get("/user/profile/:id", profileQuery.getUserById);
app.get("/user/profile/username/:username", profileQuery.getUserByUsername);

app.get("/tierlists/:accountId", tierlistQuery.getTierlists);
app.post("/tierlist", tierlistQuery.createTierList);
app.get("/tierlist/:id", tierlistQuery.readTierlist);
app.put("/tierlist", tierlistQuery.updateTierlist);
app.delete("/tierlist", tierlistQuery.deleteTierlist);

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
