import React, { useEffect, useState } from "react";

import styles from "../../styles/routes/profilePage.module.scss";

import { useParams } from "react-router";
import API from "../../api/api";

import { useSelector } from "react-redux";
import { selectUsername } from "../../features/user/userSlice";
import { EditOutlined } from "@ant-design/icons";
import { PageHeader, Descriptions } from "antd";

export function ProfilePage() {
  const api = new API();
  const currentUser = useSelector(selectUsername);
  const { username } = useParams();
  const isCurrentUser = currentUser === username;

  const [description, setDescription] = useState("");

  useEffect(async () => {
    const res = await api.getProfileUsername(username);
    console.log(res);
    if (res.statusCode !== 200) return;
    if (res.description !== null) {
      setDescription(res.description);
    }
  }, []);
  console.log(description);
  return (
    <div className={styles.profileWrapper}>
      <div className={styles.profileBlock}>
        <PageHeader
          title={username}
          subTitle={isCurrentUser && <EditOutlined />}
          className="site-page-header"
          avatar={{ size: "large" }}
        />
        <Descriptions className={styles.description}>
          <Descriptions.Item label="Description">
            {description}
          </Descriptions.Item>
          <Descriptions.Item label="Number of lists">1 </Descriptions.Item>
        </Descriptions>
        <div></div>
      </div>
    </div>
  );
}

export default ProfilePage;
