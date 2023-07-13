import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import postReducer from "../features/post/postSlice";
import playlistReducer from "../features/playlist/playlistSlice";
import connectionReducer from "../features/connection/connectionSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    playlist: playlistReducer,
    connection: connectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AppDispatch = typeof store.dispatch;