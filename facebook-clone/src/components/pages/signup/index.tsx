import { Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import Button from '../../atoms/button/Button';
import { TextInput } from '../../atoms/input/TextInput';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../../api/Auth';

const RegisterPage: React.FC = () => {
  const [resgter] = useRegisterMutation();
  const fieldValidationSchema = yup.object({
    email: yup.string().required('*  Email or phone required'),
    password: yup.string().required('*  Password required'),
    name: yup.string().required('*  Name required'),
    cf_password : yup.string().required('* Confirm password required'),
  });
  const navigate = useNavigate();
  return (
    <div style={{width:""}} className="w-full h-full flex items-center justify-center">
      <div style={{width:"700px",height:"700px",padding:"30px 130px 0px 130px"}} className="w-96 h-auto bg-white rounded-md shadow-md ">
        <Formik
          initialValues={{
            email: '',
            password: '',
            name: '',
          }}
          onSubmit={async (values) => {
            const data = {
              password: values.password,
              username: values.name,
              account: values.email,
              confirmpassword: values.cf_password,
            };
            await resgter(data).then((data: any) => {
              if (data.error) {
                return toast.error(data.error.data.message, {});
              } else {
                toast.success('Đăng kí thành công');
                navigate('/login');
              }
            });
          }}
          validationSchema={fieldValidationSchema}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <label style={{}} htmlFor="">Name:</label>
              <TextInput
                inputSize="large"
                name="name"
                type="text"
                placeholder="Name"
              />
              <label htmlFor="">Email:</label>
              <TextInput
                inputSize="large"
                type="text"
                placeholder="Email address or phone number"
                name="email"
              />
              <label htmlFor="">Password:</label>
              <TextInput
                inputSize="large"
                name="password"
                type="password"
                placeholder="Password"
              />
              <label htmlFor="">Confirm Password:</label>
              <TextInput
                inputSize="large"
                name="cf_password"
                type="password"
                placeholder="Confirm Password"
              />
              <div style={{display:"flex",gap:"10px",marginTop:"-15px"}}>
              <input style={{}} type="checkbox" name="" id="" />
              <p style={{fontSize:"13px",marginTop:"15px"}}>Khi đăng ký, bạn phải đồng ý với <a style={{color:"#1E90FF"}} href="">điều khoản sử dụng</a> và <a style={{color:"#1E90FF"}} href="">chính sách bảo mật</a> của chúng tôi.</p>
              </div>
              <Button
              style={{marginTop:"10px"}}
                type="submit"
                size="large"
                block
                fontSize="text-xl"
                fontWeight="font-bold"
              >
                Register
              </Button>
              
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RegisterPage;
