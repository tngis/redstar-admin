import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, InputNumber, Select, message } from 'antd';
import { useParams, withRouter } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import SERVER_SETTINGS from '../../utils/serverSettings';

const { Option } = Select;
const ProductEdit = ({ history }) => {
  const { productId } = useParams();
  const [current, setCurrent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sectors, setSectors] = useState([]);
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
  useEffect(async () => {
    fetchCategories();
    fetchSectors();
    await axios.get(`${SERVER_SETTINGS.getProdcuts.url}/${productId}`)
    .then((res) => setCurrent(res.data.data))
  }, [productId, setCurrent])

  const onFinish = async (values) => {
    console.log(values.subcategories);
    values.status = values.status === true ? 'published' : 'draft';
    await axios.post(`${SERVER_SETTINGS.getCategories.url}/${values.category}/products`, values)
      .then(res => {
        message.success("Амжилттай нэмэгдлээ:)");
        history.push("/products");
      })
      .catch(err => message.error(err.response.data.error))
  }
  return current && ( 
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
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
        <Input placeholder="Код" defaultValue={current?.code} />
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
        <Input placeholder="нэр" defaultValue={current?.name} />
      </Form.Item>
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
        <Select placeholder="Бүтээгдэхүүний ангилал" onChange={onCategoryChange} defaultValue={current?.category?.name} >
          { categories.map(category => (
            <Option value={category?.id}>{category?.name}</Option>
          )) }
        </Select>
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
            console.log( { data } );
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
        <Input placeholder="Бүтээгдэхүүний хэмжээ" defaultValue={current?.size}/>
      </Form.Item>
      <Form.Item label="Тоо ширхэг" name="count" required>
        <Input placeholder="Бүтээгдэхүүний тоо ширхэг" defaultValue={current?.count} />
      </Form.Item>
      <Form.Item label="Үнэ" name="price" required rules={[
          {
            required: true,
            message: 'Үнийг оруулан уу',
          },
        ]}>
        <InputNumber min={0} defaultValue={current?.price} />
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
      <Form.Item>
        <Button htmlType="submit" type="primary">Хадгалах</Button>
      </Form.Item>
    </Form>
  );
};

export default withRouter(ProductEdit);