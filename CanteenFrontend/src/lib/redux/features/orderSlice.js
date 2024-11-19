import serverFetch from "../../axios/serverFetch";

const { createSlice, createAsyncThunk, current } = require("@reduxjs/toolkit");

const initialState = {
  orders: [],
  isLoading: false,
};

export const getOrders = createAsyncThunk(
  "orders/getOrders",
  async (_, thunkAPI) => {
    try {
      const user = thunkAPI.getState().user;
      if (user.role === "admin") {
        const { data } = await serverFetch("/orders");
        return data;
      }
      if (user.role === "user") {
        const { data } = await serverFetch("/orders/myOrders");
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, { payload }) => {
      const isInArray = current(state.orders).find((order) => {
        return order._id === payload.data._id;
      });
      if (isInArray) {
        const modifiedState = current(state.orders).map((order) => {
          if (order._id === payload.data._id) {
            return { ...order, ...payload.data };
          } else {
            return order;
          }
        });
        state.orders = modifiedState;
      } else {
        if (
          (payload.user.role === "user" &&
            payload.user.userId === payload.data.userId) ||
          payload.user.role === "admin"
        )
          state.orders = [...current(state.orders), payload.data];
      }
    },
  },
  extraReducers: {
    [getOrders.pending]: (state) => {
      state.isLoading = true;
    },
    [getOrders.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.orders;
    },
    [getOrders.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export default orderSlice.reducer;
export const { addOrder } = orderSlice.actions;
