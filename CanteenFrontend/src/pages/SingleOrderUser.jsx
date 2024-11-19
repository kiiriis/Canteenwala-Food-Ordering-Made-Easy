import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

const SingleOrderUser = () => {
  const user = useSelector(state => state.user);
  const orders = useSelector(state => state.orders.orders);
  const [order, setOrder] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    !user.userId && navigate('/');
  }, [user.userId, navigate]);

  useEffect(() => {
    setOrder(orders.find(order => order._id === id));
  }, [orders, id]);

  return (
    <div className='flex flex-1 items-center justify-center'>
      <div className='flex w-full flex-col rounded bg-amber-100 p-5 text-amber-800 xl:w-1/3'>
        <Link to={`/orders`}>
          <button className='mb-2 rounded-md bg-amber-800 p-2'>
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
        <p>
          {' '}
          <span className='font-bold'>Order ID:</span> {order?._id}
        </p>
        <p>
          <span className='font-bold'>Customer:</span> {order?.userId}
        </p>
        <p>
          <span className='font-bold'>Order Placed:</span>{' '}
          {new Date(order?.createdAt).getDate() === new Date().getDate()
            ? new Date(order?.createdAt).toLocaleTimeString()
            : new Date(order?.createdAt).toLocaleDateString('in')}
        </p>
        <h3 className='font-bold'>Order Items:</h3>
        <div>
          {order?.orderItems?.map(orderItem => {
            return (
              <div key={orderItem._id}>
                <div className='flex gap-2 pr-1'>
                  <p className='flex-1'>{orderItem.name}</p>
                  <p className='flex-1'>
                    ₹{orderItem.price} x {orderItem.quantity}
                  </p>
                  <p>₹{orderItem.price * orderItem.quantity}</p>
                </div>
                <div className='my-1 h-[1px] w-full bg-amber-800'></div>
              </div>
            );
          })}
        </div>
        <p className='flex items-center justify-end gap-3 py-2'>
          Total Price:
          <span className='rounded-sm bg-amber-800 p-1 font-bold text-amber-100'>
            ₹{order?.totalPrice}
          </span>
        </p>
        <p
          className={`mt-2 rounded px-2 py-1 text-center ${
            order?.isPrepared
              ? 'bg-emerald-800 text-emerald-100'
              : 'bg-rose-800 text-rose-100'
          }`}
        >
          Status: {order?.isPrepared ? 'Done' : 'Pending'}
        </p>
      </div>
    </div>
  );
};

export default SingleOrderUser;
