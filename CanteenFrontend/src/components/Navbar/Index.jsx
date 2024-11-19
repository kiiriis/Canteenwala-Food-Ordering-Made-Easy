import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import serverFetch from '../../lib/axios/serverFetch';
import { clearUser } from '../../lib/redux/features/userSlice';
import MobileNavbar from './MobileNavbar';

const Index = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navLinks = user.userId
    ? user.role !== 'admin'
      ? ['Home', 'Menu', 'Cart']
      : ['Home', 'Admin Panel']
    : ['Home'];

  const logout = async () => {
    try {
      isSidePanelOpen && setIsSidePanelOpen(false);
      await serverFetch('/auth/logout');
      dispatch(clearUser());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='z-20 flex justify-between'>
      <div className='gap-20 xl:flex xl:items-center'>
        <Link to='/'>
          <h3 className='text-2xl font-bold'>
            Canteen
            <span className='bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent'>
              Wala
            </span>
          </h3>
        </Link>
        <div className='hidden xl:flex xl:items-center xl:gap-6'>
          {navLinks
            .filter(link => link !== 'Cart')
            .map((link, index) => (
              <NavLink
                key={index}
                className={({ isActive }) => {
                  let returnStyle = '';
                  if (isActive) {
                    returnStyle =
                      'underline decoration-amber-500 decoration-2 underline-offset-4';
                  }
                  return `${returnStyle} text-lg font-extrabold `;
                }}
                to={`/${
                  link === 'Home' ? '' : link === 'Admin Panel' ? 'admin' : link
                }`}
              >
                {link}
              </NavLink>
            ))}
        </div>
      </div>

      <div className='item-center flex gap-3'>
        {user.userId && user.role !== 'admin' ? (
          <Link className='flex items-center justify-center' to='/cart'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 '
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
            </svg>
          </Link>
        ) : (
          <></>
        )}

        {user.userId ? (
          <>
            <Link
              to={'/profile'}
              className='hidden rounded-md border-2 border-amber-500 bg-amber-100 px-2 py-1 text-sm font-bold uppercase tracking-wide text-amber-700 xl:block'
            >
              Profile
            </Link>
            {user.role === 'user' ? (
              <>
                <Link
                  to={'/orders'}
                  className='rounded-md border-2 border-sky-500 bg-sky-100 px-2 py-1 text-sm font-bold uppercase tracking-wide text-sky-700'
                >
                  Orders
                </Link>
              </>
            ) : (
              <></>
            )}
            <button
              className='hidden rounded-md border-2 border-rose-500 bg-rose-100 px-2 py-1 text-sm font-bold uppercase tracking-wide text-rose-700 xl:block'
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <></>
        )}

        {!user.userId ? (
          <Link
            to={'/signIn'}
            className='rounded-md border-2 border-orange-500 bg-orange-100 px-2 py-1 text-sm font-bold uppercase tracking-wide text-orange-700'
          >
            Log In
          </Link>
        ) : (
          <></>
        )}

        <button
          className='xl:hidden'
          onClick={() => {
            setIsSidePanelOpen(true);
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
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
      </div>
      <MobileNavbar
        navLinks={navLinks}
        isSidePanelOpen={isSidePanelOpen}
        setIsSidePanelOpen={setIsSidePanelOpen}
        logout={logout}
      />
    </div>
  );
};

export default Index;
