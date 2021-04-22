import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Tooltip, Table,Typography, Space, Button, Popconfirm, InputNumber, message, Input, Tag, Modal, Form } from "antd";
import { withRouter } from "react-router-dom";
import { DeleteOutlined, EditOutlined , ExclamationCircleOutlined} from "@ant-design/icons";
import axios from "axios";
import SERVER_SETTINGS from "../../utils/serverSettings";
const { Title } = Typography;
const SectorScreen = ({ history }) => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    await axios.post(SERVER_SETTINGS.getSectors.url, values)
      .then(() => {
        setVisible(false);
        message.success("Салбар амжилттай нэмлээ");
        fetchSectors();
      })
      .catch(err => message.error(err.response.data.error))
  };
  const fetchSectors = async () => {
    await axios.get(SERVER_SETTINGS.getSectors.url).then(res => setData(res.data.data))
  }

  const handleClick = async (id) => {
    message.loading({ content: "Боловсруулж байна ...", duration: 1 });
    await axios.delete(`${SERVER_SETTINGS.getSectors.url}/${id}`)
      .then(() => {
        message.success("Салбар амжилттай устагдлаа");
        fetchSectors();
      })
      .catch(() => message.error("Амжилтгүй боллоо"))
  };
  const setEdit = (record) => {
    
  };
  const columns = [
    { 
      title: "Нэр", 
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
          <Button onClick={() =>  history.push(`/sector/${record._id}/edit`)} type="default">
            <EditOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchSectors();
  }, [])
  return (
    <div>
    <div style={{ marginBottom: 20 }}>
    <div style={{ float: "left", marginLeft: 20 }}>
      <Title level={4}>
        Салбар удирдах
        <Tooltip
          placement="right"
          title="Салбар удирдах хэсэг"
        >
          <ExclamationCircleOutlined
            style={{ marginLeft: 8, color: "#ffbb96" }}
          />
        </Tooltip>
      </Title>
    </div>

    <div style={{ float: "right", marginBottom: 20 }}>
      <Button type="primary">
        <Link onClick={() => setVisible(true)}>Салбар нэмэх</Link>
      </Button>
    </div>
    <Modal
        title="Салбар нэмэх"
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
            label="Салбарын нэр"
            name="name"
            rules={[
              {
                required: true,
                message: "Салбарын нэр бичих хэсэг хоосон байна",
              },
            ]}
            tooltip="Заавар оруулах"
          >
            <Input placeholder="Салбарын нэр" />
          </Form.Item>
          <Form.Item
            label="Хаяг"
            name="address"
            rules={[
              {
                required: true,
                message: "Хаяг бичих хэсэг хоосон байна",
              },
            ]}
            tooltip="Заавар оруулах"
          >
            <Input placeholder="Хаяг" />
          </Form.Item>
          <Form.Item label="Утасны дугаар" name="phoneNumber" rules={[
              {
                required: true,
                message: 'Утасны дугаар аа оруулан уу',
              },
            ]}>
            <InputNumber min={0} style={{ width: 200 }} />
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

export default withRouter(SectorScreen);
