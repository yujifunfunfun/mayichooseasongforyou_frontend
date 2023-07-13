/* eslint  @typescript-eslint/no-unused-expressions: "off" */

import React, { memo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./AnalyseAudio.module.css";
import { CircularProgress } from "@material-ui/core";
import { fetchPlaylistEnd, fetchPlaylistStart, selectIsLoadingPlaylist } from "../../features/playlist/playlistSlice";
import axios from "axios";


const AnalyseAudio: React.FC = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const isLoadingPlaylist = useSelector(selectIsLoadingPlaylist);
  const [trackUrl, setTrackUrl] = useState("");
  const [audioFeatures, setAudioFeatures] = useState<Array<Number>>([]);
  const [error, setError] = useState<any>();


  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const nextSharpNum = trackUrl.indexOf("track/") + 6;
    const track_id = trackUrl.substring(nextSharpNum)
    await dispatch(fetchPlaylistStart());
      try {
        const response = await axios.get(`${process.env.REACT_APP_DEV_API_URL}api/track/${track_id}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        });
        const data = response.data
        setAudioFeatures(data)
      } catch (error) {
        console.error('Error:', error);
        setError(error)
      }
      await dispatch(fetchPlaylistEnd());
    };


  return (
    <>
      <div className={styles.analyse_audio_container} >
        <form className={styles.analyse_audio_form}>
          <h1 className={styles.analyse_audio_title}>曲を分析する</h1>
          <br />
          <br />
          <div className={styles.analyse_audio}>
            <input placeholder="URL" type="text" className={styles.analyse_audio_input} onChange={(e) => setTrackUrl(e.target.value)} />
          </div>
          <br />

            {isLoadingPlaylist ? <CircularProgress />:
              <button
              disabled={!trackUrl.includes("track/")}
              type="submit"
              onClick={handleSubmit}
              className={styles.analyse_button}
            >
              分析する
            </button>
            }
        </form>
        <div className={styles.analyse_result}>
          {audioFeatures[0] ? (
            <>
              <table className={styles.brwsr2}>
                <tbody>
                  <tr>
                    <th>アコースティックネス</th>
                    <td className={styles.data}>
                    {audioFeatures[0].toString()}%
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.bar} colSpan={6}></td>
                  </tr>
                  <tr>
                    <th>ダンサビリティー</th>
                    <td className={styles.data}>
                    {audioFeatures[1].toString()}%
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.bar} colSpan={6}></td>
                  </tr>
                  <tr>
                    <th>エネルギッシュネス</th>
                    <td className={styles.data}>
                    {audioFeatures[2].toString()}%
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.bar} colSpan={6}></td>
                  </tr>
                  <tr>
                    <th>インストルメンタルネス</th>
                    <td className={styles.data}>
                    {audioFeatures[3].toString()}%
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.bar} colSpan={6}></td>
                  </tr>
                  <tr>
                    <th>ライブネス</th>
                    <td className={styles.data}>
                    {audioFeatures[5].toString()}%
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.bar} colSpan={6}></td>
                  </tr>
                  <tr>
                    <th>ポジティビリティー</th>
                    <td className={styles.data}>
                    {audioFeatures[11].toString()}%
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.bar} colSpan={6}></td>
                  </tr>
                  <tr>
                    <th>スピーチネス</th>
                    <td className={styles.data}>
                    {audioFeatures[8].toString()}%
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.bar} colSpan={6}></td>
                  </tr>
                  <tr>
                    <th>ラウドネス(-60～0db)</th>
                    <td className={styles.data}>
                    {audioFeatures[6].toString()}db
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.bar} colSpan={6}></td>
                  </tr>
                  <tr>
                    <th>BPM</th>
                    <td className={styles.data}>
                    {audioFeatures[9].toString()}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.bar} colSpan={6}></td>
                  </tr>
                  <tr>
                    <th>1小節あたりの拍子</th>
                    <td className={styles.data}>
                    {audioFeatures[10].toString()}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.bar} colSpan={6}></td>
                  </tr>
                  <tr>
                    <th>キー(0 = C, 1 = C♯/D♭, 2 = D,...)</th>
                    <td className={styles.data}>
                    {audioFeatures[4].toString()}
                    </td>
                  </tr>
                  <tr>
                    <td className={styles.bar} colSpan={6}></td>
                  </tr>
                  <tr>
                    <th>コード(マイナー = 0,メジャー = 1)</th>
                    <td className={styles.data}>
                    {audioFeatures[7].toString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>) : error ? (
              <div className={styles.error_message}>分析できませんでした。<br />URLを確認してください。</div>
            ): null
          }
        </div>
      </div>


    </>
  );
});

export default AnalyseAudio;