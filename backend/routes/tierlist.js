const express = require("express");
const router = express.Router();
const pool = require("../dev/databaseDetails");

// Return true or false if the user is the owner of the tier list
const isOwnerOfTierlist = (accountId, tierlistId, next) => {
  pool.query(
    "SELECT * FROM tier_list WHERE EXISTS (SELECT * FROM tier_list WHERE account_id = $1 AND tier_list_id = $2",
    [accountId, tierlistId],
    (error, result) => {
      if (error) next(error);
      console.log(result);
      return result;
    }
  );
};

// Create a tier list with the current user id and a given title
// Note: no description is given as it will not be set during the first creation of a tierlist
const createTierList = (req, res, next) => {
  console.log(req.session);
  if (!req.isAuthenticated()) {
    res.status(403).json({ error: "user session has expired" });
    return next();
  }

  const id = req.session.passport.user.id;
  const title = req.body.title;

  pool.query(
    "INSERT INTO tier_list (account_id, title) VALUES ($1, $2)",
    [id, title],
    (error, results) => {
      if (error) next(error);

      res.status(200).json({ message: "success" });
    }
  );
};

// Get all tierlists of the given account id
// Returns an empty array if no tier lists in account
const getTierlists = (req, res, next) => {
  const accountId = req.params.accountId;
  pool.query(
    "SELECT * FROM tier_list WHERE account_id = $1",
    [accountId],
    (error, results) => {
      if (error) next(error);
      res.status(200).json({ tierlists: results.rows });
    }
  );
};

const readTierlist = (req, res, next) => {
  const tierlistId = req.body.tierlistId;
  const isOwner = false;

  //TO DO JOINS
  pool.query(
    "SELECT * FROM tier_list WHERE tier_list_id = $1",
    [tierlistId],
    (error, results) => {
      if (error) next(error);

      if (res.results.length === 0) {
        res.status(404).json({ error: "Quiz does not exist" });
        return next();
      }

      if (
        req.isAuthenticated() &&
        req.session.passport.id === results[0].account_id
      ) {
        isOwner = true;
      }
      res.status(200).json({ ...results[0], isOwner: isOwner });
    }
  );
};

/**
 * Must be authenticated and the owner of the tierlist
 * Updates the tier list with given title and description
 * @param {Integer} req.body.tierlistId
 * @param {String} req.body.title
 * @param {String} req.body.description
 * @returns {JSON Object} Tier list row that was updated
 */
const updateTierlist = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(403).json({ error: "user session has expired" });
    return next();
  }

  const tierlistId = req.body.tierlistId;
  const accountId = req.session.passport.id;

  // Ensure that the current user is the correct user
  if (!isOwnerOfTierlist(accountId, tierlistId, next)) {
    res.status(403).json({ error: "Invalid user" });
    return next();
  }

  const title = req.body.title;
  const description = req.body.description;

  pool.query(
    "UPDATE tier_list SET title = $1, description = $2 where tier_list_id = $3",
    [title, description, id],
    (error, results) => {
      if (error) next(error);
      res.status(200).json(results.rows[0]);
    }
  );
};

/**
 * Must be authenticated and the owner of the tierlist
 * Delete tier list and all child rows (cascading) [tier_elements, genre_tags, tier_rows]
 * @param {Integer} req.body.tierlistId
 * @param {String} req.body.title
 * @param {String} req.body.description
 * @returns {JSON Object} Tier list row that was updated
 */
const deleteTierlist = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(403).json({ error: "user session has expired" });
    return next();
  }

  const tierlistId = req.body.tierlistId;
  const accountId = req.session.passport.id;

  // Ensure that the current user is the correct user
  if (!isOwnerOfTierlist(accountId, tierlistId, next)) {
    res.status(403).json({ error: "Invalid user" });
    return next();
  }

  pool.query(
    "DELETE FROM tier_list WHERE tier_list_id = $1",
    [tierlistId],
    (error, results) => {
      if (error) next(error);
      res.status(200).json(results);
    }
  );
};

module.exports = {
  readTierlist,
  createTierList,
  updateTierlist,
  deleteTierlist,
  getTierlists,
};
