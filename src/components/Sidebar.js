import React, { useEffect, useState } from "react";
import { Menu, Layout } from "antd";
import {  withRouter } from 'react-router-dom';
import logo from './logo.png';
import {
  DesktopOutlined,
  PieChartOutlined,
  EnvironmentOutlined,
  ClusterOutlined,
  BorderlessTableOutlined,
  UserSwitchOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import axios from "axios";
import SERVER_SETTINGS from "../utils/serverSettings";
const { SubMenu } = Menu;
const { Sider } = Layout;

const SideBar = ({ history }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [ categories, setCategories ] = useState([]);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const fetchCategories = async () => {
    await axios.get(SERVER_SETTINGS.getCategories.url).then(res => setCategories(res.data.data))
  }
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center', justifyContent:'center', paddingTop: 10, paddingBottom: 10, }}>
        <img src={logo} height={collapsed ? 30 : 40} width={collapsed ? 40 : 60} style={{ backgroundColor: 'white', borderRadius: 5 }} />
      </div>
      <Menu theme="dark" defaultSelectedKeys={["sub2"]} mode="inline"> 
      <SubMenu key="sub2" icon={<ClusterOutlined />} onTitleClick={() => history.push("/categories")} title="Үндсэн ангилал">
          { categories?.map(category => {
            const { key, name, id } = category;
            return (
              <Menu.Item key={key} icon={<BorderlessTableOutlined />} onClick={() => history.push(`/category/${id}/subcategories`)}>
                {name}
              </Menu.Item>
            )
          }) }
        </SubMenu>
        <Menu.Item key="1" onClick={() => history.push("/products")} icon={<PieChartOutlined />}>
          Бүтээгдэхүүн
        </Menu.Item>
        <Menu.Item key="2" onClick={() => history.push("/intros")} icon={<DesktopOutlined />}>
          Байгууллага
        </Menu.Item>
       
        <Menu.Item key="sub4" icon={<EnvironmentOutlined />} onClick={() => history.push("/sectors")}>
          Салбарууд
        </Menu.Item>
        <Menu.Item key="11" icon={<OrderedListOutlined />} onClick={() => history.push("/works")}>
          Хийгдсэн ажлууд
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default withRouter(SideBar);
