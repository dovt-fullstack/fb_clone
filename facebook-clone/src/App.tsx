import React from 'react';
import './App.css';
import Routers from './routes/Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App: React.FC = () => {
  return (
    <>
      <Routers />
      <ToastContainer theme='colored' />
    </>
  );
};

export default App;
