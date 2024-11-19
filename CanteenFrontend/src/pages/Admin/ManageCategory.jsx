import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import serverFetch from '../../lib/axios/serverFetch';

const ManageCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [retrievedCategory, setRetrievedCategory] = useState({});
  const [categoryName, setCategoryName] = useState('');
  const [isAdd, setIsAdd] = useState();
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const user = useSelector(state => state.user);
  const fileRef = useRef(null);

  const fileInputClick = () => {
    if (image) {
      setImage('');
    } else fileRef.current.click();
  };

  useEffect(() => {
    user.role !== 'admin' && navigate('/');
  }, [user.role, navigate]);

  const getSingleCategory = async () => {
    try {
      const { data } = await serverFetch(`/categories/slug/${category}`);
      setRetrievedCategory(data.categories[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    category !== 'add' && getSingleCategory();
    //eslint-disable-next-line
  }, []);

  const handleSubmit = async () => {
    try {
      if (!categoryName) {
        setError('Please enter category name');
        return;
      }
      if (category !== 'add') {
        await serverFetch.patch(`/categories/${retrievedCategory._id}`, {
          name: categoryName,
        });
        if (image) {
          let formData = new FormData();
          formData.append('image', image);
          await serverFetch.post(
            `/categories/uploadImage/${retrievedCategory._id}`,
            formData
          );
        }
      } else {
        await serverFetch.post('/categories', { name: categoryName });
      }
      navigate('/admin/menu');
    } catch (error) {
      setError(error.response.data.msg);
      console.log(error);
    }
  };

  const deleteCategory = async () => {
    try {
      if (category !== 'add') {
        await serverFetch.delete(`/categories/${retrievedCategory._id}`);
        navigate('/admin/menu');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (category !== 'add') {
      setIsAdd(false);
      setCategoryName(retrievedCategory.name);
    } else {
      setIsAdd(true);
    }
  }, [retrievedCategory.name, category]);

  return (
    <div className='flex h-full flex-1 items-center justify-center'>
      <div className='flex flex-col  justify-center gap-4 rounded-md border bg-white py-10 px-12'>
        <Link to={`/admin/Menu`}>
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
        <h1 className=' text-center text-xl font-bold capitalize'>
          {category === 'add' ? 'Add new' : 'Edit'} category
        </h1>
        <div className='relative'>
          <input
            value={categoryName}
            onChange={e => {
              setCategoryName(e.target.value);
            }}
            className='peer  rounded-md border-2 border-black px-1 py-1 pl-2 placeholder-transparent focus:border-black focus:ring-black'
            placeholder='Category Name'
            type='text'
            id='categoryName'
          />
          <label
            htmlFor='categoryName'
            className=' absolute -top-[0.6rem] left-[0.61rem]  bg-white px-1 text-sm font-bold text-gray-800 transition-all duration-300 ease-out peer-placeholder-shown:top-[0.4rem] peer-placeholder-shown:text-base peer-placeholder-shown:font-semibold peer-placeholder-shown:text-gray-400 peer-focus:-top-[0.6rem] peer-focus:z-10 peer-focus:text-sm peer-focus:font-bold peer-focus:text-gray-800 '
          >
            Category Name
          </label>
          {category !== 'add' ? (
            <div className='mt-3'>
              <input
                ref={fileRef}
                onChange={e => setImage(e.target.files[0])}
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
                {image ? 'Remove Image' : 'Upload Image'}
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
        {error && <p className='max-w-fit text-sm  text-rose-600'>{error}</p>}
        <div className='flex items-center justify-end gap-2'>
          {!isAdd && (
            <button
              className='rounded bg-rose-600 p-2'
              onClick={deleteCategory}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-white'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          )}

          <button
            onClick={handleSubmit}
            className='self-end rounded bg-amber-600 px-5 py-2 text-sm font-bold uppercase text-white '
          >
            {category !== 'add' ? 'Edit' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageCategory;
