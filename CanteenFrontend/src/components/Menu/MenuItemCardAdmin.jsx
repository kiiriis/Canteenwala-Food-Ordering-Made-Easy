import React from 'react';
import { Link } from 'react-router-dom';
const MenuItemCardAdmin = props => {
  return (
    <Link
      to={`/admin/menu/${props.slug}`}
      className='flex flex-col items-center justify-between gap-2 overflow-hidden rounded-lg border-2 border-amber-300 bg-amber-200 xl:w-1/5'
    >
      <img
        className='h-40 w-full object-cover object-center'
        src={props.image}
        alt={props.name}
      />

      <h4 className='font-bold capitalize text-amber-900 xl:py-2'>
        {props.name}
      </h4>

      <Link
        to={`/admin/manageCategory/${props.slug}`}
        className='flex items-center justify-center self-stretch bg-amber-500 py-3'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
          />
        </svg>
      </Link>
    </Link>
  );
};

export default MenuItemCardAdmin;
