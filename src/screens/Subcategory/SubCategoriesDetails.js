import React, { useState, useEffect } from "react";
import { Table, Space, Button, Popconfirm, Image, Modal, message, Spin, Tag, Typography, Tooltip, Form, Input } from "antd";
import { Link, withRouter } from "react-router-dom";
import { DeleteOutlined, EditOutlined , ExclamationCircleOutlined} from "@ant-design/icons";
import axios from "axios";
import SERVER_SETTINGS from "../../utils/serverSettings";

const { Title } = Typography;
const SubCategoriesDetails = ({ history, match }) => {
  const upData = Object();
  const [data, setData] = useState([]);
  const [category, setCategory] = useState({});
  const [visible, setVisible] = useState(false);

  const fetchCategory = async () => {
    await axios.get(`${SERVER_SETTINGS.getCategories.url}/${match.params.id}`).then(res => setCategory(res.data.data))
  }

  const fetchSubCategories = async () => {
    await axios.get(`${SERVER_SETTINGS.getSubCategories.url}?category=${match.params.id}`).then(res => {
      setData(res.data.data);
    })
  }
  const key = "updatable";
  const handleClick = async (id) => {
    message.loading({ content: "Боловсруулж байна ...", duration: 1 });
    await axios.delete(`${SERVER_SETTINGS.getSubCategories.url}/${id}`)
      .then(res => {
        message.success("Амжилттай устгагдлаа");
        fetchSubCategories();
      })
      .catch(err => message.error("Алдаа гарлаа!"))
  };
  const setEdit = (record) => {
    
  };
  const columns = [
    { 
      title: "Дэд ангилал", 
      dataIndex: "name", 
      key: "name",
      filterMultiple: false,
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
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
            <Link to={`/category/${record._id}/edit`}><EditOutlined /></Link>
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchSubCategories();
    fetchCategory();
  }, [match.params.id])
  const onFinish = async (values) => {
    upData.name = values.name;
    await axios.post(`${SERVER_SETTINGS.getCategories.url}/${match.params.id}/subcategory`, upData)
      .then(res => {
        message.success("Ангилалыг амжилттай нэмлээ");
        fetchSubCategories();
      })
      .catch(err => message.error(err.response.data.error))
  };
  return (
    <div>
    <div style={{ marginBottom: 20 }}>
      <div style={{ float: "left", marginLeft: 20 }}>
        <Title level={4}>
          {category.name}
          <Tooltip
            placement="right"
            title="Дэд ангилал удирдах хэсэг"
          >
            <ExclamationCircleOutlined
              style={{ marginLeft: 8, color: "#ffbb96" }}
            />
          </Tooltip>
        </Title>
      </div>

      <div style={{ float: "right", marginBottom: 20 }}>
        <Button type="primary">
          <Link onClick={() => setVisible(true)}>Дэд Ангилал нэмэх</Link>
        </Button>
      </div>
      <Modal
        title="Дэд ангилал нэмэх"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        >
        <Form
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Дэд ангилалын нэр"
            name="name"
            rules={[
              {
                required: true,
                message: "Дэд ангилалын нэр бичих хэсэг хоосон байна",
              },
            ]}
            tooltip="This is a required field"
          >
            <Input placeholder="Ангилалын нэр" />
          </Form.Item>
          <Form.Item name="category" label="Үндсэн ангилал" required>
           <Input placeholder="Ангилалын нэр" disabled defaultValue={category?.name}/>
          </Form.Item>
          <Form.Item>
            <br />
            <Button type="primary" htmlType="submit">
              Хадгалах
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
      <Table
        columns={columns}
        dataSource={data}
        scroll
      />
  </div>
  );
};

export default withRouter(SubCategoriesDetails);

