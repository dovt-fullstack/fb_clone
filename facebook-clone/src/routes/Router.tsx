import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GamingPageLayout from '../components/layouts/GamingPageLayout';
import MarketplacePageLayout from '../components/layouts/MarketplacePage';
import NewsFeedLayout from '../components/layouts/NewsFeedLayout';
import ProfilePageLayout from '../components/layouts/ProfilePageLayout';
import WatchPageLayout from '../components/layouts/WatchPageLayout';
import GamingPage from '../components/pages/gaming';
import LoginPage from '../components/pages/login';
import MarketplacePage from '../components/pages/marketplace';
import NewsFeedPage from '../components/pages/newsfeed';
import PageNotFound from '../components/pages/notfound';
import ProfilePage from '../components/pages/profile';
import RegisterPage from '../components/pages/signup';
import WatchPage from '../components/pages/watch';
import { PrivateRoute } from './PrivateRoute';
import {
  GAMING,
  HOME,
  LOGIN,
  MARKETPLACE,
  PROFILE,
  REGISTER,
  WATCH,
} from './routes';
import ChangePassword from '../components/pages/ChangePassword';
import ForgotPassword from '../components/pages/ForgotPassword';
import NewDetails from '../components/pages/watch/NewDetails';
import MyData from '../components/pages/watch/MyData';
import MaketDetails from '../components/pages/marketplace/MaketDetails';

const Routers: React.FC = () => {
  return (
    <Routes>
      <Route path={LOGIN} element={<LoginPage />} />
      <Route path={REGISTER} element={<RegisterPage />} />
      <Route
        path={HOME}
        element={
          <PrivateRoute layout={NewsFeedLayout}>
            <NewsFeedPage />
          </PrivateRoute>
        }
      />
      <Route
        path={WATCH}
        element={
          <PrivateRoute layout={WatchPageLayout}>
            <WatchPage></WatchPage>
          </PrivateRoute>
        }
      />

      <Route
        path={MARKETPLACE}
        element={
          <PrivateRoute layout={MarketplacePageLayout}>
            <MarketplacePage />
          </PrivateRoute>
        }
      />
      <Route
        path={'/marketplace/:id'}
        element={
          <PrivateRoute layout={MarketplacePageLayout}>
            <MaketDetails />
          </PrivateRoute>
        }
      />
      <Route
        path={GAMING}
        element={
          <PrivateRoute layout={GamingPageLayout}>
            <GamingPage />
          </PrivateRoute>
        }
      />
      <Route path={'/change-pass'} element={<ChangePassword />} />
      <Route path={'/forgot-password'} element={<ForgotPassword />} />
      {/* my-category my-blogs */}
      <Route path={'/my-category/:id'} element={<MyData />} />
      <Route path={'/my-blogs/:id'} element={<NewDetails />} />
      <Route path={'/blogs/:id'} element={<NewDetails />} />

      <Route
        path={PROFILE}
        element={
          <PrivateRoute layout={ProfilePageLayout}>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path={'/profile/:id'}
        element={
          <PrivateRoute layout={ProfilePageLayout}>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Routers;
