/* eslint  @typescript-eslint/no-unused-expressions: "off" */

import React, { memo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./SearchAudio.module.css";
import { CircularProgress, Divider } from "@material-ui/core";
import { fetchPlaylistEnd, fetchPlaylistStart, selectIsLoadingPlaylist } from "../../features/playlist/playlistSlice";
import axios from "axios";


const SearchAudio: React.FC = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const isLoadingPlaylist = useSelector(selectIsLoadingPlaylist);
  const [trackUrl, setTrackUrl] = useState("");
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [similarAudioList, setSimilarAudioList] = useState<Array<Array<string>>>([[]]);
  const [error, setError] = useState<any>();

  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const tId = trackUrl.indexOf("track/") + 6;
    const track_id = trackUrl.substring(tId)
    const pId = playlistUrl.indexOf("playlist/") + 9;
    const playlist_id = playlistUrl.substring(pId)

    await dispatch(fetchPlaylistStart());
      try {
        const response = await axios.get(`${process.env.REACT_APP_DEV_API_URL}api/search/${track_id}/${playlist_id}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        });
        const data = response.data
        setSimilarAudioList(data)
      } catch (error) {
        console.error('Error:', error);
        setError(error)
      }
      await dispatch(fetchPlaylistEnd());
    };


  return (
    <>
      <div className={styles.search_audio_container} >
        <form className={styles.search_audio_form}>
          <h1 className={styles.search_audio_title}>プレイリストから似た曲を探す</h1>
          <br />
          <br />
          <div className={styles.search_audio}>
            <input placeholder="曲のURL" type="text" className={styles.search_audio_input} onChange={(e) => setTrackUrl(e.target.value)} />
          </div>
          <br />
          <div className={styles.search_audio}>
            <input placeholder="プレイリストのURL" type="text" className={styles.search_audio_input} onChange={(e) => setPlaylistUrl(e.target.value)} />
          </div>
          <br />

          <div className={styles.core_progress}>
            {isLoadingPlaylist ? <CircularProgress /> :
              <button
              disabled={!trackUrl.includes("track/") || !playlistUrl.includes("playlist/") || isLoadingPlaylist}
              type="submit"
              onClick={handleSubmit}
              className={styles.search_button}
            >
              探す
            </button>
            }
          </div>
        </form>
        <div className={styles.search_audio_result_container}>
        {similarAudioList[0][1] ? (
            <>
              <div className={styles.search_audio_result_headline}>
                <div className={styles.headline_name}>曲名</div>
                <div className={styles.headline_artist}>アーティスト</div>
              </div>
              <Divider className={styles.search_audio_result_border} />
              <div className={styles.search_audio_result_content}>
                {similarAudioList.map((similarAudio) => (
                  <div className={styles.search_audio_result} key={similarAudio[0]}>
                    <div className={styles.similar_audio_name}>
                      <a href={similarAudio[1]} className={styles.similar_audio_link}>
                        {similarAudio[0]}
                      </a>
                    </div>
                    <div className={styles.similar_audio_artist}>{similarAudio[2]}</div>
                  </div>
                ))}
              </div>
            </>
          ) : similarAudioList[0][0]==="None" ? (
            <p>似た曲はありませんでした。</p>
          ): error ? (
            <div className={styles.error_message}>正しいURLを入力してください。</div>
          ): null}
        </div>
      </div>
    </>
  );
});

export default SearchAudio;