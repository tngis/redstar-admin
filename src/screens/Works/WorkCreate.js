import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, message, DatePicker } from 'antd';
import { withRouter } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import SERVER_SETTINGS from '../../utils/serverSettings';
import PhotoUpload from '../../components/PhotoUpload';

const IntroCreate = ({ history }) => {
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState("");
  useEffect(() => {
  }, [])

  const onFinish = async (values) => {
    values.status = values.status === true ? 'published' : 'draft';
    values.date = values.date.format('YYYY-MM-DD');
    values.description = desc;
    await axios.post(SERVER_SETTINGS.getWorks.url, values)
    .then(async (res) => {
      const { id } = res.data.data;
      if (image) {
        message.loading({
          content: "Зургийг хуулж байна ... ",
          duration: 2,
        });
        const formData = new FormData();
        formData.append("file", image);
        await axios.put(`${SERVER_SETTINGS.getWorks.url}/${id}/photo`, formData)
          .then(res => {
            history.push('/works');
            message.success("Хийгдсэн ажилыг амжилттай нэмлээ");
          })
          .catch(err => message.error(err.response.data.error))
      } else {
        history.push('/works');
        message.success("Хийгдсэн ажилыг амжилттай нэмлээ");
      }
    }).catch(err => message.error(err.response.data.error))
  }
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item 
        label="Гарчиг" 
        name="title"
        required 
        rules={[
          {
            required: true,
            message: 'Гарчиг оруулна уу',
          },
        ]}
        >
        <Input placeholder="Гарчиг" />
      </Form.Item>
      <Form.Item
         label="Огноо" 
         name="date"
         rules={[
          {
            required: true,
            message: 'Огноо сонгоно уу',
          },
        ]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item 
        label="Тайлбар"      
        name="description"
        >
        <CKEditor
          editor={ ClassicEditor }
          data="<p></p>"
          onChange={ ( event, editor ) => {
            const data = editor.getData();
            setDesc(data);
        }}
        />
      </Form.Item>
      <Form.Item
        name="status"
        label="Төлөв"
      >
        <Switch defaultChecked={false} checkedChildren="нийтлэх" unCheckedChildren="нуух"/>
      </Form.Item>
      <PhotoUpload setImage={setImage} />
      <Form.Item>
        <Button htmlType="submit" type="primary">Хадгалах</Button>
      </Form.Item>
    </Form>
  );
};

export default withRouter(IntroCreate);