import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import axios from 'axios';
import {
  Link,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  message,
} from 'antd';
const { Option } = Select;
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../store';
const MarketplacePage: React.FC = () => {
  const [dataProduct, setDataProduct] = useState([]);
  const [openProduct, setOpenProduct] = useState(false);
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [dataProductUser, setDataProductUser] = useState([]);
  const [dataIdProduct, setDataIdProduct] = useState<any>();
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user: userInfo } = useAppSelector(
    (state: any) => state.persistedReducer.auth
  );
  const [queryParameters] = useSearchParams();
  const isEditMyPro: any = queryParameters.get('isEditMyPro');
  const [openMyNewBlog, setOpenMyNewBlog] = useState(false);
  const [openMyNewProduct, setOpenMyNewProduct] = useState(false);
  const [productFavourite, setProductFavourite] = useState([]);
  const navigate = useNavigate();
  const isCreateLoading = '';
  const [form] = Form.useForm();
  const openNewBlog = () => {
    setOpenMyNewBlog(true);
  };
  const closeNewBlog = () => {
    setOpenMyNewBlog(false);
  };
  const openNewProduct = () => {
    setOpenMyNewProduct(true);
  };
  const closeNewProduct = () => {
    setOpenMyNewProduct(false);
  };
  const fetchProductFavourite = async () => {
    const { data } = await axios.get(
      'http://localhost:8000/api/get-product-farvourite/' + userInfo._id
    );
    setProductFavourite(data.ytProduct);
  };
  useEffect(() => {
    fetchProductFavourite();
  }, [userInfo._id]);

  useEffect(() => {
    const getIdProducto = async () => {
      const { data } = await axios.get(
        'http://localhost:8000/api/product/' + isEditMyPro
      );
      setDataIdProduct(data.data);
    };
    getIdProducto();
  }, [isEditMyPro]);
  // api/get-product-user-create
  const fetchDataProductUser = async () => {
    const { data } = await axios.get(
      'http://localhost:8000/api/get-product-user-create/' + userInfo._id
    );
    setDataProductUser(data);
  };
  useEffect(() => {
    if (isEditMyPro) {
      console.log('isEditMyPro', dataIdProduct);
      form.setFieldsValue({
        name: dataIdProduct?.name,
        description: dataIdProduct?.description,
        sale: dataIdProduct?.sale,
        is_active: dataIdProduct?.is_active,
      });
    }
  }, [isEditMyPro, dataIdProduct, form]);
  useEffect(() => {
    fetchDataProductUser();
  }, [userInfo._id]);
  const fetchAllProduct = async () => {
    const { data } = await axios.get('http://localhost:8000/api/products');
    setDataProduct(data.docs);
  };
  useEffect(() => {
    fetchAllProduct();
  }, []);
  const handleSubmitForm = (values: any) => {
    //
    console.log(images, 'images', dataIdProduct.images, 'dataIdProduct.images');
    const dataPost = {
      name: values.name,
      description: values.description,
      images: images,
      sale: values.sale,
      is_active: values.is_active,
      idUser: userInfo._id,
    };
    const dataEdit = {
      name: values.name,
      description: values.description,
      images: images.length > 0 ? images : dataIdProduct.images,
      sale: values.sale,
      is_active: values.is_active,
      idUser: userInfo._id,
    };
    if (!isEditMyPro) {
      axios
        .post('http://localhost:8000/api/create/product', dataPost)
        .then((response) => {
          //
          form.resetFields();
          fetchAllProduct();
          navigate('/marketplace');
          fetchDataProductUser();

          toast.success('product created successfully');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .post(
          'http://localhost:8000/api/update-product-v5/' + isEditMyPro,
          dataEdit
        )
        .then((response) => {
          //
          form.resetFields();
          fetchAllProduct();
          fetchDataProductUser();
          navigate('/marketplace');
          toast.success('product edited successfully');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const uploadImage = async (formData: FormData) => {
    return await axios.post(
      'http://localhost:8000/api/uploadImages',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  };
  const handleUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setIsLoading(true);
    const files = e.target.files;
    const urls: any[] = [];

    if (!files) return message.error('Không có hình ảnh nào được chọn');

    const formData = new FormData();

    for (const file of files) {
      formData.append('images', file);
      const response = await uploadImage(formData);
      if (response.status === 200) {
        urls.push(...response.data.urls);
      }
    }
    setIsLoading(false);
    return urls;
  };
  const handleOnChange = async (e: any) => {
    const urls = await handleUploadImage(e, setIsLoading);
    setIsUpload(true);
    setImages(urls as any[]);
  };

  const dataSourceNew = dataProductUser?.map((items: any, index: any) => ({
    stt: index + 1,
    key: items._id,
    name: items.name,
    image: items?.images[0]?.url,
  }));
  const columnsNew = [
    {
      title: '#',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => {
        return (
          <div>
            <p>{name && name.length > 30 ? `${name.slice(0, 30)}...` : name}</p>
          </div>
        );
      },
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => {
        return (
          <div>{image && <img className="w-[80px]" src={image} alt="" />}</div>
        );
      },
    },
    {
      title: 'action',
      render: ({ key }: any) => {
        return (
          <div className="space-x-5">
            <Button
              onClick={() => {
                closeNewBlog();
                setOpenProduct(true);
                navigate({
                  search: createSearchParams({
                    isEditMyPro: key,
                  }).toString(),
                });
              }}
              className="bg-blue-500 text-white"
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                if (
                  window.confirm('Are you sure you want to delete this item?')
                ) {
                  axios
                    .delete('http://localhost:8000/api/product/' + key)
                    .then(() => {
                      fetchDataProductUser();
                      fetchAllProduct();
                      toast.success('Delete successfully');
                    })
                    .catch((error: any) => console.log(error));
                }
              }}
              className="bg-red-500 text-white"
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];

  const dataSourceproductFavourite = productFavourite?.map(
    (items: any, index: any) => ({
      stt: index + 1,
      key: items._id,
      name: items.name,
      image: items?.images[0]?.url,
    })
  );
  const columnsproductFavourite = [
    {
      title: '#',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => {
        return (
          <div>
            <p>{name && name.length > 30 ? `${name.slice(0, 30)}...` : name}</p>
          </div>
        );
      },
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => {
        return (
          <div>{image && <img className="w-[80px]" src={image} alt="" />}</div>
        );
      },
    },
    {
      title: 'action',
      render: ({ key }: any) => {
        return (
          <div className="space-x-5">
            <Button
              onClick={() => {
                if (
                  window.confirm('Are you sure you want to delete this item?')
                ) {
                  axios
                    .get(
                      'http://localhost:8000/api/remove-sp-yt/' +
                        userInfo._id +
                        '?idPro=' +
                        key
                    )
                    .then(() => {
                      fetchDataProductUser();
                      fetchProductFavourite();
                      fetchAllProduct();
                      toast.success('Delete successfully');
                    })
                    .catch((error: any) => console.log(error));
                }
              }}
              className="bg-red-500 text-white"
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];
  // productFavourite
  return (
    <div className="my-10 mx-4">
      <Drawer
        title={`${!isEditMyPro ? 'Thêm' : 'Cập nhật'}`}
        placement="right"
        width={850}
        destroyOnClose
        onClose={() => {
          form.resetFields();
          setImages([]);
          setOpenProduct(false);
          navigate('/marketplace');
        }}
        open={openProduct}
        extra={
          <Space>
            <label
              htmlFor="button-submit-form"
              className="bg-primary py-2 px-4 flex justify-center items-center h-[44px] text-white rounded-lg cursor-pointer"
            >
              {!isCreateLoading && <p>{!isEditMyPro ? 'Thêm' : 'Cập nhật'} </p>}
              {isCreateLoading && (
                <div className="border-t-primary animate-spin w-6 h-6 border-2 border-t-2 border-white rounded-full"></div>
              )}
            </label>
          </Space>
        }
      >
        <Form
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={handleSubmitForm}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[
                  { required: true, message: 'Tên sản phẩm là bắt buộc!' },
                  {
                    validator: (_, value) => {
                      if (value.trim() === '') {
                        return Promise.reject(
                          'Tên sản phẩm không được chứa toàn khoảng trắng!'
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="Tên sản phẩm" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="is_active"
                label="Trạng thái sản phẩm"
                rules={[
                  { required: true, message: 'Trạng thái sản phẩm là bắt buộc' },
                ]}
              >
                <Select placeholder="Chọn trạng thái sản phẩm" size="large">
                  <Option value={false}>Riêng tư</Option>
                  <Option value={true}>Công khai</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}></Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="sale" label=" giá sản phẩm">
                <InputNumber placeholder=" giá sản phẩm" className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              {!isUpload && (
                <Form.Item
                  name="images"
                  className="w-full"
                  label="Hình ảnh sản phẩm"
                  rules={[
                    {
                      message: 'Không được để trống hình ảnh sản phẩm',
                    },
                  ]}
                >
                  <input
                    type="file"
                    onChange={(e) => handleOnChange(e)}
                    id="thumbnail"
                    multiple
                    className="!hidden"
                  />
                  <label
                    htmlFor="thumbnail"
                    className="rounded-xl flex-col flex items-center justify-center h-[150px] w-full gap-3 p-5 border border-gray-400 border-dashed"
                  >
                    <p className="mx-auto text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 mx-auto"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
                        />
                      </svg>
                    </p>
                    <p className="ant-upload-text text-center">Tải hình ảnh</p>
                  </label>
                </Form.Item>
              )}

              {isUpload && (
                <div className="rounded-xl flex-wrap items-center justify-center flex h-[150px] w-full gap-3 p-5 border border-gray-300 relative">
                  {images &&
                    images.length > 0 &&
                    images.map((image) => (
                      <div className="" key={image.publicId}>
                        <div className="h-[80px] w-[80px] object-cover rounded-md">
                          <img
                            src={image.url}
                            alt=""
                            className="object-cover w-full h-full border rounded-md shadow"
                          />
                        </div>
                        <div
                          className="top-4 left-4 absolute flex items-center justify-center w-4 h-4 cursor-pointer"
                          onClick={() => setIsUpload(false)}
                        >
                          <AiOutlineCloseCircle />
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {isEditMyPro && (
                <div className="rounded-xl flex-col items-start justify-start flex h-[150px] w-full gap-3 relative">
                  <p className="text-left">Hoặc giữ lại ảnh cũ</p>
                  {dataIdProduct?.images.map((image: any) => (
                    <div
                      className="h-[80px] w-[80px] object-cover rounded-md"
                      key={image.publicId}
                    >
                      <img
                        src={image.url}
                        key={image.publicId}
                        alt={image.filename}
                        className="object-cover w-full h-full border rounded-md shadow"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả Phòng"
                rules={[
                  {
                    required: true,
                    message: 'Mô tả Phòng là bắt buộc',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Mô tả Phòng" />
              </Form.Item>
            </Col>
          </Row>

          <input
            type="submit"
            id="button-submit-form"
            value={'gửi'}
            className="hidden"
          />
        </Form>
      </Drawer>
      <Drawer
        title={'danh mục sản phẩm của bạn'}
        width={666}
        destroyOnClose
        onClose={closeNewBlog}
        getContainer={false}
        open={openMyNewBlog}
      >
        <Table dataSource={dataSourceNew} columns={columnsNew} />
      </Drawer>
      <Drawer
        title={' sản phẩm yêu thích của bạn'}
        width={666}
        destroyOnClose
        onClose={closeNewProduct}
        getContainer={false}
        open={openMyNewProduct}
      >
        <Table
          dataSource={dataSourceproductFavourite}
          columns={columnsproductFavourite}
        />
      </Drawer>

      <div className="main-block">
        <div className="title">
          <a
            href="/chuyen-muc/san-pham-ban-chay.html"
            title="Sản phẩm bán chạy"
          >
            Sản phẩm<span> hôm nay</span>
          </a>
        </div>
        <div className="product-block">
          <ul>
            {dataProduct?.map((items: any) => {
              return (
                <li key={items._id}>
                  <div className="product">
                    <div className="pic-news">
                      <a href="/san-pham/cay-hai-duong.html">
                        <img
                          className="w-[330px] h-[220px]"
                          src={items?.images[0]?.url}
                          alt="Cây hải đường"
                        />
                      </a>
                    </div>
                    <h3>
                      <a href="/san-pham/cay-hai-duong.html">
                        {items.name.length > 30
                          ? items.name.slice(0, 30) + '...'
                          : items.name}
                      </a>
                    </h3>{' '}
                    <div className="price-product">
                      {items.sale?.toLocaleString()} đ
                    </div>
                    <div className="cart-product">
                      <Link to={'/marketplace/' + items._id}>
                        <i className="fa fa-eye" />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="col-left">
        <div className="block-col">
          <div className="menu-left">
            <div id="accordian">
              <ul className="accordian-ul">
                <li className="active">
                  <h3>
                    <span className="circle-arrow">Cá nhân</span>
                  </h3>
                  <ul>
                    <li>
                      <a onClick={openNewProduct} className="cursor-pointer">
                        <span className="small-arrow">Sản phẩm yêu thích</span>
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="active">
                  <h3>
                    <span className="circle-arrow">Sản phẩm</span>
                  </h3>
                  <ul>
                    <li>
                      <a className="cursor-pointer" onClick={openNewBlog}>
                        <span className="small-arrow">
                          Sản phầm bạn đã đăng
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="cursor-pointer"
                        onClick={() => {
                          navigate('/marketplace');
                          setOpenProduct(true);
                        }}
                      >
                        <span className="small-arrow">Thêm mới sản phẩm</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
