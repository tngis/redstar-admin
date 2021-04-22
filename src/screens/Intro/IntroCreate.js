import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, Select, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import SERVER_SETTINGS from '../../utils/serverSettings';
import PhotoUpload from '../../components/PhotoUpload';
const { Option } = Select;

export const introType = [{value: "intro", name: "Танилцуулга"}, { value: "goal", name: "Зорилго" }, { value: "requirement", name: "Шаардлага" }];
const IntroCreate = ({ history }) => {
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState("");
  useEffect(() => {
  }, [])

  const onFinish = async (values) => {
    values.status = values.status === true ? 'published' : 'draft';
    values.description = desc;
    await axios.post(SERVER_SETTINGS.getIntros.url, values)
    .then(async (res) => {
      const { id } = res.data.data;
      if (image) {
        message.loading({
          content: "Зургийг хуулж байна ... ",
          duration: 2,
        });
        const formData = new FormData();
        formData.append("file", image);
        await axios.put(`${SERVER_SETTINGS.getIntros.url}/${id}/photo`, formData)
          .then(res => {
            history.push('/intros');
            message.success("Мэдээлэл амжилттай нэмлээ");
          })
          .catch(err => message.error(err.response.data.error))
      } else {
        history.push('/intros');
        message.success("Мэдээлэл амжилттай нэмлээ");
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
         label="Хамаарал" 
         name="type"
         rules={[
          {
            required: true,
            message: 'Хамааралыг сонгоно уу',
          },
        ]}
      >
        <Select style={{ width: 250 }}>
          {introType.map(intro => (
            <Option key={intro.value} value={intro.value}>{intro.name}</Option>
          ))}
        </Select>
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