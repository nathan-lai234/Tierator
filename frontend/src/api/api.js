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

  // Get the account details of the given username
  // Currently returns the username, email and hash (TODO: HASH SHOULD NOT BE RETURNED)
  getAccountDetails(username) {
    const options = {
      method: "GET",
      credentials: "include",
    };
    return getJSON(`${this.url}/user/account/details/${username}`, options);
  }
}
