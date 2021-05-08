import { message, Modal } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import PhotoUploads from '../../components/PhotoUploads';
import SERVER_SETTINGS from '../../utils/serverSettings';

const  ProductImageModal = ({ visible, setVisible, current }) => {
  const [ images, setImages ] = useState([]);
  const [ deleteImage, setDeleteImage ] = useState(null);
  const [ uploads, setUploads ] = useState([]);
  const fetchImages = () => {
    axios.get(`${SERVER_SETTINGS.getProdcuts.url}/${current}`).then((res) => {
      setImages(res.data.data.images);
    })
  }

  const deleteProductImage = () => {
    axios.delete(`${SERVER_SETTINGS.getProdcuts.url}/${current}/photos`, { data: { image: deleteImage } } ).then((res) => {
      fetchImages();
      setDeleteImage(null);
      message.success("Зургийг ажилттай устгалаа");
    })
  }

  useEffect(() => {
   fetchImages();
  }, [current])

  useEffect(() => {
    if(deleteImage) {
      deleteProductImage();
    }
   }, [setDeleteImage, deleteImage])

  const uploadImageServer = () => {
    const formData = new FormData();
    uploads?.map(up => {
      formData.append("files", up.originFileObj );
    });
    axios.put(`${SERVER_SETTINGS.getProdcuts.url}/${current}/photos`, formData).then(res => {
      fetchImages();
      message.success("Зургийг ажилттай хуулж дууслаа");
    })
  }
    return (
      <>
        <Modal
          width={700}
          title="Бүтээгдэхүүний зураг удирдах хэсэг"
          style={{ top: 20 }}
          visible={visible}
          onOk={uploadImageServer}
          onCancel={() => {
            setUploads([]);
            setVisible(false);
          }}
        >
        <PhotoUploads images={images} setImages={setImages} setDeleteImage={setDeleteImage} setUploads={setUploads} />
        </Modal>
      </>
    );
}

export default ProductImageModal;