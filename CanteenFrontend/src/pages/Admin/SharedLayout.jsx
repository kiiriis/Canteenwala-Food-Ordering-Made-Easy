import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const adminPanelLinks = ['menu', 'orders'];

const SharedLayout = () => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    user.role !== 'admin' && navigate('/');
  }, [user.role, navigate]);

  return user.role === 'admin' ? (
    <div className='mt-5 flex h-full w-full flex-1'>
      <div className='mr-2 flex  w-1/4 flex-col items-center  border-r-4 border-amber-500 '>
        {adminPanelLinks.map((link, index) => (
          <NavLink
            key={index}
            className={({ isActive }) => {
              let returnStyle = '';
              if (isActive) {
                returnStyle = ' bg-amber-500 font-bold text-white';
              }
              return `w-full p-4 text-center capitalize ${returnStyle}`;
            }}
            to={`/admin/${link}`}
          >
            {link}
          </NavLink>
        ))}
      </div>
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default SharedLayout;
