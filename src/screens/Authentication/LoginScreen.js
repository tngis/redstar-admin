import React, { useEffect } from "react";
import { withRouter } from 'react-router-dom';
import { login } from '../../actions/userActions' ;
import { Form, Input, Button, Checkbox, Row, Col, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

const LoginScreen = ({ history }) => {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { isAuthenticated } = auth;
  useEffect(() => {
    if(isAuthenticated) {
      history.push('/');
    }
  })
  const onFinish = (values) => {
    const data = {
      email: values.email,
      password: values.password,
    };
    dispatch(login(data, history))
  };

  return (
    <Row>
      <Col xs={2} sm={4} md={6} lg={8} xl={9}></Col>
      <Col xs={20} sm={16} md={12} lg={8} xl={6} style={{ marginTop: 150 }}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <div className="login-text">
            <h1>Нэвтрэх хэсэг</h1>
          </div>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Хэрэглэгчийн нэрийг оруулна уу",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Нууц үгээ оруулна уу!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Сануулах</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Нууц үг сэргээх
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Нэвтрэх
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col xs={2} sm={4} md={6} lg={8} xl={9}></Col>
    </Row>
  );
};

export default withRouter(LoginScreen);
