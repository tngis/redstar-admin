import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Layout, Avatar, Badge, Dropdown, Menu, message, Button } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ServerSettings from "../utils/serverSettings";
import { logoutUser } from "../actions/userActions";
const { Header } = Layout;
const Navbar = ({history}) => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({})
  useEffect(() => {
   axios.get(ServerSettings.getUser.url).then(res => setProfile(res.data.data)) 
  }, []);
  
  const handleMenuClick = (e) => {
    if (e.key === "3") {
      dispatch(logoutUser());
      history.push('/login');
    }
    if (e.key === "1") {
      history.push("/user/profileedit");
    }
    if (e.key === "2") {
      history.push("/user/passwordedit");
    }
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Мэдээлэл өөрчлөх
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        Нууц үг солих
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />}>
        Гарах
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="site-layout-background" style={{ padding: 0, right: 0 }}>
      <div style={{ textAlign: "right", marginRight: 50 }}>
        <a href="http://localhost:8082" style={{ marginRight: 20 }}>
          <Avatar shape="circle" size={24} icon={<RedoOutlined />} />
        </a>
        <span style={{ marginRight: 20 }}>
          <Badge count={1} size={8}>
            <Avatar shape="circle" size={24} icon={<UserOutlined />} />
          </Badge>
        </span>
        <Dropdown overlay={menu} placement="bottomCenter">
          <Button>
            <UserOutlined />
             { profile?.name }
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
};

export default withRouter(Navbar);
