import React from 'react';
import { useLoginMutation } from '../../api/Auth';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { TextInput } from '../atoms/input/TextInput';
import Button from '../atoms/button/Button';
import axios from 'axios';
import { useAppSelector } from '../../store';

const ChangePassword = () => {
  const { user: userInfo } = useAppSelector(
    (state) => state.persistedReducer.auth
  );
  const [loginUser] = useLoginMutation();
  const navigate = useNavigate();
  const fieldValidationSchema = yup.object({
    account: yup.string().required('Current Password'),
    password: yup.string().required('New Password required'),
  });
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-96 h-auto bg-white rounded-md shadow-md p-4">
        <Formik
          initialValues={{
            account: '',
            password: '',
          }}
          onSubmit={async (values) => {
            const dataPost = {
              _id: userInfo._id,
              password: values.account,
              passwordNew: values.password,
            };
            await axios
              .post('http://localhost:8000/api/user/updatePassword', dataPost)
              .then((data: any) => {
                
                if (data.error) {
                  return toast.error(data.error.data.message, {});
                } else {
                  toast.success('Change password successfully');
                  navigate('/');
                }
              })
              .catch((error) => {
                return toast.error(error.response.data.message, {});
              });
          }}
          validationSchema={fieldValidationSchema}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TextInput
                inputSize="large"
                type="text"
                placeholder="Current Password"
                name="account"
              />
              <TextInput
                inputSize="large"
                name="password"
                type="password"
                placeholder="New Password"
              />
              <Button
                type="submit"
                size="large"
                block
                fontSize="text-xl"
                fontWeight="font-bold"
              >
                Change
              </Button>
              <div className="mt-2 text-center pb-3 border-b border-gray-300">
                <p onClick={()=> navigate('/forgot-password')} className="text-primary cursor-pointer underline">
                  Forgot password?
                </p>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePassword;
