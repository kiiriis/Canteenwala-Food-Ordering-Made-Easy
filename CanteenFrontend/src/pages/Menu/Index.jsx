import React from 'react';
import MenuItemCard from '../../components/Menu/MenuItemCard';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import serverFetch from '../../lib/axios/serverFetch';
import { useState } from 'react';

const Menu = () => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const { data } = await serverFetch('/categories');
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    !user.userId && navigate('/');
  }, [user.userId, navigate]);

  return user.role !== 'admin' ? (
    <div className='mx-auto mt-4 flex w-full flex-col gap-5 xl:flex-row xl:flex-wrap xl:items-center'>
      {categories.map(category => (
        <MenuItemCard
          key={category._id}
          name={category.name}
          image={category.image}
          slug={category.slug}
          isAdmin={false}
        />
      ))}
    </div>
  ) : (
    <div className='flex flex-1 flex-col items-center justify-center gap-3'>
      <p>To view menu, please go to admin panel.</p>
      <Link
        to='/admin/Menu'
        className='rounded-md border-2 border-amber-500 bg-amber-100 px-4 py-2 font-bold uppercase tracking-wide text-amber-700'
      >
        Admin Panel Menu
      </Link>
    </div>
  );
};

export default Menu;
