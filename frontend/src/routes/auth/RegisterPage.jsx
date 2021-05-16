import React, { useState } from "react";

import "../../styles/routes/RegisterPage.scss";

// Ant Design
import { Button, Input, Layout, Menu, Typography } from "antd";
const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

import { Controller, useForm } from "react-hook-form";
import { whitespaceRule } from "../../helpers/inputValidation";

export function RegisterPage() {
  const [headerState, setHeaderState] = useState("1");

  const handleHeaderClick = (event) => {
    setHeaderState(event.key);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm();

  const [apiErrors, setApiErrors] = useState(new Map());

  const onSubmit = async (values) => {
    setApiErrors((apiErrors) => ({ ...apiErrors, username: "", email: "" }));

    const payload = {
      username: values.username.trim().toLowerCase(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    };

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    // Post new account
    const res = await fetch("http://localhost:5000/auth/signup", options);
    const status = res.status;
    const registerRes = await res.json();

    // IF username or email is already taken
    if (status === 409) {
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
    }
  };

  return (
    <Layout>
      <Header className="header">
        <Menu
          mode="horizontal"
          onClick={handleHeaderClick}
          selectedKeys={[headerState]}
        >
          <Menu.Item key="mail">Navigation One</Menu.Item>
        </Menu>
      </Header>
      <Content>
        <form
          name="registerForm"
          onSubmit={handleSubmit(onSubmit)}
          className="registerForm"
        >
          <Title>Register</Title>
          <div className="formItem">
            <label htmlFor="username" className="formLabel">
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
                    className="formInput"
                    {...field}
                    placeholder="Input username"
                  />
                );
              }}
            />
            <Text type="danger" className="formError">
              {errors.username?.type === "required" && "Username is required"}
              {errors.username?.type === "whitespace" &&
                "Username must not be only spaces"}
              {apiErrors.username}
            </Text>
          </div>

          <div className="formItem">
            <label htmlFor="email" className="formLabel">
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
                    className="formInput"
                    {...field}
                    placeholder="Input username"
                  />
                );
              }}
            />
            <Text type="danger" className="formError">
              {errors.email?.type === "required" && "Email is required"}
              {errors.password?.type === "whitespace" &&
                "Email must not be only spaces"}
              {apiErrors.email}
            </Text>
          </div>

          <div className="formItem">
            <label htmlFor="password" className="formLabel">
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
                    className="formInput"
                    {...field}
                    placeholder="Input password"
                  />
                );
              }}
            />
            <Text type="danger" className="formError">
              {errors.password?.type === "required" && "Password is required"}
              {errors.password?.type === "minLength" &&
                "Password must be 8 or more characters"}
            </Text>
          </div>

          <div className="formItem">
            <label htmlFor="confirmPassword" className="formLabel">
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
                    className="formInput"
                    {...field}
                    placeholder="Confirm password"
                  />
                );
              }}
            />
            <Text type="danger" className="formError">
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
      </Content>
      <Footer>ASD</Footer>
    </Layout>
  );
}

export default RegisterPage;
