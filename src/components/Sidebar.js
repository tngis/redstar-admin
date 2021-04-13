import React, { useEffect, useState } from "react";
import { Menu, Layout } from "antd";
import { Link, withRouter } from 'react-router-dom';
import {
  DesktopOutlined,
  PieChartOutlined,
  EnvironmentOutlined,
  ClusterOutlined,
  BorderlessTableOutlined,
  UserSwitchOutlined,
  PaperClipOutlined
} from "@ant-design/icons";
import axios from "axios";
import SERVER_SETTINGS from "../utils/serverSettings";
const { SubMenu } = Menu;
const { Sider } = Layout;

const SideBar = ({ history }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [ sectors, setSectors ] = useState([]);
  const [ categories, setCategories ] = useState([]);
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  const fetchCategories = async () => {
    await axios.get(SERVER_SETTINGS.getCategories.url).then(res => setCategories(res.data.data))
  }
  const fetchSectors = async () => {
    await axios.get(SERVER_SETTINGS.getSectors.url).then(res => setSectors(res.data.data))
  }
  useEffect(() => {
    fetchSectors();
    fetchCategories();
  }, []);
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item key="1" onClick={() => history.push("/products")} icon={<PieChartOutlined />}>
          Бүтээгдэхүүн
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          Байгуулага
        </Menu.Item>
        <SubMenu key="sub2" icon={<ClusterOutlined />} onTitleClick={() => history.push("/categories")} title="Үндсэн ангилал">
          { categories?.map(category => {
            const { subcategories, key, name, id } = category;
            return (
              <SubMenu key={key} icon={<BorderlessTableOutlined />} onTitleClick={() => history.push(`/category/${id}/subcategories`)} title={name}>
                {subcategories?.map(sub => (
                  <Menu.Item icon={<PaperClipOutlined />} key={sub?.key}>
                      {sub?.name}
                  </Menu.Item>
                ))}
              </SubMenu>
            )
          }) }
        </SubMenu>
        <SubMenu key="sub4" icon={<EnvironmentOutlined />} title="Салбарууд" onTitleClick={() => history.push("/sectors")}products>
            {sectors?.map(sector => (
                <Menu.Item icon={<BorderlessTableOutlined />} key={sector?.key}>
                          <Link to={`/sector/${sector?._id}`}>{sector?.name}
                          </Link></Menu.Item>
            ))}
        </SubMenu>
        <Menu.Item key="11" icon={<UserSwitchOutlined />}>
          Админууд
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default withRouter(SideBar);
