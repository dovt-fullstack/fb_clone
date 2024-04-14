import React, { ElementType, PropsWithChildren, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LOGIN } from './routes';
import { useAppSelector } from '../store';

interface IProps {
  layout: ElementType;
}

const PrivateRoute: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { children, layout: Layout } = props;
  const { pathname } = useLocation();
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth)
  console.log(user)
  const isAuthenticated = true;
  useEffect(() => {
      console.log('isAuthenticated', isAuthenticated);
  },[isAuthenticated])
  return isAuthenticated ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate
      to={{
        pathname: LOGIN,
        search:
          pathname && pathname !== '/' ? `?redirect=${pathname}` : undefined,
      }}
    />
  );
};

export { PrivateRoute };
