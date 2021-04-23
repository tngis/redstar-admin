import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import parser from 'html-react-parser';
import { Tooltip, Table,Typography, Space, Button, Popconfirm, message, Tag, Image } from "antd";
import { withRouter } from "react-router-dom";
import { DeleteOutlined, EditOutlined , ExclamationCircleOutlined} from "@ant-design/icons";
import axios from "axios";
import SERVER_SETTINGS from "../../utils/serverSettings";
const { Title } = Typography;
const WorkScreen = ({ history }) => {
  const [data, setData] = useState([]);
  const fetchWorks = async () => {
    await axios.get(SERVER_SETTINGS.getWorks.url).then(res => setData(res.data.data))
  }

  const handleClick = async (id) => {
    message.loading({ content: "Боловсруулж байна ...", duration: 1 });
    await axios.delete(`${SERVER_SETTINGS.getWorks.url}/${id}`)
      .then(() => {
        message.success("Мэдээллийг амжилттай устагдлаа");
        fetchWorks();
      })
      .catch(() => message.error("Амжилтгүй боллоо"))
  };

  const columns = [
    { 
      title: "Гарчиг", 
      dataIndex: "title", 
      key: "title",
    },
    {
      title: "Огноо",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Зураг",
      dataIndex: "image",
      key: "image",
      render: (record) => (
        <Image
          width={80}
          height={60}
          src={`http://103.50.205.100:8081/uploads/${record}`}
        />
      )
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
          <Button onClick={() =>  history.push(`/work/${record._id}/edit`)} type="default">
            <EditOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchWorks();
  }, [])
  return (
    <div>
    <div style={{ marginBottom: 20 }}>
    <div style={{ float: "left", marginLeft: 20 }}>
      <Title level={4}>
        Хийгдсэн ажилууд
        <Tooltip
          placement="right"
          title="Хийгдсэн ажилуудыг удирдах хэсэг"
        >
          <ExclamationCircleOutlined
            style={{ marginLeft: 8, color: "#ffbb96" }}
          />
        </Tooltip>
      </Title>
    </div>

    <div style={{ float: "right", marginBottom: 20 }}>
      <Button type="primary">
        <Link to='/work/create'>Ажил нэмэх</Link>
      </Button>
    </div>
  </div>
    <Table
      columns={columns}
      dataSource={data}
      expandable={{
        expandedRowRender: record => <p style={{ margin: 0 }}>{parser(record.description)}</p>,
        rowExpandable: record => record.name !== 'Not Expandable',
      }}
      scroll
    />
    </div>
  );
};

export default withRouter(WorkScreen);
