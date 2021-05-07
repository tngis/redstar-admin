import { Modal } from 'antd';
import React from 'react';
import PhotosUpload from '../../components/PhotosUpload';

const  ProductImageModal = ({ visible, setVisible, current }) => {
    return (
      <>
        <Modal
          title="Бүтээгдэхүүний зураг удирдах хэсэг"
          style={{ top: 20 }}
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
        >
        <PhotosUpload/>
        </Modal>
      </>
    );
}

export default ProductImageModal;