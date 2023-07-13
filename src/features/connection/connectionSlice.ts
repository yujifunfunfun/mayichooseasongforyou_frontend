import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

const apiUrlMyFollowingList = `${process.env.REACT_APP_DEV_API_URL}api/myfollowing/`;
const apiUrlMyFollowerList = `${process.env.REACT_APP_DEV_API_URL}api/myfollower/`;
const apiUrlFollowingList = `${process.env.REACT_APP_DEV_API_URL}api/following/`;
const apiUrlFollowerList = `${process.env.REACT_APP_DEV_API_URL}api/follower/`;


export const fetchAsyncGetMyFollowingList = createAsyncThunk("MyFollowingList/get", async (myplofile_id:number) => {
  const res = await axios.get(`${apiUrlMyFollowingList}${myplofile_id}/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

export const fetchAsyncGetMyFollowerList = createAsyncThunk("MyFollowerList/get", async (myplofile_id:number) => {
  const res = await axios.get(`${apiUrlMyFollowerList}${myplofile_id}/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});


export const fetchAsyncGetFollowingList = createAsyncThunk("FollowingList/get", async (user_id:number) => {
  const res = await axios.get(`${apiUrlFollowingList}${user_id}/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

export const fetchAsyncGetFollowerList = createAsyncThunk("FollowerList/get", async (user_id:number) => {
  const res = await axios.get(`${apiUrlFollowerList}${user_id}/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});


export const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    followingList: [0],
    followerList: [0],
    MyFollowingList: [0],
    MyFollowerList: [0],
    error: "ss",
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetFollowingList.fulfilled, (state, action) => {
      state.followingList = action.payload;
    });
    builder.addCase(fetchAsyncGetFollowerList.fulfilled, (state, action) => {
      state.followerList = action.payload;
    });
    builder.addCase(fetchAsyncGetMyFollowingList.fulfilled, (state, action) => {
      state.MyFollowingList = action.payload;
    });
    builder.addCase(fetchAsyncGetMyFollowerList.fulfilled, (state, action) => {
      state.MyFollowerList = action.payload;
    });
  },
});

export const selectFollowingList= (state: RootState) => state.connection.followingList;
export const selectFollowerList= (state: RootState) => state.connection.followerList;
export const selectMyFollowingList= (state: RootState) => state.connection.MyFollowingList;
export const selectMyFollowerList= (state: RootState) => state.connection.MyFollowerList;

export default connectionSlice.reducer;
