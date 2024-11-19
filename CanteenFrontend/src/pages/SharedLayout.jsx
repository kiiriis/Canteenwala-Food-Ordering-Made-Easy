import React from 'react';
import Navbar from '../components/Navbar/Index';
import { Outlet } from 'react-router-dom';

const SharedLayout = () => {
  return (
    <div className='flex h-full min-h-screen flex-col py-2 px-3'>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default SharedLayout;
