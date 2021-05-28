import React from "react";

import styles from "../styles/routes/splashPage.module.scss";

import { Link } from "react-router-dom";
import { Button } from "antd";

const SplashPage = () => {
  return (
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
  );
};

export default SplashPage;
