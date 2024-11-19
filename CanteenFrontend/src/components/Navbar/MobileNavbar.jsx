import React from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

const MobileNavbar = props => {
  const user = useSelector(state => state.user);

  return (
    <div
      className={`${
        !props.isSidePanelOpen && 'hidden'
      } absolute top-0 right-0 flex h-screen w-screen  flex-col bg-gray-100 py-4 transition duration-300 ease-out`}
    >
      <button
        className='mb-10 mr-4 self-end'
        onClick={() => {
          props.setIsSidePanelOpen(false);
        }}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-6 w-6'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
      {user.userId ? (
        <>
          <Link
            to={'/profile'}
            className='self-center rounded-md border-2 border-amber-500 bg-amber-100 px-2 py-1 font-bold uppercase tracking-wide text-amber-700 xl:text-sm'
            onClick={() => {
              props.setIsSidePanelOpen(false);
            }}
          >
            Profile
          </Link>
          <button
            className='my-3 self-center rounded-md border-2 border-rose-500 bg-rose-100 px-2 py-1 font-bold uppercase tracking-wide text-rose-700 xl:text-sm'
            onClick={props.logout}
          >
            Logout
          </button>
        </>
      ) : (
        <></>
      )}
      {props.navLinks.map((link, index) => (
        <NavLink
          key={index}
          className={({ isActive }) => {
            let returnStyle = '';
            if (isActive) {
              returnStyle = 'bg-amber-600 text-white';
            }
            return `text-center text-lg font-bold ${returnStyle} px-4 py-4`;
          }}
          to={`/${
            link === 'Home' ? '' : link === 'Admin Panel' ? 'admin' : link
          }`}
          onClick={() => {
            props.setIsSidePanelOpen(false);
          }}
        >
          {link}
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNavbar;
