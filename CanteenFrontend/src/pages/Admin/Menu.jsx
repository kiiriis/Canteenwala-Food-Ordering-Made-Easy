import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import serverFetch from '../../lib/axios/serverFetch';
import MenuItemCardAdmin from '../../components/Menu/MenuItemCardAdmin';

const Menu = () => {
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

  return (
    <>
      <div className='flex flex-col gap-3 xl:flex-row xl:flex-wrap'>
        {categories.map(category => (
          <MenuItemCardAdmin
            key={category._id}
            name={category.name}
            image={category.image}
            slug={category.slug}
            isAdmin={true}
          />
        ))}
      </div>
      <Link
        to='/admin/manageCategory/add'
        className='mt-3 inline-block rounded-md bg-amber-600 px-5 py-2 font-bold uppercase text-white'
      >
        Add category
      </Link>
    </>
  );
};

export default Menu;
