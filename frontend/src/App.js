import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";

import LoginPage from "./routes/auth/LoginPage";
import RegisterPage from "./routes/auth/RegisterPage";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Button } from "antd";

function App() {
  const [text, setText] = useState("");
  useEffect(() => {
    async function fetchDummyData() {
      const res = await fetch("http://localhost:5000/dummy/1");
      const json = await res.json();
      console.log(json);
      setText("s");
    }
    fetchDummyData();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <Route>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <Button>{text}</Button>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
