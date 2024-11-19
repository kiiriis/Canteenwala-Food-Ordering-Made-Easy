import React from 'react';
import { Link } from 'react-router-dom';
const MenuItemCard = props => {
  return (
    <Link
      to={`/menu/${props.slug}`}
      className='flex flex-col items-center justify-between gap-2 overflow-hidden rounded-lg border-2 border-amber-300 bg-amber-200 xl:w-1/5'
    >
      <img
        className='xl: h-32 w-full object-cover object-center'
        src={props.image}
        alt={props.name}
      />

      <div className='flex w-full items-center justify-between p-5'>
        <h4 className='font-bold capitalize text-amber-900'>{props.name}</h4>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5  text-amber-900'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </div>
    </Link>
  );
};

export default MenuItemCard;
