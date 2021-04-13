import React, { useState, useEffect } from "react";
import { Table, Space, Button, Popconfirm, Image, message, Spin, Tag } from "antd";
import { withRouter } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import SERVER_SETTINGS from "../../utils/serverSettings";

const NewsDetailList = ({ history }) => {
  const [data, setData] = useState([]);
  const fetchSectors = async () => {
    await axios.get(SERVER_SETTINGS.getSectors.url).then(res => setData(res.data.data))
  }

  const handleClick = (id) => {
    message.loading({ content: "Боловсруулж байна ...", duration: 1 });
    
  };
  const setEdit = (record) => {
    
  };
  const columns = [
    { 
      title: "Ангилал", 
      dataIndex: "name", 
      key: "name",
    },
    {
      title: "Хаяг",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Утасны дугаар",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    { 
      title: "Төлөв", 
      dataIndex: "status", 
      key: "status", 
      render: status => (
        <>
           { status === 'published' ? (
             <Tag color="green" key="1">
                {status}
              </Tag>
           ): (
            <Tag color="error" key="2">
              {status}
            </Tag>
           ) }
        </>
      ),
    },
    {
      title: "Үйлдэл",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Устгахдаа итгэлтэй байна уу?"
            onConfirm={() => handleClick(record._id)}
          >
            <Button type="default" danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
          <Button onClick={() => setEdit(record)} type="default">
            <EditOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchSectors();
  })
  return (
    <Table
      columns={columns}
      dataSource={data}
      scroll
    />
  );
};

export default withRouter(NewsDetailList);
