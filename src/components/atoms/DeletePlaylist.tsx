import Modal from "react-modal";
import styles from "../pages/MyPlaylists.module.css";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

import { CircularProgress } from "@material-ui/core";

import { fetchAsyncDeletePlaylist, fetchAsyncGetMyPlaylist, fetchDeletePlaylistEnd, fetchDeletePlaylistStart, resetOpenDeletePlaylist, selectIsLoadingDeletePlaylist, selectOpenDeletePlaylist } from "../../features/playlist/playlistSlice";

const customStyles = {
  overlay: {
    backgroundColor: "rgb(14, 14, 15, 0.8)",
  },
  content: {
    top: "55%",
    left: "50%",
    width: 200,
    height: 100,
    padding: "50px",
    transform: "translate(-50%, -50%)",
  },
};

type Props = {
  playlistId: any
}

const DeletePlaylist: React.FC<Props> = (props) => {
  const {playlistId} = props
  const dispatch: AppDispatch = useDispatch();
  const openDeletePlaylist = useSelector(selectOpenDeletePlaylist);
  const isLoadingDeletePlaylist = useSelector(selectIsLoadingDeletePlaylist);


  const deletePlaylist = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await dispatch(fetchDeletePlaylistStart());
    await dispatch(fetchAsyncDeletePlaylist(playlistId));
    await dispatch(fetchDeletePlaylistEnd());
    await dispatch(fetchAsyncGetMyPlaylist());
    dispatch(resetOpenDeletePlaylist());
  };

  return (
    <>
      <Modal
        isOpen={openDeletePlaylist}
        onRequestClose={async () => {
          await dispatch(resetOpenDeletePlaylist());
        }}
        style={customStyles}
      >
        <form className={styles.delete_playlist_form}>
          <p className={styles.delete_playlist_title}>削除しますか？</p>
          <br />
          <br />
          <div className={styles.delete_button_container}>
            <button
              type="submit"
              disabled={isLoadingDeletePlaylist}
              onClick={deletePlaylist}
              className={styles.delete_confirm_button}
            >
              削除する
            </button>
            <br />
            <button
              type="submit"
              disabled={isLoadingDeletePlaylist}
              onClick={async () => {
                await dispatch(resetOpenDeletePlaylist());
              }}
              className={styles.cancel_delete_button}

            >
              キャンセル
            </button>
          </div >
          <div className={styles.core_progress}>
            {isLoadingDeletePlaylist && <CircularProgress />}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DeletePlaylist;