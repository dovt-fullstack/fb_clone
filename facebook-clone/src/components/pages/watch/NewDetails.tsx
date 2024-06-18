import { Avatar, Button, Form, Input } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../../store';
import { toast } from 'react-toastify';

const NewDetails = () => {
  const { id } = useParams();
  const [queryParameters] = useSearchParams();
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);
  const [checkIndexEdit, setCheckIndexEdit] = useState<any>(null);
  const [form] = Form.useForm();
  const isDetails: any = queryParameters.get('isDetails');
  const [dataBlog, setDataBlog] = useState<any>();
  const fetchDatDetails = async () => {
    const { data } = await axios.get(
      'http://localhost:8000/api/newBlog/' + isDetails
    );
    console.log('details:', data);
    setDataBlog(data);
  };
  useEffect(() => {
    fetchDatDetails();
  }, [isDetails]);

  useEffect(() => {
    const data = dataBlog?.comments[checkIndexEdit];
    checkIndexEdit && checkIndexEdit != null;
    form.setFieldsValue({
      username: data?.content,
    });
  }, [id, form, checkIndexEdit, dataBlog]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes} `;
  };
  const onFinish = (values: any) => {
    if (checkIndexEdit == null) {
      const dataReq = {
        userId: user._id,
        nameUser: user.username,
        avatar: user.avatar,
        image: '',
        content: values.username,
      };
      axios
        .post('http://localhost:8000/api/comment-post/' + isDetails, dataReq)
        .then((response) => {
          form.resetFields();
          fetchDatDetails();
          toast.success('comment posted successfully');
        })
        .catch((error: any) => console.log(error));
    } else {
      const dataReq = {
        index : checkIndexEdit,
        content: values.username,
      };
      axios
        .post(
          'http://localhost:8000/api/edit-comment-post/' + isDetails,
          dataReq
        )
        .then((response) => {
          form.resetFields();
          fetchDatDetails();
          toast.success('comment posted successfully');
        })
        .catch((error: any) => console.log(error));
    }
  };
  // edit-comment-post
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div>
      <div className="layout-container">
        <div className="blog-thum mb-5">
          <img
            className="w-full object-cover"
            src={dataBlog?.images[0].url}
            alt=""
          />
          <div className="blog-date mb-8">
            <span className="text-base italic pt-5">
              Tạo bởi :{' '}
              <span className="!font-bold !text-black !text-lg">
                {dataBlog?.id_user?.username}
              </span>
            </span>
          </div>
        </div>
        <div className="blog-title">
          <h2 className={`text-[#333333] mb-6 text-[28px] page_title`}>
            {dataBlog?.name || 'Không có tiêu đề'}
          </h2>
        </div>
        <div className="blog-date mb-8">
          <span className="text-base italic">
            Ngày đăng: {formatDate(dataBlog?.createdAt) || 'Không rõ ngày đăng'}
          </span>
        </div>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{
            __html: dataBlog?.description || <p>Không có nội dung</p>,
          }}
        ></div>
      </div>
      <div className="mt-16">
        <p className="mb-3">Nhập bình luận của bạn</p>

        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          form={form}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your content!' }]}
          >
            <Input.TextArea placeholder="enter your comment !" />
          </Form.Item>
          <Form.Item className="space-x-5">
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            {checkIndexEdit != null ? (
              <Button
                onClick={() => setCheckIndexEdit(null)}
                type="primary"
                className="bg-red-500 ml-5"
                htmlType="button"
              >
                Cancel
              </Button>
            ) : (
              ''
            )}
          </Form.Item>
        </Form>
      </div>
      <div>
        {dataBlog?.comments?.map((db: any, index: number) => {
          return (
            <div
              className="border p-5 flex items-center justify-between border-[#ccc] mt-2 rounded-md"
              key={index}
            >
              <div>
                <div className="flex   gap-4">
                  <Avatar className="w-[60px] h-[60px]" src={db.avatar} />
                  <p className="pt-2 font-bold text-lg">{db.nameUser}</p>
                </div>
                <p>{db.content}</p>
              </div>
              <div className="space-x-5">
                {db.userId == user._id ? (
                  <>
                    <Button
                      onClick={() => setCheckIndexEdit(index)}
                      className="bg-blue-500 text-white font-medium"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => {
                        const data = index;
                        if (
                          window.confirm('are you want to delete this comment?')
                        ) {
                          axios
                            .post(
                              'http://localhost:8000/api/remove-comment-post/' +
                                isDetails,
                              data
                            )
                            .then((response) => {
                              form.resetFields();
                              fetchDatDetails();
                              toast.success('remove posted successfully');
                            })
                            .catch((error: any) => console.log(error));
                        }
                      }}
                      className="bg-red-500 text-white font-medium"
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  ''
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewDetails;
