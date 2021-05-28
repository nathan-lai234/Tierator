import React from "react";

import { useDispatch } from "react-redux";
import { logIn } from "../../features/user/userSlice";

import styles from "../../styles/routes/authForm.module.scss";
import { whitespaceRule } from "../../helpers/inputValidation";

// Ant Design
import { Button, Input, Typography } from "antd";
const { Text, Title } = Typography;

import { Controller, useForm } from "react-hook-form";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const sleep = (milliseconds = 500) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    const payload = {
      username: values.username.trim().toLowerCase(),
      password: values.password,
    };

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    };

    const res = await fetch("http://localhost:5000/auth/login", options);
    console.log(res);

    if (res.status === 200) {
      await sleep();
      const accountDetails = await fetch(
        "http://localhost:5000/user/account/details",
        { credentials: "include" }
      );
      const details = await accountDetails.json();
      console.log(details);

      dispatch(logIn(details.username));
    }
  };

  return (
    <form
      name="loginForm"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.authForm}
    >
      <Title>Login</Title>
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
