var express = require("express");
var router = express.Router();
var app = (module.exports = express());

var dummyQuery = require("./dummyQuery");

// Database
const pool = require("../dev/databaseDetails");

// bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Passport Strategies
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const { response } = require("../app");

app.use(passport.initialize());

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
      if (err) next(err);

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

app.post("/auth/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Get user from the account table
  pool.query(
    "SELECT * FROM account WHERE username = $1",
    [username],
    (error, results) => {
      if (error) {
        throw error;
      }
      // If empty send a error
      if (results.rows.length === 0) {
        res.status(403).json({ error: "Password or Username is incorrect" });
        return;
      }
      const hash = results.rows[0].hash;
      bcrypt.compare(password, hash, function (err, result) {
        if (err) throw err;

        if (result) {
          console.log(req.sessionID);
          res.status(200).json({ message: "Successful Login" });
        } else {
          res.status(403).json({ error: "Password or Username is incorrect" });
        }
      });
    }
  );
});

app.get("/user/account/details", (req, res) => {
  console.log(req.sessionID);
  // console.log(req.sessionID);
  pool.query(
    "SELECT * FROM account WHERE username = $1",
    [req.session.username],
    (error, results) => {
      if (error) throw error;
      if (results.rows.length === 0) {
        res.status(403).json({ error: "User session expired" });
        return;
      }

      res.status(200).json(results.rows[0]);
    }
  );
});

app.get("/testSession", (req, res) => {
  res.json(req.sessionID);
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    throw err;
  });
});

// const authHandler = (request, response) => {
//   passport.use(new LocalStrategy(function (username, password, done) {}));
// };
