import React, { useEffect, useState } from "react";

import API from "../../api/api";

import logo from "../../logo.svg";
import styles from "./PageHeader.module.scss";

import { useSelector } from "react-redux";
import { selectUsername } from "../../features/user/userSlice";
import { useDispatch } from "react-redux";
import { logOut } from "../../features/user/userSlice";

import { Link } from "react-router-dom";

import { Avatar, Menu, Dropdown } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";

// The main style of header found on top of each page
// PageHeader is utilised in App.js in the <Layout/Header> Tag
const PageHeader = () => {
  const username = useSelector(selectUsername);
  const [profileUsername, setProfileUsername] = useState(username || "");
  const [isAuthenticated, setIsAuthenticated] = useState();

  useEffect(async () => {
    setProfileUsername(username);
    setAuthentication();
  }, [username]);

  const api = new API();
  const dispatch = useDispatch();

  // Set authenticiation value to determine if the user is logged in or not
  const setAuthentication = async () => {
    const res = await api.isAuthenticated();
    setIsAuthenticated(res.isAuthenticated);
  };

  // Logout account, set user redux value to empty
  const logout = async () => {
    await api.logout;
    dispatch(logOut());
  };

  // Drop down profile menu
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
        {/* If user is not authenticated do not show profile section */}
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

export default PageHeader;
