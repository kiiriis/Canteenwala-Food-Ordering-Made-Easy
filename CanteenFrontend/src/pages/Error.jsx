import React from 'react';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <h1 className='text-9xl text-amber-700'>404</h1>
      <p className='text-3xl font-bold capitalize text-amber-700'>Not found</p>
      <Link
        to='/'
        className='mt-3 rounded bg-amber-700 px-4 py-2 text-center text-xl font-bold capitalize text-amber-100 transition duration-100 ease-out hover:bg-amber-800 focus:bg-amber-900 focus:text-amber-100 focus:ring-2 focus:ring-amber-900 focus:ring-offset-2'
      >
        Go home
      </Link>
    </div>
  );
};

export default Error;
