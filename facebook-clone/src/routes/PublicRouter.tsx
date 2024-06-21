// src/routes/PublicRoute.tsx

import React from 'react';
import { Route } from 'react-router-dom';

const PublicRoute = ({ children, layout: Layout }: any) => {
  return <Layout>{children}</Layout>;
};

export default PublicRoute;
