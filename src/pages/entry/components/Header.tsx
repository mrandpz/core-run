import React from "react";
import {Layout} from "antd";
import useRuntimeState from "hooks/useRuntimeState";
import {UserState} from "../../auth/index";
const {Header} = Layout;

export default () => {
    const user: UserState = useRuntimeState("user");
    return (
        <Header className="site-layout-sub-header-background" style={{padding: 0}}>
            currentUser: {user?.currentUser?.username}
        </Header>
    );
};
