import { Routes, Route, Navigate } from "react-router-dom";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Menu from "./pages/Menu/Index";
import Cart from "./pages/Cart";
import SharedLayout from "./pages/SharedLayout";
import SignIn from "./pages/SignIn";
import Category from "./pages/Menu/Category";
import AdminSharedLayout from "./pages/Admin/SharedLayout";
import AdminMenu from "./pages/Admin/Menu";
import AdminOrders from "./pages/Admin/Orders";

import ManageCategory from "./pages/Admin/ManageCategory";
import ManageMenu from "./pages/Admin/ManageMenu";
import ManageMenuItemForm from "./pages/Admin/ManageMenuItemForm";
import SingleOrder from "./pages/Admin/SingleOrder";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  calculateTotal,
  getCartItems,
  updateCart,
} from "./lib/redux/features/cartSlice";
import Register from "./pages/Register";
import { getUser } from "./lib/redux/features/userSlice";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import SingleOrderUser from "./pages/SingleOrderUser";
import { addOrder, getOrders } from "./lib/redux/features/orderSlice";
import io from "socket.io-client";

const socket = io.connect(process.env.REACT_APP_SERVER_ADDRESS); //sockets enable two way communication, basically server can initiate conversation without getting request from client

function App() {
  const cart = useSelector((state) => state.cart); //useSelector is used to get state stored in store
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit("subscribe", "orders");
  }, []);

  useEffect(() => {
    socket.on("changeOrdersClient", (data) => {
      dispatch(addOrder({ data, user }));
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    user.userId && localStorage.setItem("user", JSON.stringify(user));
  }, [user, dispatch]);

  useEffect(() => {
    dispatch(calculateTotal());
  }, [cart.cartItems, dispatch]);

  useEffect(() => {
    user.role === "user" && dispatch(updateCart());
  }, [user.role, dispatch, cart.totalPrice]);

  useEffect(() => {
    user.role === "user" && dispatch(getCartItems());
    user.userId && dispatch(getUser());
    user.userId && dispatch(getOrders());
  }, [dispatch, user.userId, user.role]);

  return (
    <div className="font-primary">
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="menu/:category" element={<Category />} />
          <Route path="cart" element={<Cart socket={socket} />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders socket={socket} />} />
          <Route path="orders/:id" element={<SingleOrderUser />} />
          <Route path="admin" element={<AdminSharedLayout />}>
            <Route index element={<Navigate to="/admin/menu" />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="orders" element={<AdminOrders socket={socket} />} />
          </Route>
          <Route path="admin/menu/:category" element={<ManageMenu />} />
          <Route
            path="admin/manageCategory/:category"
            element={<ManageCategory />}
          />
          <Route
            path="admin/menu/:category/manageMenu/:menuItem"
            element={<ManageMenuItemForm />}
          />
          <Route
            path="admin/orders/:id"
            element={<SingleOrder socket={socket} />}
          />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;
