const express = require("express");
const router = express.Router();
const pool = require("../dev/databaseDetails");

// The current attributes that construct a users profile (ADD A LEADING SPACE AT THE BEGINNING AND END!)
// Its scuff i know
const profileAttributes = " username, email, description, profile_image ";

// Get user profile details
const getUserById = (req, res, next) => {
  const id = parseInt(req.params.id);

  pool.query(
    "SELECT" +
      profileAttributes +
      "FROM account INNER JOIN profile ON id = account_id WHERE id = $1",
    [id],
    (error, results) => {
      if (error) next(error);
      if (results.rows.length === 0) {
        res.status(404).json({ error: "user does not exist" });
      } else {
        res.status(200).json(results.rows[0]);
      }
    }
  );
};

const getUserByUsername = (req, res, next) => {
  const username = req.params.username;

  pool.query(
    "SELECT" +
      profileAttributes +
      "FROM account INNER JOIN profile ON id = account_id WHERE username = $1",
    [username],
    (error, results) => {
      if (error) next(error);
      if (results.rows.length === 0) {
        res.status(404).json({ error: "user does not exist" });
      } else {
        res.status(200).json(results.rows[0]);
      }
    }
  );
};

module.exports = { getUserById, getUserByUsername };
