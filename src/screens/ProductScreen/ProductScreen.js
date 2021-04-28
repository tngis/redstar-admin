import React, { useState, useEffect } from "react";
import { Table, Space, Button, Popconfirm, Image, message, Tag, Tooltip, Typography } from "antd";
import { withRouter, Link } from "react-router-dom";
import parser from "html-react-parser"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import SERVER_SETTINGS from "../../utils/serverSettings";

const { Title } = Typography;
const ProductScreen = ({ history }) => {
  const [data, setData] = useState([]);
  const fetchProducts = async () => {
    await axios.get(SERVER_SETTINGS.getProdcuts.url).then(res => setData(res.data.data))
  }

  const handleClick = (id) => {
    message.loading({ content: "Боловсруулж байна ...", duration: 1 });
    axios.delete(`${SERVER_SETTINGS.getProdcuts.url}/${id}`)
      .then(() => fetchProducts())
      .then(() => message.success("Бүтээгдэхүүн устгагдлаа!"))
      .catch(() => message.error("Алдаа гарлаа"))
  };
  const SubData = ({ record }) => {
    const subdata = [];
    const columns = [
      { 
        title: 'Зураг', 
        dataIndex: 'thumbnail', 
        key: 'thumbnail', 
        render: (record) => (
        <Image
          width={80}
          height={60}
          src={`http://103.50.205.100:8081/uploads/${record}`}
        />
      ), },
      { title: 'Хэмжээ', dataIndex: 'size', key: 'size' },
      {
        title: 'Үнэ',
        dataIndex: 'price',
        key: 'price',
      },
      { title: 'Насны хязгаар', 
      render: item => {
        console.log(item)
        return (
           <Tag color="cyan">
            {`${item.age_star}-${item.age_end}`}
          </Tag>
          )  
      }},
      { title: 'Үзэлт', dataIndex: 'viewed', key: 'viewed' },
      { title: 'Тоо ширхэг', dataIndex: 'count', key: 'count' },
      { title: 'Салбар', dataIndex: 'sectors', key: 'sectors', 
      render: sectors => {
        return (
          <>
          {sectors?.map((c, index) => (
            <Tag color="cyan" key={index}>
            {c.name}
          </Tag>
          ))}
            </>
          )
      } },
    ];
    subdata.push(record);
    return <Table columns={columns} dataSource={subdata} pagination={false} 
      expandable={{
      expandedRowRender: record => <p style={{ margin: 0 }}>{parser(record.description || "Not found!!")}</p>,
      rowExpandable: record => record.name !== 'Not Expandable',
    }} />;
  };

  const columns = [
    { 
      title: "Код", 
      dataIndex: "code", 
      key: "code",
    },
    {
      title: "Нэр",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ангилал",
      dataIndex: "category",
      key: "category",
      render: category => (
        <>
          <Tag color="green" key="1">
            {category.name}
          </Tag>
        </>
      ),
    },
    {
      title: "Дэд ангилал",
      dataIndex: "subcategories",
      key: "subcategories",
      render: subcategories => {
        return (
          <>
          {subcategories?.map((c, index) => (
            <Tag color="cyan" key={index}>
            {c.name}
          </Tag>
          ))}
            </>
          )
      }
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
          <Button type="default">
            <Link to={`/product/${record._id}`}>
              <EditOutlined />
            </Link>
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, [])
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
      <div style={{ float: "left", marginLeft: 20 }}>
        <Title level={4}>
          Бүтээгдэхүүн удирдах
          <Tooltip
            placement="right"
            title="Бүтээгдэхүүн удирдах хэсэг"
          >
            <ExclamationCircleOutlined
              style={{ marginLeft: 8, color: "#ffbb96" }}
            />
          </Tooltip>
        </Title>
      </div>

      <div style={{ float: "right", marginBottom: 20 }}>
        <Button type="primary">
          <Link to="/products/create">Бүтээгдэхүүн нэмэх</Link>
        </Button>
      </div>
    </div>
    <Table
      columns={columns}
      dataSource={data}
      expandable={{ expandedRowRender: record => <SubData record={record} /> }}
      scroll
    />
    </div>
  );
};

export default withRouter(ProductScreen);
