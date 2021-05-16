import React from "react";

import "../../styles/routes/LoginPage.scss";
import { whitespaceRule } from "../../helpers/inputValidation";

// Ant Design
import { Button, Input, Layout, Typography } from "antd";
const { Content, Footer } = Layout;
const { Text, Title } = Typography;

import { Controller, useForm } from "react-hook-form";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

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
    };

    const res = await fetch("http://localhost:5000/auth/login", options);
    console.log(res.status);
  };

  return (
    <Layout>
      <Content>
        <form
          name="registerForm"
          onSubmit={handleSubmit(onSubmit)}
          className="registerForm"
        >
          <Title>Login</Title>
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

export default LoginPage;
