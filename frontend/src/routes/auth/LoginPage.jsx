import React from "react";

import { useDispatch } from "react-redux";
import { logIn } from "../../features/user/userSlice";

import API from "../../api/api";

import styles from "../../styles/routes/authForm.module.scss";
import { whitespaceRule } from "../../helpers/inputValidation";

// Ant Design
import { Button, Input, Typography } from "antd";
const { Text, Title } = Typography;

import { Controller, useForm } from "react-hook-form";

const api = new API();
export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const dispatch = useDispatch();

  // On submit of login form handler
  // Trim username spaces and tabs
  const onSubmit = async (values) => {
    const username = values.username.trim().toLowerCase();
    const payload = {
      username: username,
      password: values.password,
    };

    const loginRes = await api.login(payload);
    if (loginRes.statusCode === 200) {
      // const accountDetails = await api.getAccountDetails(username);
      // Set redux user values
      dispatch(logIn(username));
    }
  };

  return (
    <form
      name="loginForm"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.authForm}
    >
      <Title>Login</Title>

      {/* Username input 
      Uses a Controller tag so I can use antDesign inputs*/}
      <div className={styles.formItem}>
        <label htmlFor="username" className={styles.formLabel}>
          Username
        </label>
        <Controller
          control={control}
          name="username"
          {...register("username", {
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
                placeholder="Input username"
              />
            );
          }}
        />
        <Text type="danger" className={styles.formError}>
          {errors.username?.type === "required" && "Username is required"}
          {errors.username?.type === "whitespace" &&
            "Username must not be only spaces"}
        </Text>
      </div>

      {/* Password input */}
      <div className={styles.formItem}>
        <label htmlFor="password" className={styles.formLabel}>
          Password
        </label>
        <Controller
          control={control}
          name="password"
          {...register("password", {
            required: true,
          })}
          render={({ field }) => {
            return (
              <Input.Password
                className={styles.formInput}
                {...field}
                placeholder="Input password"
              />
            );
          }}
        />
        <Text type="danger" className={styles.formError}>
          {errors.password?.type === "required" && "Password is required"}
        </Text>
      </div>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </form>
  );
}

export default LoginPage;
