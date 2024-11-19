import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import serverFetch from "../../axios/serverFetch";

const initialState = {
  cartItems: [],
  totalPrice: 0,
  isLoading: false,
};

export const getCartItems = createAsyncThunk("cart/getCartItems", async () => {
  try {
    const { data } = await serverFetch("/cart/myCart");
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      const { data } = await serverFetch.patch("/cart/clearCart");
      thunkAPI.dispatch(clearCartLocal()); //dispatch is used to call a reducer
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async (_, thunkAPI) => {
    let compareTwoArrayOfObjects = (arrOne, arrTwo) => {
      return (
        arrOne.length === arrTwo.length &&
        arrOne.every((elOne) =>
          arrTwo.some(
            (elTwo) =>
              elOne._id === elTwo._id &&
              elOne.name === elTwo.name &&
              elOne.quantity === elTwo.quantity &&
              elOne.price === elTwo.price
          )
        )
      );
    };

    try {
      const currentCart = thunkAPI.getState().cart; //thunkAPI.getState() gives whole global state i.e user,cart,orders etc. We are just selecting the cart here
      const { data } = await serverFetch("/cart/myCart");
      const areCartsSame = compareTwoArrayOfObjects(
        currentCart.cartItems,
        data.userCart.cartItems
      );
      if (areCartsSame) {
        return;
      }
      if (
        currentCart.cartItems.length === 0 &&
        data.userCart.cartItems.length !== 0
      ) {
        return;
      }
      await serverFetch.patch("/cart/updateCart", {
        totalPrice: currentCart.totalPrice,
        cartItems: currentCart.cartItems,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState, //intitialState : initialState
  reducers: {
    clearCartLocal: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, { payload }) => {
      state.cartItems = state.cartItems.filter((item) => item._id !== payload);
    },
    increase: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item._id === payload);
      cartItem.quantity += 1;
    },
    decrease: (state, { payload }) => {
      const cartItem = state.cartItems.find((item) => item._id === payload);
      cartItem.quantity -= 1;
    },
    add: (state, { payload }) => {
      state.cartItems.push({
        _id: payload._id,
        name: payload.name,
        quantity: 1,
        price: payload.price,
      });
    },
    calculateTotal: (state) => {
      let total = 0;
      state.cartItems.forEach((item) => (total += item.quantity * item.price));
      state.totalPrice = total;
    },
  },
  extraReducers: {
    [getCartItems.pending]: (state) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      state.isLoading = false;
      action.payload && (state.cartItems = action.payload.userCart.cartItems);
    },
    [getCartItems.rejected]: (state) => {
      state.isLoading = false;
    },
    [updateCart.pending]: (state) => {
      state.isLoading = false;
    },
    [updateCart.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
    [updateCart.rejected]: (state) => {
      state.isLoading = false;
    },
    [clearCart.pending]: (state) => {
      state.isLoading = false;
    },
    [clearCart.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
    [clearCart.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export default cartSlice.reducer;
export const {
  clearCartLocal,
  removeItem,
  increase,
  decrease,
  add,
  calculateTotal,
} = cartSlice.actions;
