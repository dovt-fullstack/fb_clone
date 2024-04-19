import React, { ElementType, PropsWithChildren, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LOGIN } from './routes';
import { useAppSelector } from '../store';

interface IProps {
  layout: ElementType;
}

const PrivateRoute: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { children, layout: Layout } = props;
  const { pathname } = useLocation();
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);
  const isAuthenticated = !!user._id;
  if (!isAuthenticated) {
    return (
      <Navigate
        to={{
          pathname: LOGIN,
          search: pathname && pathname !== '/' ? `?redirect=${pathname}` : undefined,
        }}
      />
    );
  }
  return <Layout>{children}</Layout>;
};

export { PrivateRoute };
