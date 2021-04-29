const express = require("express");
const router = express.Router();
const pool = require("../dev/databaseDetails");

const getUsers = (request, response) => {
  pool.query("SELECT * FROM dummy", (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM dummy WHERE id = $1", [id], (error, results) => {
    if (error) {
      console.log(error);
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = { getUsers, getUserById };
