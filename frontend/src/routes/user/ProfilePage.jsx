import React, { useEffect, useState } from "react";

import styles from "../../styles/routes/profilePage.module.scss";

import { useParams } from "react-router";
import API from "../../api/api";

import { whitespaceRule } from "../../helpers/inputValidation";

import { useSelector } from "react-redux";
import { selectUsername } from "../../features/user/userSlice";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  PageHeader,
  Descriptions,
  Button,
  List,
  Modal,
  Input,
  Typography,
} from "antd";
const { Text } = Typography;

import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export function ProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  const api = new API();
  const currentUser = useSelector(selectUsername);
  const { username } = useParams();
  const isCurrentUser = currentUser === username;

  const [profile, setProfile] = useState("");
  const [tierlists, setTierlists] = useState([]);
  const [isCreateVisible, setIsCreateVisibile] = useState(false);

  useEffect(async () => {
    const profileRes = await api.getProfileUsername(username);
    if (profileRes.statusCode === 200) {
      setProfile(profileRes.profile);
      getTierlists(profileRes.profile.id);
    }
  }, []);

  const getTierlists = async (accountId) => {
    const tierlistRes = await api.getTierlists(accountId);
    if (tierlistRes.statusCode === 200) {
      setTierlists(tierlistRes.tierlists);
    }
  };

  const showCreate = () => {
    setIsCreateVisibile(true);
    setValue("tierlistTitle", "");
  };

  const handleOk = async (values) => {
    const payload = {
      title: values.tierlistTitle,
      id: profile.id,
    };
    const res = await api.createTierlist(payload);
    if (res.statusCode === 200) {
      getTierlists(profile.id);
      setIsCreateVisibile(false);
    }
  };

  const handleCancel = () => {
    setIsCreateVisibile(false);
  };

  return (
    <div className={styles.profileWrapper}>
      <Modal
        title="Create Tierlist"
        visible={isCreateVisible}
        onOk={handleSubmit(handleOk)}
        onCancel={handleCancel}
      >
        <label htmlFor="tierlistTitle" className={styles.formLabel}>
          Title
        </label>
        <Controller
          control={control}
          name="tierlistTitle"
          {...register("tierlistTitle", {
            required: true,
            validate: {
              whitespace: (v) => whitespaceRule(v),
            },
          })}
          render={({ field }) => {
            return (
              <Input
                className={styles.formInput}
                {...field}
                placeholder="Input tierlist title"
              />
            );
          }}
        />
        <Text type="danger" className={styles.formError}>
          {errors.tierlistTitle?.type === "required" &&
            "Tierlist title is required"}
          {errors.tierlistTitle?.type === "whitespace" &&
            "Tierlist title must not be only spaces"}
        </Text>
      </Modal>
      <div className={styles.profileBlock}>
        <PageHeader
          title={username}
          subTitle={isCurrentUser && <EditOutlined />}
          className="site-page-header"
          avatar={{ size: "large" }}
        />
        <Descriptions className={styles.description}>
          <Descriptions.Item label="Description">
            {profile.description}
          </Descriptions.Item>
          <Descriptions.Item label="Number of lists">1 </Descriptions.Item>
        </Descriptions>
        <div></div>
      </div>

      <div className={styles.tierlistBlock}>
        <PageHeader
          title="Tierlists"
          extra={[
            <Button key="!" type="primary" onClick={showCreate}>
              <PlusOutlined />
              CREATE
            </Button>,
          ]}
        />
        <List
          itemLayout="horizontal"
          dataSource={tierlists}
          size="large"
          bordered
          renderItem={(item) => (
            <List.Item
              actions={[
                <Link to="/login" key="edit">
                  <EditOutlined style={{ fontSize: "1rem" }} /> Edit
                </Link>,
              ]}
            >
              <List.Item.Meta
                title={<a>{item.title}</a>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

export default ProfilePage;
