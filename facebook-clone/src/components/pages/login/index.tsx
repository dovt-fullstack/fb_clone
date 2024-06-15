import { Formik } from 'formik';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import Button from '../../atoms/button/Button';
import { TextInput } from '../../atoms/input/TextInput';
import { useLoginMutation } from '../../../api/Auth';
import { toast } from 'react-toastify';
import Navbar from '../../atoms/navbar';

const LoginPage: React.FC = () => {
  const [loginUser] = useLoginMutation();
  const navigate = useNavigate();
  const fieldValidationSchema = yup.object({
    account: yup.string().required('Email or phone required'),
    password: yup.string().required('Password required'),
  });
  return (
    <>
    <Navbar/>
    <div className="w-full h-full flex items-center justify-center">
       
      <div className="w-96 h-auto bg-white rounded-md shadow-md p-4">
        <Formik
          initialValues={{
            account: '',
            password: '',
          }}
          onSubmit={async (values) => {
            console.log(values);
            await loginUser(values).then((data: any) => {
              if (data.error) {
                return toast.error(data.error.data.message, {});
              } else {
                toast.success('Logged in successfully');
                navigate('/');
              }
            });
          }}
          validationSchema={fieldValidationSchema}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextInput
                inputSize="large"
                type="text"
                placeholder="Email address or phone number"
                name="account"
              />
              <TextInput
                inputSize="large"
                name="password"
                type="password"
                placeholder="Password"
              />
              <Button style={{background:"#006400"}}
                type="submit"
                size="large"
                block
                fontSize="text-xl"
                fontWeight="font-bold"
              >
                Login
              </Button>
              <div className="mt-2 text-center pb-3 border-b border-gray-300">
                <Link to={'/forgot-password'}>
                <p className="text-primary cursor-pointer underline">
                  Forgot password?
                </p>
                </Link>
              </div>
            </form>
          )}
        </Formik>

        <div className="mt-5 text-center">
          <Link to="/register">
            <Button style={{width:"352px",height:"44px", background:"#3CB371"}} size="large" bg="bg-greenLight" fontSize="text-xl">
              Create New Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
