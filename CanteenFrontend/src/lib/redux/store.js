import { configureStore } from "@reduxjs/toolkit"; //acts as an layer to easily set up react redux
import cartReducer from "./features/cartSlice";
import userReducer from "./features/userSlice";
import orderReducer from "./features/orderSlice";

//main store to store redux global states
export const store = configureStore({
  reducer: {
    //reducer accepts the states
    cart: cartReducer, //slices of the state
    user: userReducer,
    orders: orderReducer,
  },
});
