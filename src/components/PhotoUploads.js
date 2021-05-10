import React from "react";
import { Upload, Modal, Image, Popconfirm, Button } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import SERVER_SETTINGS from "../utils/serverSettings";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

class PhotosUpload extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
    currentImages: null,
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
    this.props.setUploads(fileList);
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Зураг оруулах</div>
      </div>
    );
    return (
      <>
         {this.props.images.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {this.props.images?.map(image => (
                <div style={{ padding: 10 }}>
                <Image
                  width={105}
                  height={90}
                  src={`${SERVER_SETTINGS.apiUrl}/${image}`}
                />
                 <div style={{ position: "relative", top: -100, left: 85 }}>
                    <Popconfirm
                      title="Устгахдаа итгэлтэй байна уу?"
                      onConfirm={() => this.props.setDeleteImage(image)}
                    >
                      <Button
                        type="primary"
                        size={3}
                        danger
                        shape="circle"
                        icon={<CloseOutlined />}
                      />
                    </Popconfirm>
                  </div>
                </div>
              ))}
          </div>
        ): ""}
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

export default PhotosUpload;