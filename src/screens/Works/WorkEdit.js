import React, { useEffect, useState } from "react";
import { Input, Form, Button, message, Switch, DatePicker } from 'antd'
import moment from 'moment';
import { withRouter } from "react-router-dom";
import { isEmpty, isNull } from "../../validation";
import axios from "axios";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PhotoUpload from "../../components/PhotoUpload";
import SERVER_SETTINGS from "../../utils/serverSettings";
const WorkEdit = ({ match, history }) => {
  let upData = new Object();
  const [current, setCurrent] = useState(null);
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState(null);
  const fetchWorks = async (id) => {
    await axios.get(`${SERVER_SETTINGS.getWorks.url}/${id}`)
      .then(res => setCurrent(res.data.data))
  }

  useEffect(() => {
    fetchWorks(match.params.id);
  }, [match]);

  const dateFormat = 'YYYY-MM-DD';
  const onFinish = async (values) => {
    if (isEmpty(values.title)) {
      message.error("Гарчиг оруулах хэсэг хоосон байна");
      return false;
    }
    if(!desc) {
      upData.description = current.description;
    }else {
      upData.description = desc;
    }
    if (!isNull(values.title)) {
      upData.title = values.title;
    } else {
      upData.title = current.title;
    }
    if (!isNull(values.date)) {
      upData.date = values.date;
    } else {
      upData.date = current.date;
    }

    if (!isNull(values.switch)) {
      upData.status = values.switch ? 'published' : 'draft';
    } else {
      upData.status = current.status;
    }
    axios.put(`${SERVER_SETTINGS.getWorks.url}/${match.params.id}`, upData).then(async () => {
      if(image) {
        const formData = new FormData();
        formData.append("file", image);
        await axios.put(`${SERVER_SETTINGS.getIntros.url}/${match.params.id}/photo`, formData).then(res => {
          message.success("Мэдээлэл шинэчлэл хийлээ");
          history.push("/works");
          })
      }else {
        message.success("Мэдээлэл шинэчлэл хийлээ");
        history.push("/works");
      }
    })

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return current &&
    (
    
      <Form
        layout="vertical"
        onFinishFailed={onFinishFailed}
        onFinish={onFinish}
      >
        <Form.Item label="Гарчиг" name="title" tooltip="This is a required field">
          <Input
            placeholder="Гарчиг"
            defaultValue={current.title}
          />
        </Form.Item>
        <Form.Item
         label="Хамаарал" 
         name="date"
      >
        <DatePicker format={dateFormat} defaultValue={moment(current.date, dateFormat)}/>
      </Form.Item>
        <Form.Item label="Тайлбар" name="description" tooltip="This is a required field">
          <CKEditor
          editor={ ClassicEditor }
          data={current?.description}
          onChange={ ( event, editor ) => {
            const data = editor.getData();
            setDesc(data);
          }} />
        </Form.Item>
        <Form.Item name="switch" label="Төлөв">
        <Switch defaultChecked={ current.status === 'published'} checkedChildren="нийтлэх" unCheckedChildren="нуух"/>
      </Form.Item>
      <PhotoUpload image={image || current?.image} setImage={setImage} />
        <Form.Item>
          <br />
          <Button type="primary" htmlType="submit">
            Шинэчлэх
          </Button>
        </Form.Item>
        
      </Form>
  );
};
export default withRouter(WorkEdit);
