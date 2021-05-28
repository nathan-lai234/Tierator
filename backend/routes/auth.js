var express = require("express");
var router = express.Router();
var app = (module.exports = express());

// Database
const pool = require("../dev/databaseDetails");

// bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Passport Strategies
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

app.use(passport.initialize());
app.use(passport.session());

// Local strategy for authenticating
passport.use(
  new LocalStrategy((username, password, done) => {
    pool.query(
      "SELECT * FROM account WHERE username = $1",
      [username],
      (error, results) => {
        if (error) {
          done(error);
        }
        // If empty send a error
        if (results.rows.length === 0) {
          return done(null, false, {
            message: "Username or password is invalid",
          });
        }
        console.log(password);
        const user = results.rows[0];
        const hash = results.rows[0].hash;
        bcrypt.compare(password, hash, function (error, result) {
          if (error) {
            done(error);
          }

          if (result) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Username or password is invalid",
            });
          }
        });
      }
    );
  })
);

passport.serializeUser((user, done) => {
  done(null, { id: user.id, username: user.username });
});

passport.deserializeUser((user, done) => {
  const id = user.id;
  pool.query("SELECT * FROM account WHERE id = $1", [id], (error, results) => {
    if (error) {
      done(error, false);
    }
    // If empty send a error
    if (results.rows.length === 0) {
      return done(null, false);
    }

    const user = results.rows[0];
    console.log(user);
    return done(null, user);
  });
});

/**
 * Check if there exist a single row with the given column or value
 * @param {string} table
 * @param {string} column
 * @param {any} value
 * @returns
 */
const isPropertyUnique = async (table, column, value) => {
  try {
    const {
      rows,
    } = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column} = $1)`,
      [value]
    );
    return !rows[0].exists;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

app.post("/auth/signup", async function (req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // is * Unique will is not true the username or email is not unique
  let isUsernameUnique = await isPropertyUnique(
    "account",
    "username",
    username
  );

  let isEmailUnique = await isPropertyUnique("account", "email", email);

  if (!isUsernameUnique) {
    res.status(409).json({
      property: "username",
      error: `Username ${username} is already taken.`,
    });
  } else if (!isEmailUnique) {
    res
      .status(409)
      .json({ property: "email", error: `Email ${email} is already taken.` });
  } else {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) return next(err);

      pool.query(
        "INSERT INTO account (username, email, hash) VALUES ($1, $2, $3)",
        [username, email, hash],
        (error, results) => {
          if (error) {
            throw error;
          }
          console.log(results);
          res.status(200).json({ message: "successful creation" });
        }
      );
    });
  }
});

// Login using passport
app.post("/auth/login", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (info) {
      return res.status(403).json(info);
    }
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({ message: "success" });
    });
  })(req, res, next);
});

// Get the details of the account given the username parameter
app.get("/user/account/details/:username", (req, res) => {
  if (req.isAuthenticated()) {
    let username = req.params.username;

    // If somehow username is malformed to these values just return the current user
    if (username === "" || username === undefined || username === null) {
      username = req.session.passport.user.username;
    }

    pool.query(
      "SELECT * FROM account WHERE username = $1",
      [username],
      (error, results) => {
        if (error) throw error;
        if (results.rows.length === 0) {
          res.status(403).json({ error: "User session expired" });
          return;
        }
        res.status(200).json(results.rows[0]);
      }
    );
  } else {
    res.status(401).json({ error: "User session expired" });
  }
});

// Simple functiojn to check if the user is authenticated. Mostly used for UI displaying.
app.get("/isAuthenticated", (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  res.status(200).json({ isAuthenticated: isAuthenticated });
});

// Destroy the current section simulating a logout
app.get("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});
