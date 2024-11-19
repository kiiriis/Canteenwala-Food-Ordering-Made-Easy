import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate('/');

  useEffect(() => {
    !user.userId && navigate('/');
  }, [user.userId, navigate]);

  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='flex flex-col rounded-md bg-amber-100 p-10'>
        <h4 className='relative z-10 mb-4 text-3xl font-bold'>
          Your Profile
          <div className='absolute top-4 left-8 -z-10 h-5 w-[60%] bg-amber-300'></div>
        </h4>
        <p className='mt-5 text-base xl:text-lg'>
          <span className='font-bold'>Id:</span> {user.userId}
        </p>
        <p className='text-base xl:text-lg'>
          <span className='font-bold'>Name:</span> {user.name}
        </p>
        <p className='text-base xl:text-lg'>
          <span className='font-bold'>Role:</span> {user.role}
        </p>
      </div>
    </div>
  );
};

export default Profile;
