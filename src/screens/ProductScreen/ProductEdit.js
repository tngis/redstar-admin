import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, InputNumber, Select, message } from 'antd';
import { useParams, withRouter } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import PhotoUpload from "../../components/PhotoUpload";
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
  const [image, setImage] = useState(null);
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
    values.status = values.status === true ? 'published' : 'draft';
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
        >
        <Input placeholder="Код" defaultValue={current?.code} />
      </Form.Item>
      <Form.Item
        label="Бүтээгдэхүүний нэр"
        name="name"
        required
      >
        <Input placeholder="нэр" defaultValue={current?.name} />
      </Form.Item>
      <Form.Item
        name="category"
        label="Ангилал"
      >
        <Select placeholder="Бүтээгдэхүүний ангилал" onChange={onCategoryChange} defaultValue={current?.category?.name} >
          { categories.map(category => (
            <Option value={category?.id}>{category?.name}</Option>
          )) }
        </Select>
      </Form.Item>
      <Form.Item 
        label="Тайлбар">
        <CKEditor
          editor={ ClassicEditor }
          data="<p></p>"
          onChange={ ( event, editor ) => {
            const data = editor.getData();

        } }
        />
      </Form.Item>
      <Form.Item label="Хэмжээ" name="size" >
        <Input placeholder="Бүтээгдэхүүний хэмжээ" defaultValue={current?.size}/>
      </Form.Item>
      <Form.Item label="Тоо ширхэг" name="count" required>
        <Input placeholder="Бүтээгдэхүүний тоо ширхэг" defaultValue={current?.count} />
      </Form.Item>
      <Form.Item label="Үнэ" name="price">
        <InputNumber min={0} defaultValue={current?.price} />
      </Form.Item>
      <Form.Item
        name="subcategories"
        label="Дэд ангилал"
      >
        <Select mode="multiple" placeholder="Дэд ангилал" defaultValue={current?.subcategories.map(sub => sub.name)}>
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
        <Select mode="multiple" placeholder="Бүтээгдэхүүний салбар" defaultValue={current?.sectors}>
          { sectors.map(sector => (
            <Option value={sector?.id}>{sector?.name}</Option>
          )) }
        </Select>
      </Form.Item>
      <PhotoUpload image={image || current?.thumbnail} setImage={setImage} />
      <Form.Item>
        <Button htmlType="submit" type="primary">Хадгалах</Button>
      </Form.Item>
    </Form>
  );
};

export default withRouter(ProductEdit);