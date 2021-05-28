import React, { useState } from "react";

import styles from "../../styles/routes/authForm.module.scss";

// Ant Design
import { Button, Input, Typography } from "antd";
const { Text, Title } = Typography;

import { Controller, useForm } from "react-hook-form";
import { whitespaceRule } from "../../helpers/inputValidation";

import API from "../../api/api";

import { useDispatch } from "react-redux";
import { logIn } from "../../features/user/userSlice";

const api = new API();

export function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm();
  const dispatch = useDispatch();

  const [apiErrors, setApiErrors] = useState(new Map());

  const onSubmit = async (values) => {
    // Reset api errors
    setApiErrors((apiErrors) => ({ ...apiErrors, username: "", email: "" }));

    // Trim username and email of any extra spaces or tabs
    // TODO: password sanity
    const payload = {
      username: values.username.trim().toLowerCase(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    };

    // Post new account
    const registerRes = await api.signup(payload);

    // IF username or email is already taken
    if (registerRes.statusCode === 409) {
      const property = registerRes.property;
      if (property === "username") {
        setApiErrors((apiErrors) => ({
          ...apiErrors,
          username: registerRes.error,
        }));
      } else if (property === "email") {
        setApiErrors((apiErrors) => ({
          ...apiErrors,
          email: registerRes.error,
        }));
      }
    } else {
      dispatch(logIn(registerRes.username));
    }
  };

  return (
    <form
      name="registerForm"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.authForm}
    >
      <Title>Register</Title>
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
          {apiErrors.username}
        </Text>
      </div>

      <div className={styles.formItem}>
        <label htmlFor="email" className={styles.formLabel}>
          Email
        </label>
        <Controller
          control={control}
          name="email"
          {...register("email", {
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
          {errors.email?.type === "required" && "Email is required"}
          {errors.password?.type === "whitespace" &&
            "Email must not be only spaces"}
          {apiErrors.email}
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
            minLength: 8,
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
          {errors.password?.type === "minLength" &&
            "Password must be 8 or more characters"}
        </Text>
      </div>

      <div className={styles.formItem}>
        <label htmlFor="confirmPassword" className={styles.formLabel}>
          Confirm Password
        </label>
        <Controller
          control={control}
          name="confirmPassword"
          {...register("confirmPassword", {
            required: true,
            validate: {
              samePassword: () =>
                getValues("password") === getValues("confirmPassword"),
            },
          })}
          render={({ field }) => {
            return (
              <Input.Password
                className={styles.formInput}
                {...field}
                placeholder="Confirm password"
              />
            );
          }}
        />
        <Text type="danger" className={styles.formError}>
          {errors.confirmPassword?.type === "required" &&
            "Confirm Password is required"}
          {errors.confirmPassword?.type === "samePassword" &&
            "Both passwords must match"}
        </Text>
      </div>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </form>
  );
}

export default RegisterPage;
