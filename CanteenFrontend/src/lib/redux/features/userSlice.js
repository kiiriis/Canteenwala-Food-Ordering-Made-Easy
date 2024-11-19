import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; //fancy name for async functions
import serverFetch from "../../axios/serverFetch";

const initialState = {
  name: "",
  role: "",
  userId: "",
  isLoading: false,
};

export const getUser = createAsyncThunk("user/getUser", async () => {
  try {
    const { data } = await serverFetch("/users/showMe");
    return data;
  } catch (error) {
    console.log(error);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: JSON.parse(localStorage.getItem("user"))
    ? JSON.parse(localStorage.getItem("user"))
    : initialState,
  //reducers are functions that you use to change states, basically setters
  reducers: {
    setUser: (state, { payload }) => {
      //payload contains the data that you pass to the function, state here is the current state
      //states can be manipulated directly in redux but cannot do it in react
      state.name = payload.name;
      state.role = payload.role;
      state.userId = payload.userId;
    },
    clearUser: (state) => {
      localStorage.removeItem("user");
      state.name = initialState.name;
      state.role = initialState.role;
      state.userId = initialState.userId;
    },
  },
  //These are async functions unlike the ones above
  extraReducers: {
    [getUser.pending]: (state) => {
      state.isLoading = true; //while user is being fetched, isLoading is true
    },
    [getUser.fulfilled]: (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.name = action.payload.user.name; //payload here will be whatever that is returned from the ASYNCTHUNK
        state.role = action.payload.user.role;
        state.userId = action.payload.user.userId;
      }
    },
    [getUser.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export default userSlice.reducer;
export const { setUser, clearUser } = userSlice.actions;
