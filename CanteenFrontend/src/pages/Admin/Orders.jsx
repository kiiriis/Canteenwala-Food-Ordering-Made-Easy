import React from "react";
import { useSelector } from "react-redux";
import OrderCard from "../../components/Order/OrderCard";

const Orders = ({ socket }) => {
  const orders = useSelector((state) => state.orders.orders);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold text-amber-800">Orders</h1>
      <div className="mx-2 mt-3 flex flex-col items-center gap-2 text-sm xl:flex-row xl:flex-wrap xl:text-base">
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
            <OrderCard order={order} key={order._id} socket={socket} />
          ))}
      </div>
    </div>
  );
};

export default Orders;
