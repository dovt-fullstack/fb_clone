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
    email: yup.string().required('Email or phone required'),
    password: yup.string().required('Password required'),
    name: yup.string().required('name required'),
    cf_password : yup.string().required('confirm password required'),
  });
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-96 h-auto bg-white rounded-md shadow-md p-4">
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
              <TextInput
                inputSize="large"
                name="name"
                type="text"
                placeholder="name"
              />
              <TextInput
                inputSize="large"
                type="text"
                placeholder="Email address or phone number"
                name="email"
              />
              <TextInput
                inputSize="large"
                name="password"
                type="password"
                placeholder="Password"
              />
              <TextInput
                inputSize="large"
                name="cf_password"
                type="password"
                placeholder="Confirm Password"
              />
              <Button
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
