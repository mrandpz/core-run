import React from "react";
import {Layout} from "antd";
import {connect} from "react-redux";
import {Switch} from "react-router-dom";
// Route 封装了ErrorBoundary
import {async, Route} from "core-fe";
import SiderMenu from "./SiderMenu";
import Header from "./Header";
import ContentWrap from "./ContentWrap";
import Footer from "./Footer";
import "./Entry.less";

const Welcome = () => <div>welcome</div>;
const NotFound = () => <div>NotFound</div>;
const LoginForm = async(() => import(/* webpackChunkName: "login" */ "pages/auth"), "LoginForm");
const ProductList = async(() => import(/* webpackChunkName: "login" */ "pages/product"), "ProductList");

export default connect()(() => {
    return (
        <Layout id="content-layout">
            <SiderMenu />
            <Layout>
                <Header />
                <ContentWrap>
                    {/* login 和 welcome 需要额外的layout的话，再嵌套一层route即可 */}
                    <Switch>
                        <Route exact path="/" component={Welcome} />
                        <Route exact path="/login" component={LoginForm} />
                        <Route exact path="/product" component={ProductList} />
                        <Route exact path="/permission" accessCondition={false} component={ProductList} />
                        <Route component={NotFound} />
                    </Switch>
                </ContentWrap>
                <Footer />
            </Layout>
        </Layout>
    );
});
