import React, { useState } from "react";

// import "../../styles/routes/LoginPage.scss";

// Ant Design
import { Layout, Menu, Form, Button, Input } from "antd";
const { Header, Content, Footer } = Layout;

export function RegisterPage() {
  const [headerState, setHeaderState] = useState("1");

  const handleHeaderClick = (event) => {
    setHeaderState(event.key);
  };

  const [form] = Form.useForm();

  const layout = {
    labelCol: { offset: 4, span: 4 },
    wrapperCol: { span: 8 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 8 },
  };

  const validatePassword = (rule, value, callback) => {
    if (value.length < 8) {
      callback("Password must be at least 8 or more characters");
    } else {
      callback();
    }
  };

  const onFinish = async (values) => {
    const payload = {
      username: values.registerUsername,
      email: values.registerEmail,
      password: values.registerPassword,
    };

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const res = await fetch("http://localhost:5000/auth/signup", options);
    const status = res.status;
    const json = await res.json();

    if (status === 409) {
      console.log(json);
      form.setFields({
        registerUsername: {
          value: values.username,
          errors: ["asd"],
        },
      });

      console.log(form.getFieldsError());
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
        <Form
          {...layout}
          form={form}
          name="registerForm"
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="registerUsername"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please input a username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="registerEmail"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Please input an email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="registerPassword"
            rules={[
              { required: true, message: "Please input a password!" },
              { validator: validatePassword },
            ]}
            validateTrigger={null}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="registerConfirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("registerPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
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

export default RegisterPage;
