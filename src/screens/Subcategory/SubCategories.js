import React, { useEffect, useState } from "react";
import { Input, Form, Button, message, Switch } from 'antd'
import { withRouter } from "react-router-dom";
import { isEmpty, isNull } from "../../validation";
import axios from "axios";
import SERVER_SETTINGS from "../../utils/serverSettings";

const SubCategories = ({ match, history }) => {
  let upData = new Object();
  const [current, setCurrent] = useState(null);
  const fetchSubCategories = async (id) => {
    await axios.get(`${SERVER_SETTINGS.getSubCategories.url}/${id}`)
      .then(res => setCurrent(res.data.data))
  }

  useEffect(() => {
    fetchSubCategories(match.params.id);
  }, [match]);

  const [form] = Form.useForm();
  const onFinish = async (values) => {
    if (isEmpty(values.name)) {
      message.error("Дэд ангилалын нэр оруулах хэсэг хоосон байна");
      return false;
    }
    if (!isNull(values.name)) {
      upData.name = values.name;
    } else {
      upData.name = current.name;
    }

    if (!isNull(values.switch)) {
      upData.status = values.switch ? 'published' : 'draft';
    } else {
      upData.status = current.status;
    }

    await axios.put(`${SERVER_SETTINGS.getSubCategories.url}/${match.params.id}`, upData).then(res => {
      message.success("Амжилттай шинэчлэл хийлээ");
      const { category } = res.data.data;
      history.push(`/category/${category}/subcategories`);
    })
  };

  return current &&
    (
    
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item label="Дэд ангилалын нэр" name="name" tooltip="This is a required field">
          <Input
            placeholder="Дэд ангилалын нэр"
            defaultValue={current.name}
          />
        </Form.Item>
        <Form.Item name="switch" label="Төлөв">
        <Switch defaultChecked={ current.status === 'published'} checkedChildren="нийтлэх" unCheckedChildren="нуух"/>
      </Form.Item>
        <Form.Item>
          <br />
          <Button type="primary" htmlType="submit">
            Шинэчлэх
          </Button>
        </Form.Item>
        
      </Form>
  );
};
export default withRouter(SubCategories);
