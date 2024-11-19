import React, { useEffect } from "react";
import { useState } from "react";
// import cartData from '../sampleData/cartData.json';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import serverFetch from "../lib/axios/serverFetch";
import { clearCart, removeItem } from "../lib/redux/features/cartSlice";
import { addOrder } from "../lib/redux/features/orderSlice";

const Cart = ({ socket }) => {
  const cart = useSelector((state) => state.cart);
  const [cartText, setCartText] = useState("Your Cart is Empty");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    !user.userId && navigate("/");
  }, [user.userId, navigate]);

  const placeOrder = async () => {
    try {
      const { data } = await serverFetch.post("/orders", {
        totalPrice: cart.totalPrice,
        orderItems: cart.cartItems,
      });
      await socket.emit("changeOrdersServer", data.order);
      dispatch(addOrder({ data: data.order, user }));
      dispatch(clearCart());
      setCartText("ORDER PLACED SUCCESSFULLY");
      setTimeout(() => {
        navigate(`/orders/${data.order._id}`);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return user.role !== "admin" ? (
    <div className="flex flex-1 flex-col items-stretch justify-center text-amber-900 xl:items-center">
      {cart.isLoading ? (
        <p className="text-center text-3xl font-bold">Loading...</p>
      ) : (
        <>
          <div className="my-4 rounded-md bg-amber-100 px-6 py-3 xl:w-1/3 xl:px-10 xl:py-5">
            <h4 className="relative z-10 mb-4 text-3xl font-bold">
              Your Cart
              <div className="absolute top-4 left-8 -z-10 h-5 w-1/3 bg-amber-300"></div>
            </h4>

            <div className="flex flex-col divide-y-2 divide-solid divide-amber-300">
              {cart.cartItems.length ? (
                cart.cartItems.map((item) => (
                  <div
                    className="flex items-center justify-between gap-5"
                    key={item._id}
                  >
                    <p className="my-2">{item.name}</p>
                    <p className="my-2 flex flex-shrink-0 gap-5">
                      ₹{item.price} x {item.quantity}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6 text-rose-600"
                        onClick={() => dispatch(removeItem(item._id))}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </p>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center">{cartText}</p>
              )}
            </div>
            {cart.cartItems.length ? (
              <div className="mt-3 flex justify-between text-lg font-bold">
                <p>Total Bill</p>
                <p>₹{cart.totalPrice}</p>
              </div>
            ) : (
              <></>
            )}
            {cart.cartItems.length ? (
              <button
                className="mt-3 w-full rounded-md border-2 border-rose-500  bg-rose-100 px-4 py-2 text-center font-bold uppercase text-rose-800"
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </button>
            ) : (
              <></>
            )}
          </div>
          {cart.cartItems.length ? (
            <button
              className="flex items-center gap-3 self-center rounded-md border-2  border-gray-500 bg-gray-100 px-4 py-2 font-bold text-gray-800"
              onClick={placeOrder}
            >
              <img
                className="h-8"
                src="https://seeklogo.com/images/G/google-pay-logo-BFDEA14F81-seeklogo.com.png"
                alt="Google Pay"
              />
              Pay with UPI
            </button>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  ) : (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <p>To view orders for carts placed, please go to admin panel.</p>
      <Link
        to="/admin/orders"
        className="rounded-md border-2 border-amber-500 bg-amber-100 px-4 py-2 font-bold uppercase tracking-wide text-amber-700"
      >
        Admin Panel Orders
      </Link>
    </div>
  );
};

export default Cart;
