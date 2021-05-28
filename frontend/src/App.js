import React from "react";
import styles from "./App.module.scss";
import "antd/dist/antd.css";

import LoginPage from "./routes/auth/LoginPage";
import RegisterPage from "./routes/auth/RegisterPage";
import AuthHeader from "./components/header/AuthHeader";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Button, Layout } from "antd";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Header className={styles.topHeader}>
          <AuthHeader />
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
