/* eslint  @typescript-eslint/no-unused-expressions: "off" */

import React, { memo, useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "../pages/MyPlaylists.module.css";
import { Button, CircularProgress } from "@material-ui/core";
import { fetchPlaylistEnd, fetchPlaylistStart, resetOpenAnalisePlaylist, selectIsLoadingPlaylist, selectOpenAnalisePlaylist, selectMyPlaylists } from "../../features/playlist/playlistSlice";
import Select from "react-select";
import axios from "axios";



const customStyles = {
  overlay: {
    backgroundColor: "rgb(14, 14, 15, 0.8)",
  },
  content: {
    top: "55%",
    left: "50%",
    width: 350,
    height: 300,
    padding: "50px",
    transform: "translate(-50%, -50%)",
  },
};

const AnalisePlaylist: React.FC = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const openAnalisePlaylist = useSelector(selectOpenAnalisePlaylist);
  const myPlaylists = useSelector(selectMyPlaylists);
  const isLoadingPlaylist = useSelector(selectIsLoadingPlaylist);


  const options = myPlaylists.map((myPlaylist) => {
      return { value: myPlaylist.url, label: myPlaylist.title };
  });

  const [selectedPlaylist, setSelectedPlaylist] = useState(options[0]);

  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const playlist_url = selectedPlaylist.value
    const nextSharpNum = playlist_url.indexOf("playlist/") + 9;
    const playlist_id = playlist_url.substring(nextSharpNum)
    await dispatch(fetchPlaylistStart());
      try {
        const response = await axios.get(`${process.env.REACT_APP_DEV_API_URL}api/playlist/analyse/${playlist_id}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        });
      } catch (error) {
        console.error('Error:', error);
      }
      await dispatch(fetchPlaylistEnd());
      await dispatch(resetOpenAnalisePlaylist());
      window.location.reload();
  };
  return (
    <>
      <Modal
        isOpen={openAnalisePlaylist}
        onRequestClose={async () => {
          await dispatch(resetOpenAnalisePlaylist());
        }}
        style={customStyles}
      >
        <form className={styles.analise_form}>
          <p className={styles.analise_title}>プレイリスト分析</p>
          <br />
          <br />
          <div>
            <Select
              options={options}
              placeholder="プレイリストを選ぶ"
              onChange={(value) => {
              value ? setSelectedPlaylist(value) : null;
              }}
              noOptionsMessage={() => "プレイリストを追加してください"}
            />
          </div>
          <br />

          {isLoadingPlaylist ? <div className={styles.circular_progress}><CircularProgress /></div>:
              <div>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!selectedPlaylist}
                onClick={handleSubmit}
              >
                分析する
              </Button>
            </div>
            }

        </form>
      </Modal>
    </>
  );
});

export default AnalisePlaylist;