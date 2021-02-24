import React from "react";
import {Layout, Menu} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

const {Sider} = Layout;

export default () => {
    return (
        <Sider>
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    <Link to="/product">商品</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};
