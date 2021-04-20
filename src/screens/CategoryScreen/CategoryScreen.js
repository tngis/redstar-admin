import React, { useState, useEffect } from "react";
import { Table, Space, Button, Popconfirm, Image, Modal, message, Spin, Tag, Typography, Tooltip, Form, Input } from "antd";
import { Link, withRouter } from "react-router-dom";
import { DeleteOutlined, EditOutlined , ExclamationCircleOutlined} from "@ant-design/icons";
import axios from "axios";
import SERVER_SETTINGS from "../../utils/serverSettings";
import PhotoUpload from '../../components/PhotoUpload';

const { Title } = Typography;
const NewsDetailList = ({ history }) => {
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const fetchCategories = async () => {
    await axios.get(SERVER_SETTINGS.getCategories.url).then(res => {
      setData(res.data.data);
      setLoading(false);
    })
  }
  const key = "updatable";
  const handleClick = async (id) => {
    message.loading({ content: "Боловсруулж байна ...", duration: 1 });
    await axios.delete(`${SERVER_SETTINGS.getCategories.url}/${id}`)
      .then(res => {
        message.success("Амжилттай устгагдлаа");
        fetchCategories();
      })
      .catch(err => message.error("Алдаа гарлаа!"))
  };
  const setEdit = (record) => {
    
  };
  const columns = [
    { 
      title: "Ангилал", 
      dataIndex: "name", 
      key: "name",
      filterMultiple: false,
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Салбар ангилалууд",
      dataIndex: "subcategories",
      key: "subcategories",
      render: (subcategories) => (
        subcategories.map(category => (
          <Link>
            <Tag color="blue" key={category?.key}>
              {category?.name}
            </Tag>
          </Link>
        ))
      ),
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
      ),
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
    fetchCategories();
  }, [])
  const onFinish = async (values) => {
    await axios.post(SERVER_SETTINGS.getCategories.url, values)
      .then(async (res) => {
        const { id } = res.data.data;
        setVisible(false);
        if (image) {
          message.loading({
            content: "Зургийг хуулж байна ... ",
            duration: 2,
          });
          const formData = new FormData();
          formData.append("file", image);
          await axios.put(`${SERVER_SETTINGS.getCategories.url}/${id}/photo`, formData)
            .then(res => {
              message.success("Ангилалыг амжилттай нэмлээ");
              fetchCategories();
            })
            .catch(err => message.error(err.response.data.error))

        } else {
          message.success("Ангилалыг амжилттай нэмлээ");
          fetchCategories();
        }
      })
      .catch(err => message.error(err.response.data.error))
  };
  return (
    <div>
    <div style={{ marginBottom: 20 }}>
      <div style={{ float: "left", marginLeft: 20 }}>
        <Title level={4}>
          Ангилал удирдах хэсэг
          <Tooltip
            placement="right"
            title="Ангилал удирдах хэсэг"
          >
            <ExclamationCircleOutlined
              style={{ marginLeft: 8, color: "#ffbb96" }}
            />
          </Tooltip>
        </Title>
      </div>

      <div style={{ float: "right", marginBottom: 20 }}>
        <Button type="primary">
          <Link onClick={() => setVisible(true)}>Ангилал нэмэх</Link>
        </Button>
      </div>
      <Modal
        title="Ангилал нэмэх"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        >
        <Form
          layout="vertical"
          onFinish={onFinish}
          ref={form}
        >
          <Form.Item
            label="Ангилалын нэр"
            name="name"
            rules={[
              {
                required: true,
                message: "Ангилалын нэр бичих хэсэг хоосон байна",
              },
            ]}
            tooltip="This is a required field"
          >
            <Input placeholder="Ангилалын нэр" />
          </Form.Item>
          <PhotoUpload setImage={setImage} />
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

export default withRouter(NewsDetailList);
