// Global Ant design css
import "antd/dist/antd.css";

// Route Pages
import LoginPage from "./routes/auth/LoginPage";
import RegisterPage from "./routes/auth/RegisterPage";
import SplashPage from "./routes/SplashPage";

// Components
import AuthHeader from "./components/header/AuthHeader";

// React Router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import React from "react";
import styles from "./App.module.scss";
import { Layout } from "antd";
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
              <SplashPage />
            </Route>
          </Switch>
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </Router>
  );
}

export default App;
