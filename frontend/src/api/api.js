// Fetches request and returns the json object with the status code
const getJSON = (path, options) =>
  fetch(path, options)
    .then((res) =>
      res.json().then((data) => ({ ...data, statusCode: res.status }))
    )
    .catch((err) => console.warn(`API_ERROR: ${err.message}`));

export default class API {
  /** @param {String} url */
  constructor() {
    this.url = "http://localhost:5000";
  }

  // Returns boolean value if the current user is authenticated
  isAuthenticated() {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    return getJSON(`${this.url}/isAuthenticated`, options);
  }

  // Login into a user's account given a password and username
  login(payload) {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    };
    return getJSON(`${this.url}/auth/login`, options);
  }

  // Logout of user's account
  logout() {
    const options = {
      method: "GET",
      credentials: "include",
    };
    return getJSON(`${this.url}/auth/logout`, options);
  }

  signup(payload) {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return getJSON(`${this.url}/auth/signup`, options);
  }

  // Get the account details of the given username
  // Currently returns the username, email and hash (TODO: HASH SHOULD NOT BE RETURNED)
  getAccountDetails(username) {
    const options = {
      method: "GET",
      credentials: "include",
    };
    return getJSON(`${this.url}/user/account/details/${username}`, options);
  }

  // Get profile details given a account id
  getProfileId(accountId) {
    const options = {
      method: "GET",
      credentials: "include",
    };
    return getJSON(`${this.url}/user/profile/${accountId}`, options);
  }

  // Give profile details given a username
  getProfileUsername(username) {
    const options = {
      method: "GET",
      credentials: "include",
    };
    return getJSON(`${this.url}/user/profile/username/${username}`, options);
  }

  // Get all tierlist of the given accountId
  getTierlists(accountId) {
    const options = {
      method: "GET",
      credentials: "include",
    };
    return getJSON(`${this.url}/tierlists/${accountId}`, options);
  }

  // Create tierlist given payload
  createTierlist(payload) {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    };
    return getJSON(`${this.url}/tierlist`, options);
  }

  /// Read/get one tierlist given the id
  readTierlist(tierlistId) {
    const options = {
      method: "GET",
      credentials: "include",
    };
    return getJSON(`${this.url}/tierlist/${tierlistId}`, options);
  }

  updateTierlist(payload) {
    const options = {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(payload),
    };
    return getJSON(`${this.url}/tierlist`, options);
  }

  deleteTierlist(payload) {
    const options = {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify(payload),
    };
    return getJSON(`${this.url}/tierlist`, options);
  }
}
