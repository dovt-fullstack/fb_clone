import React, { useEffect, useState } from 'react';
import './style.module.css';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAppSelector } from '../../../store';
import { SupportBot } from '../../../features';

const MaketDetails = () => {
  const { id } = useParams();
  const [openChat, setOpenChat] = useState(false);
  const [dataIdProduct, setDataIdProduct] = useState<any>();
  const navigate = useNavigate();
  const showDrawerChat = () => {
    setOpenChat(!openChat);
  };
  const [dataFouve, setDataFouve] = useState<any>(false);
  const { user: userInfo } = useAppSelector(
    (state: any) => state.persistedReducer.auth
  );
  useEffect(() => {
    const getIdProducto = async () => {
      const { data } = await axios.get(
        'http://localhost:8000/api/product/' + id
      );
      console.log(data, 'data id');
      setDataIdProduct(data.data);
    };
    getIdProducto();
  }, [id]);
  const getIdProductoFouve = async () => {
    const { data } = await axios.get(
      'http://localhost:8000/api/check-product-farvourite/' +
        userInfo._id +
        '?idPro=' +
        id
    );
    setDataFouve(data.data);
  };
  useEffect(() => {
    getIdProductoFouve();
  }, [id, userInfo._id]);
  return (
    <div>
      {openChat && (
        <SupportBot
          showDrawer={showDrawerChat}
          showDrawerChat={showDrawerChat}
        />
      )}

      <section
        className="breadcrumb-area style2"
        style={{
          backgroundImage: 'url(https://caycanhnoithat.vn/2021/bn-sp.jpg)',
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="inner-content-box clearfix">
                <div className="title-s2 text-center">
                  <h1
                    className="text-center"
                    style={{ textShadow: '2px 2px #000', color: '#fff' }}
                  >
                    CÂY XANH VÀ PHỤ KIỆN {' '}
                  </h1>
                </div>
                <div className="breadcrumb-menu float-left"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gray-100">
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={dataIdProduct?.images[0]?.url}
                  alt="Product Image"
                  className="rounded-lg w-[396px] h-[396px]"
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{dataIdProduct?.name}</h2>
              <p className="text-2xl font-semibold mb-4">
                {dataIdProduct?.sale?.toLocaleString()} VND
              </p>
              <div className="space-x-5">
                {dataFouve ? (
                  <button
                    onClick={() => {
                      alert('Bạn đã thích sản phẩm này ');
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Đã thích
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (window.confirm('thêm yêu thích')) {
                        axios
                          .get(
                            'http://localhost:8000/api/add-sp-yt/' +
                              userInfo._id +
                              '?idPro=' +
                              id
                          )
                          .then((response) => {
                            //
                          })
                          .catch((error) => {
                            //
                          });
                      }
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Yêu thích
                  </button>
                )}
                <button
                  onClick={() => {
                    if (dataIdProduct.idUser == userInfo._id) {
                      alert('sản phẩm này là bạn đăng');
                    } else {
                      showDrawerChat();
                      navigate({
                        search: createSearchParams({
                          chat: dataIdProduct.idUser,
                        }).toString(),
                      });
                    }
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Liên hệ người bán
                </button>
              </div>
              <p className="text-gray-600 mb-4 mt-10">
                {dataIdProduct?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaketDetails;
