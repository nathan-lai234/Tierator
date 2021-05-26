import React from "react";
import logo from "./logo.svg";
import styles from "./App.scss";
import "antd/dist/antd.css";

import LoginPage from "./routes/auth/LoginPage";
import RegisterPage from "./routes/auth/RegisterPage";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Avatar, Button, Layout } from "antd";
import { UserOutlined } from "@ant-design/icons";
const { Header, Content, Footer } = Layout;

// const [profileUsername, setProfileUsername] = useState("Name");

// TO DO: find a way to dynamically set the username!!

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Header className={styles.topHeader}>
          <Link to="/">
            <img src={logo} className={styles.appLogo} alt="logo" />
          </Link>
          <div className={styles.profileWrapper}>
            <Avatar icon={<UserOutlined />}></Avatar>
            <h1 className={styles.profileName}>Name</h1>
          </div>
        </Header>
        <Content className={styles.appContent}>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/register">
              <RegisterPage />
            </Route>
            <Route>
              <div className={styles.homeWrapper}>
                <div className={styles.authButtons}>
                  <Button size="large">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button size="large" type="primary">
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              </div>
            </Route>
          </Switch>
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </Router>
  );
}

export default App;
