import React, { useEffect, useState } from "react";
import { Input, Form, Button, message, Switch } from 'antd'
import { withRouter } from "react-router-dom";
import { isEmpty, isNull } from "../../validation";
import axios from "axios";
import SERVER_SETTINGS from "../../utils/serverSettings";

const CategoryEdit = ({ match, history }) => {
  let upData = new Object();
  const [current, setCurrent] = useState(null);
  const fetchCategory = async (id) => {
    await axios.get(`${SERVER_SETTINGS.getCategories.url}/${id}`)
      .then(res => setCurrent(res.data.data))
  }

  useEffect(() => {
    fetchCategory(match.params.id);
  }, [match]);
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    if (isEmpty(values.name)) {
      message.error("Гарчиг оруулах хэсэг хоосон байна");
      return false;
    }
    if (!isNull(values.name)) {
      upData.name = values.name;
    } else {
      upData.name = current.name;
    }
    if (!isNull(values.title)) {
      upData.title = values.title;
    } else {
      upData.title = current.title;
    }

    if (!isNull(values.switch)) {
      upData.status = values.switch ? 'published' : 'draft';
    } else {
      upData.status = current.status;
    }

    axios.put(`${SERVER_SETTINGS.getCategories.url}/${match.params.id}`, upData).then(res => {
      message.success("Амжилттай шинэчлэл хийлээ");
      history.push("/categories");
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return current &&
    (
    
      <Form
        form={form}
        layout="vertical"
        onFinishFailed={onFinishFailed}
        onFinish={onFinish}
      >
        <Form.Item label="Ангилал нэр" name="name" tooltip="This is a required field">
          <Input
            placeholder="Гарчиг"
            defaultValue={current.name}
          />
        </Form.Item>
        <Form.Item label="Ангилал тайлбар" name="title" tooltip="This is a required field">
          <Input
            placeholder="Гарчиг"
            defaultValue={current.title}
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
export default withRouter(CategoryEdit);
