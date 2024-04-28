import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import { UploadFile } from 'antd/lib';
import { RcFile, UploadProps } from 'antd/lib/upload';
import { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import { message } from 'antd';
import React from 'react';

const UploadFiles = ({ fileList, setFileList, useCrop, multiple }: any) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const messageAlert = (
    textValue: string,
    type: 'success' | 'error',
    duration = 2
  ) => {
    type === 'success'
      ? message.success(textValue, duration)
      : message.error(textValue);
  };
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
    );
  };
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <div>
      {useCrop && !multiple ? (
        <ImgCrop
          showGrid
          rotationSlider
          beforeCrop={(file: any) => {
            const isPNG =
              file.type === 'image/png' ||
              file.type === 'image/jpeg' ||
              file.type === 'image/jpg' ||
              file.type === 'image/gif';
            if (!isPNG) {
              messageAlert(
                `${file.name} không phải là file jpg, png, jpeg!`,
                'error'
              );
            }

            return isPNG ? true : Upload.LIST_IGNORE;
          }}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            defaultFileList={fileList}
            onRemove={() => setFileList([])}
            beforeUpload={(file) => {
              setFileList([{ originFileObj: file, name: file.name } as any]);
              return false;
            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
      ) : (
        <Upload
          listType="picture-card"
          fileList={fileList}
          multiple={multiple}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={(file) => {
            const isPNG =
              file.type === 'image/png' ||
              file.type === 'image/jpeg' ||
              file.type === 'image/jpg';
            if (!isPNG) {
              messageAlert(
                `${file.name} is not a png, jpg or jpeg file`,
                'error',
                5
              );
            }
            return isPNG ? false : Upload.LIST_IGNORE;
          }}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
      )}

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default UploadFiles;
