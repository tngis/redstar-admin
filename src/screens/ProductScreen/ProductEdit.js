import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, InputNumber, Select, message } from 'antd';
import { useParams, withRouter } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { isEmpty, isNull } from '../../validation'
import PhotoUpload from "../../components/PhotoUpload";
import axios from 'axios';
import SERVER_SETTINGS from '../../utils/serverSettings';

const { Option } = Select;
const ProductEdit = ({ history }) => {
  let upData = new Object();
  const { productId } = useParams();
  const [current, setCurrent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [form] = Form.useForm();
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState(null);
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
  const fetchSubcategories = async (value) => {
    if(value) {
      await axios.get(`${SERVER_SETTINGS.getSubCategories.url}?category=${value}`)
      .then(res => setSubCategories(res.data.data))
    }
  }
  useEffect(async () => {
    fetchCategories();
    fetchSectors();
    await axios.get(`${SERVER_SETTINGS.getProdcuts.url}/${productId}`)
    .then((res) => {
      setCurrent(res.data.data);
      fetchSubcategories(res.data.data?.category?.id);
    })
  }, [productId, setCurrent])

  const onFinish = async (values) => {
    values.status = values.status === true ? 'published' : 'draft';
    if (isEmpty(values.code)) {
      message.error("Код оруулах хэсэг хоосон байна");
      return false;
    }
    if (isEmpty(values.name)) {
      message.error("Нэр оруулах хэсэг хоосон байна");
      return false;
    }
    if (isEmpty(values.price)) {
      message.error("Үнэ оруулах хэсэг хоосон байна");
      return false;
    }
    if (isEmpty(values.size)) {
      message.error("Хэмжээ оруулах хэсэг хоосон байна");
      return false;
    }
    if (isEmpty(values.age_star) || isEmpty(values.age_end)) {
      message.error("Нас оруулах хэсэг хоосон байна");
      return false;
    }
    if(!desc) {
      values.description = current.description;
    }else {
      values.description = desc;
    }
    Object.keys(values).map((value) => {
      if (!isNull(values[value])) {
        upData[value] = values[value];
      }
    })
    axios.put(`${SERVER_SETTINGS.getProdcuts.url}/${productId}`, upData).then( async res => {
      if(image) {
        message.loading({
          content: "Зургийг хуулж байна ... ",
          duration: 2,
        });
      const formData = new FormData();
      formData.append("file", image);
       await axios.put(`${SERVER_SETTINGS.getProdcuts.url}/${productId}/photo`, formData).then(res => {
          message.success("Бүтээгдэхүүний мэдээллийг шинэчлэл хийлээ");
          history.push("/products");
        })
      }else {
        message.success("Бүтээгдэхүүний мэдээллийг шинэчлэл хийлээ");
        history.push("/products");
      }
    })
  }
  return current && ( 
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
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
        name="subcategories"
        label="Дэд ангилал"
      >
        <Select mode="multiple" placeholder="Дэд ангилал" defaultValue={current?.subcategories.map(sub => sub.id)}>
          {subcategories.map(sub => (
            <Option value={sub?.id}>{sub?.name}</Option>
          ))}
        </Select>
      </Form.Item>
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
        label="Тайлбар">
        <CKEditor
          editor={ ClassicEditor }
          data={current?.description}
          onChange={ ( event, editor ) => {
            const data = editor.getData();
            setDesc(data);
          }}
        />
      </Form.Item>
      <Form.Item label="Насны хязгаар">
        <Input.Group style={{ display: 'flex' }} >
        <Form.Item name="age_star">
           <InputNumber style={{ width: 100, textAlign: 'center' }} defaultValue={current?.age_star} placeholder="Minimum" />
        </Form.Item>
        <Form.Item>
                <Input
          className="site-input-split"
          style={{
            width: 42,
            borderLeft: 0,
            borderRight: 0,
            pointerEvents: 'none',
          }}
          placeholder="-->"
          disabled
        />
        </Form.Item>
        <Form.Item name="age_end">
          <InputNumber
            className="site-input-right"
            style={{
              width: 100,
              textAlign: 'center',
            }}
            placeholder="Maximum"
            defaultValue={current?.age_end}
          />
        </Form.Item>
      </Input.Group>
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
        name="status"
        label="Төлөв"
      >
        <Switch defaultChecked={false} checkedChildren="нийтлэх" unCheckedChildren="нуух"/>
      </Form.Item>
      <Form.Item
        name="sectors"
        label="Худалдаж байгаа салбар"
      >
        <Select mode="multiple" placeholder="Бүтээгдэхүүний салбар" defaultValue={current?.sectors?.map(sector => sector.id)}>
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