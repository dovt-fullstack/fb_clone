import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAppSelector } from '../../store';
import Button from '../atoms/button/Button';

const ChangePassword = () => {
  const { user: userInfo } = useAppSelector((state) => state.persistedReducer.auth);
  const navigate = useNavigate();

  const validationSchema = yup.object({
    currentPassword: yup.string().required('Current Password is required'),
    newPassword: yup.string().required('New Password is required'),
  });

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-96 h-auto bg-white rounded-md shadow-md p-4">
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const dataPost = {
              _id: userInfo._id,
              password: values.currentPassword,
              passwordNew: values.newPassword,
            };

            try {
              const response = await axios.post('http://localhost:8000/api/user/updatePassword', dataPost);
              toast.success(response.data.message || 'Change password successfully');
              navigate('/');
            } catch (error: any) {
              if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
              } else {
                toast.error('An error occurred. Please try again.');
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div
                style={{ width: "500px" }}
                className="mb-5">
                <Field
                  style={{ height: "50px", width: '340px',padding:'10px'}}
                  type="password"
                  name="currentPassword"
                  placeholder="Current Password"
                  className="input"
                />
                <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <Field
                  style={{ padding:'10px', height: "50px", width: '340px' }}

                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className="input"
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <Button type="submit" size="large" block fontSize="text-xl" fontWeight="font-bold" disabled={isSubmitting}>
                Change Password
              </Button>
              <div className="mt-2 text-center pb-3 border-b border-gray-300">
                <p onClick={() => navigate('/forgot-password')} className="text-primary cursor-pointer underline">
                  Forgot password?
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePassword;
