import React, { useEffect } from "react";
import { withRouter, Route } from 'react-router-dom';
import { Layout, Breadcrumb } from "antd";
import { SideBar, Navbar, Footer } from "../../components";
import { useSelector } from "react-redux";
const { Content } = Layout;
const DashboardScreen = ({ history }) => {
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated } = auth;

  useEffect(() => {
    if(!isAuthenticated){
      history.push("/login")
    }
  })
  return (
    <>
      <SideBar />
      <Layout className="site-layout">
        <Navbar />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            Bill is a cat.
          </div>
        </Content>
        <Footer />
      </Layout>
    </>
  );
};

export default withRouter(DashboardScreen);
