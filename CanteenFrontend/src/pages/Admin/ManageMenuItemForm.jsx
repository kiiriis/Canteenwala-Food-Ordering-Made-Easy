import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import serverFetch from '../../lib/axios/serverFetch';
import { useSelector } from 'react-redux';

const ManageMenuItemForm = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const fileRef = useRef(null);
  const { category, menuItem } = useParams();
  const [error, setError] = useState('');
  const [food, setFood] = useState([]);
  const [retrievedCategory, setRetrievedCategory] = useState({});
  const [formValues, setFormValues] = useState({
    _id: '',
    slug: '',
    name: '',
    price: '',
    inStock: true,
    description: '',
    itemImageSrc: '',
  });

  const getSingleCategory = async () => {
    try {
      const { data } = await serverFetch(`/categories/slug/${category}`);
      setRetrievedCategory(data.categories[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getFood = async () => {
    try {
      const { data } = await serverFetch(`/food/slug/${menuItem}`);
      setFood(data.food[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (menuItem !== 'addItem') {
      setFormValues(prev => ({
        ...prev,
        _id: food._id,
        slug: food.slug,
        name: food.name,
        price: food.price,
        inStock: food.inStock,
        description: food.description,
      }));
    }
  }, [food, menuItem]);

  useEffect(() => {
    user.role !== 'admin' && navigate('/');
  }, [user.role, navigate]);

  useEffect(() => {
    if (menuItem !== 'addItem') {
      getFood();
    }
    getSingleCategory();
    //eslint-disable-next-line
  }, []);

  const inputEvent = e => {
    const name = e.target.name;
    const value = e.target.value;
    setFormValues(prevValue => {
      if (name === 'name') {
        return {
          ...prevValue,
          name: value,
        };
      } else if (name === 'price') {
        if (value < 0) {
          return prevValue;
        }
        return {
          ...prevValue,
          price: value,
        };
      } else if (name === 'description') {
        return {
          ...prevValue,
          description: value,
        };
      } else if (name === 'inStock') {
        return {
          ...prevValue,
          inStock: !prevValue.inStock,
        };
      } else if (name === 'itemImageSrc') {
        return {
          ...prevValue,
          itemImageSrc: e.target.files[0],
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formValues.name) {
        return setError('Enter a name');
      }
      if (!formValues.price) {
        return setError('Enter a price');
      }
      if (Number.isNaN(formValues.price)) {
        return setError('Price is not a number');
      }
      if (!formValues.description) {
        return setError('Enter a description');
      }
      if (menuItem !== 'addItem') {
        await serverFetch.patch(`/food/${food._id}`, {
          name: formValues.name,
          price: formValues.price,
          inStock: formValues.inStock.toString(),
          description: formValues.description,
        });
        if (formValues.itemImageSrc) {
          let formData = new FormData();
          formData.append('image', formValues.itemImageSrc);
          await serverFetch.post(`/food/uploadImage/${food._id}`, formData);
        }
      } else {
        await serverFetch.post(`/food`, {
          category: retrievedCategory._id,
          name: formValues.name,
          price: formValues.price,
          inStock: formValues.inStock.toString(),
          description: formValues.description,
        });
      }
      navigate(`/admin/menu/${category}`);
    } catch (error) {
      setError(error.response.data.msg);
      console.log(error);
    }
  };

  const fileInputClick = () => {
    if (formValues.itemImageSrc) {
      setFormValues(prevValue => ({ ...prevValue, itemImageSrc: '' }));
    } else fileRef.current.click();
  };

  return (
    <div className='flex h-full flex-1 items-center justify-center'>
      <div className='flex flex-col justify-center gap-4 rounded-md border bg-white py-10 px-12'>
        <Link to={`/admin/Menu/${category}`}>
          <button className='rounded-md bg-amber-800 p-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5 text-white'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </Link>
        <h1 className='text-center text-2xl font-bold capitalize'>
          {menuItem === 'addItem' ? 'Add New Item' : 'Edit item'}
        </h1>
        <h3 className='text-center text-lg font-bold capitalize text-amber-600 '>
          {category.split('-').join(' ')}
        </h3>
        <div className='relative'>
          <input
            type='text'
            id='name'
            name='name'
            value={formValues.name}
            onChange={inputEvent}
            placeholder='Item Name'
            className=' peer  rounded-md border-2 border-black px-1 py-1 pl-2 placeholder-transparent focus:border-black focus:ring-black'
          />
          <label
            htmlFor='name'
            className='absolute -top-[0.6rem] left-[0.61rem]  bg-white px-1 text-sm font-bold text-gray-800 transition-all duration-300 ease-out peer-placeholder-shown:top-[0.4rem] peer-placeholder-shown:text-base peer-placeholder-shown:font-semibold peer-placeholder-shown:text-gray-400 peer-focus:-top-[0.6rem] peer-focus:z-10 peer-focus:text-sm peer-focus:font-bold peer-focus:text-gray-800 '
          >
            Item Name
          </label>
        </div>
        <div className='relative'>
          <input
            type='number'
            min={0}
            id='price'
            name='price'
            value={formValues.price}
            onChange={inputEvent}
            placeholder='Item Price'
            className=' peer rounded-md border-2 border-black px-1 py-1 pl-2 placeholder-transparent  focus:border-black focus:ring-black'
          />
          <label
            htmlFor='price'
            className='absolute -top-[0.6rem] left-[0.61rem]  bg-white px-1 text-sm font-bold text-gray-800 transition-all duration-300 ease-out peer-placeholder-shown:top-[0.4rem] peer-placeholder-shown:text-base peer-placeholder-shown:font-semibold peer-placeholder-shown:text-gray-400 peer-focus:-top-[0.6rem] peer-focus:z-10 peer-focus:text-sm peer-focus:font-bold peer-focus:text-gray-800 '
          >
            Item Price
          </label>
        </div>
        <div className='relative'>
          <input
            type='text'
            id='description'
            name='description'
            value={formValues.description}
            onChange={inputEvent}
            placeholder='Item Description'
            className='peer rounded-md border-2 border-black px-1 py-1 pl-2 placeholder-transparent  focus:border-black focus:ring-black'
          />
          <label
            htmlFor='description'
            className='absolute -top-[0.6rem] left-[0.61rem]  bg-white px-1 text-sm font-bold text-gray-800 transition-all duration-300 ease-out peer-placeholder-shown:top-[0.4rem] peer-placeholder-shown:text-base peer-placeholder-shown:font-semibold peer-placeholder-shown:text-gray-400 peer-focus:-top-[0.6rem] peer-focus:z-10 peer-focus:text-sm peer-focus:font-bold peer-focus:text-gray-800 '
          >
            Item Description
          </label>
        </div>
        <div className='flex items-center gap-2'>
          <input
            className='rounded-sm border-2 border-amber-600 text-amber-600 focus:ring-amber-600'
            type='checkbox'
            name='inStock'
            checked={formValues.inStock}
            id='inStock'
            onChange={inputEvent}
          />
          <label htmlFor='description' className='font-bold text-amber-600'>
            In Stock
          </label>
        </div>
        {menuItem !== 'addItem' ? (
          <div>
            <input
              ref={fileRef}
              onChange={inputEvent}
              type='file'
              name='itemImageSrc'
              id='itemImageSrc'
              className='hidden'
              accept='image/*'
            />
            <button
              onClick={fileInputClick}
              className='rounded-full border-[3px] border-amber-600 px-4 py-2 text-sm font-bold transition duration-100 ease-out hover:bg-amber-600/20 focus:bg-amber-600 focus:text-white focus:ring-2 focus:ring-amber-600 focus:ring-offset-2'
            >
              {formValues.itemImageSrc ? 'Remove Image' : 'Upload Image'}
            </button>
          </div>
        ) : (
          <></>
        )}
        {error && <p className='max-w-fit text-sm  text-rose-600'>{error}</p>}
        <button
          onClick={handleSubmit}
          className='self-end rounded bg-amber-600 px-5 py-2 text-sm font-bold uppercase text-white '
        >
          {menuItem !== 'addItem' ? 'Edit' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export default ManageMenuItemForm;
