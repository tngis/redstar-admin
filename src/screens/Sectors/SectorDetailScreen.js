import React, { useState, useEffect } from "react";
import { Button, InputNumber, Input, Form, Switch, message} from "antd";
import { isEmpty, isNull } from '../../validation';
import { withRouter, useParams } from "react-router-dom";
import axios from "axios";
import SERVER_SETTINGS from "../../utils/serverSettings";

const SectorDetailScreen = ({ history }) => {
  const { id } = useParams();
  const [current, setCurrent] = useState(null);
  let upData = new Object();
  const onFinish = async (values) => {
    if (isEmpty(values.name)) {
      message.error("Гарчиг оруулах хэсэг хоосон байна");
      return false;
    }
    if (isEmpty(values.email)) {
      message.error("Майл хаяг оруулах хэсэг хоосон байна");
      return false;
    }
    if (!isNull(values.name)) {
      upData.name = values.name;
    } else {
      upData.name = current.name;
    }
    if (!isNull(values.email)) {
      upData.email = values.email;
    } else {
      upData.email = current.email;
    }
    if (!isNull(values.phoneNumber)) {
      upData.phoneNumber = values.phoneNumber;
    } else {
      upData.phoneNumber = current.phoneNumber;
    }
    if (!isNull(values.address)) {
      upData.address = values.address;
    } else {
      upData.address = current.address;
    }

    if (!isNull(values.status)) {
      upData.status = values.status ? 'published' : 'draft';
    } else {
      upData.status = current.status;
    }

    axios.put(`${SERVER_SETTINGS.getSectors.url}/${id}`, upData).then(res => {
      message.success("Амжилттай шинэчлэл хийлээ");
      history.push("/sectors");
    })
  };
  const fetchSectors = async (sectorId) => {
    await axios.get(`${SERVER_SETTINGS.getSectors.url}/${sectorId}`)
      .then(res => setCurrent(res.data.data))
  }

  useEffect(() => {
    fetchSectors(id);
  }, [id])
  return current && (
    <div>
      <Form
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="Салбарын нэр"
        name="name"
        tooltip="Заавар оруулах"
      >
        <Input placeholder="Салбарын нэр" defaultValue={current?.name} />
      </Form.Item>
      <Form.Item
        label="И-майл"
        name="email"
        tooltip="Заавар оруулах"
      >
        <Input placeholder="И-майл" defaultValue={current?.email} />
      </Form.Item>
      <Form.Item
        label="Хаяг"
        name="address"
        tooltip="Заавар оруулах"
      >
        <Input placeholder="Хаяг" defaultValue={current?.address} />
      </Form.Item>
      <Form.Item label="Утасны дугаар" name="phoneNumber" >
        <InputNumber min={0} style={{ width: 200 }} defaultValue={current?.phoneNumber} />
      </Form.Item>
      <Form.Item
        name="status"
        label="Төлөв"
      >
      <Switch defaultChecked={ current.status === 'published'} checkedChildren="нийтлэх" unCheckedChildren="нуух"/>
      </Form.Item>
      <Form.Item>
        <br />
        <Button type="primary" htmlType="submit">
          Хадгалах
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default withRouter(SectorDetailScreen);
