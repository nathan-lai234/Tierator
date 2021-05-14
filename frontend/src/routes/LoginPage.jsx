import React, { useState } from "react";

import "../styles/routes/LoginPage.scss";

// Ant Design
import { Layout, Menu, Form, Button, Input } from "antd";
const { Header, Content, Footer } = Layout;

export function LoginPage() {
  const [headerState, setHeaderState] = useState("1");

  const handleHeaderClick = (event) => {
    setHeaderState(event.key);
  };

  const layout = {
    labelCol: { offset: 4, span: 4 },
    wrapperCol: { span: 8 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 8 },
  };

  const validatePassword = (rule, value, callback) => {
    if (value === "") {
      callback();
    }

    if (value === "a") {
      callback();
    } else {
      callback("no");
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
        <Form {...layout} name="loginForm ">
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { validator: validatePassword },
            ]}
            validateTrigger={null}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <Button></Button>
      </Content>
      <Footer>ASD</Footer>
    </Layout>
  );
}

export default LoginPage;
