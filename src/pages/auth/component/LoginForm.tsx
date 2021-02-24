import React from "react";
import { Form, Input, Button, Spin } from "antd";
import { connect, DispatchProp } from "react-redux";
import { showLoading } from "core-fe";
import { actions } from "pages/auth";
import { LOADING_LOGIN } from "../type";
import { RootState } from "type/state";

interface StateProps {
  showLoading: boolean;
  loggedIn: boolean;
}

interface Props extends StateProps, DispatchProp {}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const LoginForm = ({ showLoading, dispatch }: Props) => {
  const onFinish = (values: any) => {
    console.log("Success:", values);
    dispatch(actions.login(values.username, values.password));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Spin spinning={showLoading}>
      <Form
        {...layout}
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

const mapStateToProps = (state: RootState): StateProps => {
  return {
    loggedIn: state.app.user.currentUser?.loggedIn,
    showLoading: showLoading(state, LOADING_LOGIN),
  };
};

export default connect(mapStateToProps)(LoginForm);
