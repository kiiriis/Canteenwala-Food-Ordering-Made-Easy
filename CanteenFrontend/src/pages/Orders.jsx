import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OrderCard from "../components/Order/OrderCard";

const Orders = ({ socket }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    !user.userId && navigate("/");
  }, [user.userId, navigate]);

  return user.role !== "admin" ? (
    <div>
      <h1 className="text-center text-2xl font-bold text-amber-800">Orders</h1>
      <div className="mx-2 mt-3 flex flex-col items-center gap-2 xl:flex-row xl:flex-wrap">
        {orders
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .reduce((acc, el) => {
            if (el.isPrepared === false) {
              return [el, ...acc];
            }
            return [...acc, el];
          }, [])
          .map((order) => (
            <OrderCard
              order={order}
              key={order._id}
              isClient={true}
              socket={socket}
            />
          ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-1 flex-col items-center justify-center gap-3">
      <p>To view orders, please go to admin panel.</p>
      <Link
        to="/admin/orders"
        className="rounded-md border-2 border-amber-500 bg-amber-100 px-4 py-2 font-bold uppercase tracking-wide text-amber-700"
      >
        Admin Panel Orders
      </Link>
    </div>
  );
};

export default Orders;
