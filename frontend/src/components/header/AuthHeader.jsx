import React, { useEffect, useState } from "react";

import logo from "../../logo.svg";
import styles from "../../styles/components/authHeader.module.scss";

import { useSelector } from "react-redux";
import { selectUsername } from "../../features/user/userSlice";
import { useDispatch } from "react-redux";
import { logOut } from "../../features/user/userSlice";

import { Link } from "react-router-dom";

import { Avatar, Menu, Dropdown } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";

const AuthHeader = () => {
  const username = useSelector(selectUsername);
  const [profileUsername, setProfileUsername] = useState(username || "");
  const [isAuthenticated, setIsAuthenticated] = useState();

  useEffect(async () => {
    setProfileUsername(username);
    setAuthentication();
  }, [username]);

  const dispatch = useDispatch();

  // Set authenticiation value to determine if the user is logged in or not
  const setAuthentication = async () => {
    const res = await fetch("http://localhost:5000/isAuthenticated", {
      credentials: "include",
    });
    const json = await res.json();
    setIsAuthenticated(json.isAuthenticated);
  };

  const logout = async () => {
    await fetch("http://localhost:5000/auth/logout", {
      credentials: "include",
    });
    dispatch(logOut());
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={logout}>Logout</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Link to="/">
        <img src={logo} className={styles.appLogo} alt="logo" />
      </Link>
      <div className={styles.profileWrapper}>
        {isAuthenticated && (
          <>
            <Avatar icon={<UserOutlined />}></Avatar>
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              className={styles.profileDropdown}
            >
              <h1 className={styles.profileName}>
                {profileUsername}
                <DownOutlined style={{ fontSize: "16px" }} />
              </h1>
            </Dropdown>
          </>
        )}
      </div>
    </>
  );
};

export default AuthHeader;
