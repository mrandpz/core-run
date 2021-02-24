import React from "react";
import { Layout } from "antd";
const { Content } = Layout;

export default ({ children }) => {
  return (
    <Content style={{ margin: "24px 16px 0" }}>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 360 }}
      >
        {children}
      </div>
    </Content>
  );
};
