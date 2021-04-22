import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, InputNumber, Select, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import SERVER_SETTINGS from '../../utils/serverSettings';
import PhotoUpload from '../../components/PhotoUpload';
const { Option } = Select;
const ProductCreate = ({ history }) => {
  const [categories, setCategories] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [image, setImage] = useState(null);
  const [subcategories, setSubCategories] = useState([]);
  const [form] = Form.useForm();
  const onCategoryChange = (value) => {
    axios.get(`${SERVER_SETTINGS.getSubCategories.url}?category=${value}`)
      .then(res => setSubCategories(res.data.data))
  }
  const fetchCategories = () => {
    axios.get(SERVER_SETTINGS.getCategories.url).then(res => setCategories(res.data.data));
  }
  const fetchSectors = () => {
    axios.get(SERVER_SETTINGS.getSectors.url).then(res => setSectors(res.data.data));
  }
  useEffect(() => {
    fetchCategories();
    fetchSectors();
  }, [])

  const onFinish = async (values) => {
    values.status = values.status === true ? 'published' : 'draft';
    await axios.post(`${SERVER_SETTINGS.getCategories.url}/${values.category}/products`, values)
    .then(async (res) => {
      const { id } = res.data.data;
      if (image) {
        message.loading({
          content: "Зургийг хуулж байна ... ",
          duration: 2,
        });
        const formData = new FormData();
        formData.append("file", image);
        await axios.put(`${SERVER_SETTINGS.getProdcuts.url}/${id}/photo`, formData)
          .then(res => {
            history.push('/products');
            message.success("Бүтээгдэхүүнийг амжилттай нэмлээ");
          })
          .catch(err => message.error(err.response.data.error))
      } else {
        history.push('/products');
        message.success("Бүтээгдэхүүнийг амжилттай нэмлээ");
      }
    }).catch(err => message.error(err.response.data.error))
  }
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="category"
        label="Ангилал"
        rules={[
          {
            required: true,
            message: 'Ангилалыг сонгоно уу',
          },
        ]}
      >
        <Select placeholder="Бүтээгдэхүүний ангилал" onChange={onCategoryChange}>
          { categories.map(category => (
            <Option value={category?.id}>{category?.name}</Option>
          )) }
        </Select>
      </Form.Item>
      <Form.Item
        name="subcategories"
        label="Дэд ангилал"
        rules={[
          {
            required: true,
            message: 'Дэд ангилалыг оруулан уу',
            type: 'array',
          },
        ]}
      >
        <Select mode="multiple" placeholder="Дэд ангилал">
          {subcategories.map(sub => (
            <Option value={sub?.id}>{sub?.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item 
        label="Бүтээгдэхүүний код" 
        name="code"
        required 
        rules={[
          {
            required: true,
            message: 'Бүтээгдэхүүний кодыг оруулна уу',
          },
        ]}
        >
        <Input placeholder="Код" />
      </Form.Item>
      <Form.Item
        label="Бүтээгдэхүүний нэр"
        name="name"
        required
        rules={[
          {
            required: true,
            message: 'Бүтээгдэхүүний нэрийг оруулна уу',
          },
        ]}
      >
        <Input placeholder="нэр" />
      </Form.Item>
      <Form.Item 
        label="Тайлбар"      
        rules={[
          {
            required: true,
            message: 'Ангилалыг сонгоно уу',
          },
        ]}>
        <CKEditor
          editor={ ClassicEditor }
          data="<p></p>"
          onChange={ ( event, editor ) => {
            const data = editor.getData();
        } }
        />
      </Form.Item>
      <Form.Item label="Хэмжээ" name="size"         
        rules={[
          {
            required: true,
            message: 'Хэмжээг оруулана уу',
          },
        ]}>
        <Input placeholder="Бүтээгдэхүүний хэмжээ" />
      </Form.Item>
      <Form.Item label="Тоо ширхэг" name="count" required>
        <Input placeholder="Бүтээгдэхүүний тоо ширхэг" />
      </Form.Item>
      <Form.Item label="Үнэ" name="price" required rules={[
          {
            required: true,
            message: 'Үнийг оруулан уу',
          },
        ]}>
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        name="status"
        label="Төлөв"
      >
        <Switch defaultChecked={false} checkedChildren="нийтлэх" unCheckedChildren="нуух"/>
      </Form.Item>
      <Form.Item
        name="sectors"
        label="Худалдаж байгаа салбар"
      >
        <Select mode="multiple" placeholder="Бүтээгдэхүүний салбар">
          { sectors.map(sector => (
            <Option value={sector?.id}>{sector?.name}</Option>
          )) }
        </Select>
      </Form.Item>
      <PhotoUpload setImage={setImage} />
      <Form.Item>
        <Button htmlType="submit" type="primary">Хадгалах</Button>
      </Form.Item>
    </Form>
  );
};

export default withRouter(ProductCreate);