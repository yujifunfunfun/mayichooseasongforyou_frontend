import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { fetchAsyncGetAudioFeatures, fetchAsyncGetMyPlaylist, selectAudioFeatures, selectMyPlaylists, setOpenAnalisePlaylist, setOpenDeletePlaylist, setOpenNewPlaylist } from '../../features/playlist/playlistSlice';
import NewPlaylist from '../atoms/NewPlaylist';
import AnalisePlaylist from '../atoms/AnalisePlaylist';
import styles from "./MyPlaylists.module.css";
import { Divider } from '@material-ui/core';
import DeletePlaylist from '../atoms/DeletePlaylist';


export const MyPlaylists: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const playlists = useSelector(selectMyPlaylists);
  const audioFeatures = useSelector(selectAudioFeatures);

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        const result = await dispatch(fetchAsyncGetMyPlaylist());
        if (fetchAsyncGetMyPlaylist.rejected.match(result)) {
          return null;
        }
        await dispatch(fetchAsyncGetAudioFeatures());
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <>
      <NewPlaylist />
      <AnalisePlaylist />
      <div className={styles.myplaylist_container}>
        <div className={styles.button_container}>
          <button
            onClick={() => {
              dispatch(setOpenNewPlaylist());
            }}
            className={styles.post_playlist_button}
          >プレイリスト追加
          </button>
          <br />
          <br />
          <button
            onClick={() => {
              dispatch(setOpenAnalisePlaylist());
            }}
            className={styles.analise_playlist_button}
          >プレイリスト分析
          </button>
        </div>
        <br />
        <br />
        <div className={styles.myplaylist_contents}>
        <Divider className={styles.plsylist_divider} />
          {playlists.map((playlist) => (
            <>
              <DeletePlaylist playlistId={playlist.id} />
              <div className={styles.readmore}>
              <input id={playlist.url} className={styles.readmore_check} type="checkbox" />
              <div className={styles.readmore_content}>
              <div className={styles.myplaylist_title}>
                <a href={ playlist.url } className={styles.myplaylist_link}>{playlist.title}</a>
                <button className={styles.delete_playlist_button} onClick={() => {dispatch(setOpenDeletePlaylist());}}>削除</button>
              </div>
                {audioFeatures
                  .filter(audioFeature => audioFeature.playlist === playlist.url)
                  .map(audioFeature => (
                    <>
                      <div>
                        <table className={styles.brwsr2}>
                          <tbody>
                            <tr>
                              <th>アコースティックネス</th>
                              <td className={styles.data}>
                              {audioFeature.acousticness}%
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.bar} colSpan={6}></td>
                            </tr>
                            <tr>
                              <th>ダンサビリティー</th>
                              <td className={styles.data}>
                              {audioFeature.danceability}%
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.bar} colSpan={6}></td>
                            </tr>
                            <tr>
                              <th>エネルギッシュネス</th>
                              <td className={styles.data}>
                              {audioFeature.energy}%
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.bar} colSpan={6}></td>
                            </tr>
                            <tr>
                              <th>インストルメンタルネス</th>
                              <td className={styles.data}>
                              {audioFeature.instrumentalness}%
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.bar} colSpan={6}></td>
                            </tr>
                            <tr>
                              <th>ライブネス</th>
                              <td className={styles.data}>
                              {audioFeature.liveness}%
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.bar} colSpan={6}></td>
                            </tr>
                            <tr>
                              <th>ポジティビリティー</th>
                              <td className={styles.data}>
                              {audioFeature.valence}%
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.bar} colSpan={6}></td>
                            </tr>
                            <tr>
                              <th>スピーチネス</th>
                              <td className={styles.data}>
                              {audioFeature.speechiness}%
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.bar} colSpan={6}></td>
                            </tr>
                            <tr>
                              <th>ラウドネス(-60～0db)</th>
                              <td className={styles.data}>
                              {audioFeature.loudness}db
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.bar} colSpan={6}></td>
                            </tr>
                            <tr>
                              <th>BPM</th>
                              <td className={styles.data}>
                              {audioFeature.tempo}
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.bar} colSpan={6}></td>
                            </tr>
                            <tr>
                              <th>1小節あたりの拍子</th>
                              <td className={styles.data}>
                              {audioFeature.time_signature}
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.bar} colSpan={6}></td>
                            </tr>
                            <tr>
                              <th>キー(0 = C, 1 = C♯/D♭, 2 = D,...)</th>
                              <td className={styles.data}>
                              {audioFeature.key}
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.bar} colSpan={6}></td>
                            </tr>
                            <tr>
                              <th>コード(マイナー = 0,メジャー = 1)</th>
                              <td className={styles.data}>
                              {audioFeature.mode}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                ))}
              <br />

              </div>
              {audioFeatures
                  .filter(audioFeature => audioFeature.playlist === playlist.url)
                  .map(audioFeature => (
              <label className={styles.readmore_label} htmlFor={playlist.url}></label>
                  ))}
              </div>
              <Divider className={styles.plsylist_divider} />

            </>
          ))}
        </div>
      </div>
    </>
  )

}

