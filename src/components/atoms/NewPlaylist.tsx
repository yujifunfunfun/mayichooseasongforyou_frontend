import React, { memo, useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "../pages/MyPlaylists.module.css";
import { Button, CircularProgress, TextField } from "@material-ui/core";
import { fetchAsyncNewPlaylist, fetchPlaylistEnd, fetchPlaylistStart, resetOpenNewPlaylist, selectIsLoadingPlaylist, selectOpenNewPlaylist } from "../../features/playlist/playlistSlice";

const customStyles = {
  overlay: {
    backgroundColor: "rgb(14, 14, 15, 0.8)",
  },
  content: {
    top: "55%",
    left: "50%",
    width: 300,
    height: 250,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const NewPlaylist: React.FC = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const openNewPlaylist = useSelector(selectOpenNewPlaylist);
  const isLoadingPlaylist = useSelector(selectIsLoadingPlaylist);


  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const newPlaylist = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { title: title, url: url };
    await dispatch(fetchPlaylistStart());
    await dispatch(fetchAsyncNewPlaylist(packet));
    await dispatch(fetchPlaylistEnd());
    setTitle("");
    setUrl("");
    dispatch(resetOpenNewPlaylist());
  };

  return (
    <>
      <Modal
        isOpen={openNewPlaylist}
        onRequestClose={async () => {
          await dispatch(resetOpenNewPlaylist());
        }}
        style={customStyles}
      >
        <form className={styles.newPlaylist_form}>
          <p className={styles.newPlaylist_form_title}>プレイリスト新規投稿</p>

          <br />
          <TextField
            placeholder="title"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            placeholder="url"
            type="text"
            onChange={(e) => setUrl(e.target.value)}
          />
          <br />
          <br />
          {isLoadingPlaylist ? <div className={styles.circular_progress}><CircularProgress /></div>:
          <Button
            disabled={!title || !url.includes("https://open.spotify.com/playlist/")}
            variant="contained"
            color="primary"
            onClick={newPlaylist}
          >
            投稿
          </Button>}
        </form>
      </Modal>
    </>
  );
});

export default NewPlaylist;