import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import TextInput from '../components/Form/TextInput';
import serverFetch from '../lib/axios/serverFetch';
import { setUser } from '../lib/redux/features/userSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  useEffect(() => {
    user.role === 'admin' && navigate('/admin');
    user.role === 'user' && navigate('/Menu');
  }, [user.role, navigate]);

  const handleSubmit = async () => {
    if (!name) {
      setError('Please enter Name');
      return;
    }
    if (!email) {
      setError('Please enter Email');
      return;
    }
    if (!password) {
      setError('Please enter Password');
      return;
    }
    if (!repeatPassword) {
      setError('Please Repeat the Password');
      return;
    }
    if (repeatPassword !== password) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    try {
      const res = await serverFetch.post('/auth/register', {
        name,
        email,
        password,
      });
      navigate('/Menu');
      dispatch(setUser(res.data.user));
    } catch (error) {
      const errorMsg = error.response.data.msg
        ? error.response.data.msg
        : error.response.data;
      setError('Error from server: ' + errorMsg);
      console.log(error);
    }
  };

  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='rounded-md border bg-white p-10'>
        <h1 className='mb-10 text-center text-3xl font-bold'>Register</h1>
        <div className='flex flex-col items-center gap-5'>
          <TextInput
            Label='Name'
            LabelId='name'
            field={name}
            setField={setName}
            fieldType='text'
          />
          <TextInput
            Label='Email'
            LabelId='email'
            field={email}
            setField={setEmail}
            fieldType='email'
          />
          <TextInput
            Label='Password'
            LabelId='password'
            field={password}
            setField={setPassword}
            fieldType='password'
          />
          <TextInput
            Label='Repeat Password'
            LabelId='repPass'
            field={repeatPassword}
            setField={setRepeatPassword}
            fieldType='password'
          />
          {error ? <p className='text-rose-600'>{error}</p> : <></>}
          <button
            onClick={handleSubmit}
            className='self-stretch rounded bg-amber-800 px-5 py-2 text-sm font-bold uppercase text-white '
          >
            Register
          </button>
        </div>
        <p className='mt-5 text-xs font-bold'>
          Already Registered?{' '}
          <Link to='/signIn' className='text-amber-700 underline'>
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
