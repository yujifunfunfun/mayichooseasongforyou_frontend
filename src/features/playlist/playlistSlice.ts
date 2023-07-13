import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_AUDIOFEATURES, PROPS_NEWAUDIOFEATURES, PROPS_NEWPLAYLIST } from "../types";

const apiUrlMyPlaylist = `${process.env.REACT_APP_DEV_API_URL}api/myplaylist/`;
const apiUrlPlaylist = `${process.env.REACT_APP_DEV_API_URL}api/playlist/`;
const apiUrlDeletePlaylist = `${process.env.REACT_APP_DEV_API_URL}api/playlist/`;
const apiUrlAudioFeatures = `${process.env.REACT_APP_DEV_API_URL}api/audio_features/`;


export const fetchAsyncGetPlaylist = createAsyncThunk("playlist/get", async () => {
  const res = await axios.get(apiUrlPlaylist, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});



export const fetchAsyncGetMyPlaylist = createAsyncThunk("myPlaylist/get", async () => {
  const res = await axios.get(apiUrlMyPlaylist, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

export const fetchAsyncNewPlaylist = createAsyncThunk(
  "playlist/post",
  async (newPlaylist: PROPS_NEWPLAYLIST) => {
    const uploadData = new FormData();
    uploadData.append("title", newPlaylist.title);
    uploadData.append("url", newPlaylist.url);

    const res = await axios.post(apiUrlPlaylist, uploadData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);


export const fetchAsyncDeletePlaylist = createAsyncThunk(
  "playlist/deletePlaylist",
  async (id: number) => {
    await axios.delete(`${apiUrlDeletePlaylist}${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  }
);


export const fetchAsyncGetAudioFeatures = createAsyncThunk("AudioFeatures/get", async () => {
  const res = await axios.get(apiUrlAudioFeatures, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});


export const playlistSlice = createSlice({
  name: "playlist",
  initialState: {
    isLoadingPlaylist: false,
    isLoadingDeletePlaylist: false,
    openNewPlaylist: false,
    openDeletePlaylist: false,
    openAnalisePlaylist: false,
    playlists: [
      {
        id: 0,
        title: "",
        userPlaylist: 0,
        url: "",
      },
    ],
    myplaylists: [
      {
        id: 0,
        title: "",
        userPlaylist: 0,
        url: "",
      },
    ],
    audioFeatures: [{
      id: 0,
      playlist : "",
      acousticness : 0,
      danceability : 0,
      energy : 0,
      instrumentalness : 0,
      key : 0,
      liveness : 0,
      loudness : 0,
      mode : 0,
      speechiness : 0,
      tempo : 0,
      time_signature : 0,
      valence : 0,
    }],

  },
  reducers: {
    fetchPlaylistStart(state) {
      state.isLoadingPlaylist = true;
    },
    fetchPlaylistEnd(state) {
      state.isLoadingPlaylist = false;
    },
    fetchDeletePlaylistStart(state) {
      state.isLoadingDeletePlaylist = true;
    },
    fetchDeletePlaylistEnd(state) {
      state.isLoadingDeletePlaylist = false;
    },
    setOpenNewPlaylist(state) {
      state.openNewPlaylist = true;
    },
    resetOpenNewPlaylist(state) {
      state.openNewPlaylist = false;
    },
    setOpenDeletePlaylist(state) {
      state.openDeletePlaylist = true;
    },
    resetOpenDeletePlaylist(state) {
      state.openDeletePlaylist = false;
    },
    setOpenAnalisePlaylist(state) {
      state.openAnalisePlaylist = true;
    },
    resetOpenAnalisePlaylist(state) {
      state.openAnalisePlaylist = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetPlaylist.fulfilled, (state, action) =>  {
      state.playlists = action.payload;
    });
    builder.addCase(fetchAsyncGetMyPlaylist.fulfilled, (state, action) =>  {
      state.myplaylists = action.payload;
    });
    builder.addCase(fetchAsyncNewPlaylist.fulfilled, (state, action) => {
      return {
        ...state,
        myplaylists: [...state.myplaylists, action.payload],
      };
    });
    builder.addCase(
      fetchAsyncDeletePlaylist.fulfilled,
      (state, action: PayloadAction<number>) => {
        return {
          ...state,
          tasks: state.myplaylists.filter((p) => p.id !== action.payload),
        };
      }
    );
    builder.addCase(fetchAsyncDeletePlaylist.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(fetchAsyncGetAudioFeatures.fulfilled, (state, action) => {
      return {
        ...state,
        audioFeatures: action.payload,
      };
    });

  },
});

export const {
  fetchPlaylistStart,
  fetchPlaylistEnd,
  fetchDeletePlaylistStart,
  fetchDeletePlaylistEnd,
  setOpenNewPlaylist,
  resetOpenNewPlaylist,
  setOpenDeletePlaylist,
  resetOpenDeletePlaylist,
  setOpenAnalisePlaylist,
  resetOpenAnalisePlaylist,
} = playlistSlice.actions;

export const selectIsLoadingPlaylist = (state: RootState) => state.playlist.isLoadingPlaylist;
export const selectIsLoadingDeletePlaylist = (state: RootState) =>state.playlist.isLoadingDeletePlaylist;
export const selectOpenNewPlaylist = (state: RootState) => state.playlist.openNewPlaylist;
export const selectOpenDeletePlaylist = (state: RootState) => state.playlist.openDeletePlaylist;
export const selectOpenAnalisePlaylist = (state: RootState) => state.playlist.openAnalisePlaylist;
export const selectPlaylists = (state: RootState) => state.playlist.playlists;
export const selectMyPlaylists = (state: RootState) => state.playlist.myplaylists;
export const selectAudioFeatures = (state: RootState) => state.playlist.audioFeatures;


export default playlistSlice.reducer;


