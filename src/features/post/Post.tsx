import React, { memo, useEffect, useState } from "react";
import styles from "./Post.module.css";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Divider, Checkbox } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectProfile, selectProfiles } from "../auth/authSlice";
import {
  selectComments,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncPostComment,
  fetchAsyncPatchLiked,
} from "./postSlice";
import { PROPS_POST } from "../types";
import { selectAudioFeatures, selectPlaylists } from "../playlist/playlistSlice";
import { NavLink } from "react-router-dom";
import { fetchAsyncGetFollowerList, fetchAsyncGetFollowingList, fetchAsyncGetMyFollowingList, selectFollowerList, selectMyFollowingList } from "../connection/connectionSlice";
import UnFollowButton from "../../components/molecules/UnFollowButton";
import FollowButton from "../../components/molecules/FollowButton";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

const Post: React.FC<PROPS_POST> = memo(({
  postId,
  loginId,
  userPost,
  description,
  imageUrl,
  liked,
  playlist,
  genre
}) => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const profiles = useSelector(selectProfiles);
  const myProfile = useSelector(selectProfile);
  const comments = useSelector(selectComments);
  const playlists = useSelector(selectPlaylists);
  const audioFeatures = useSelector(selectAudioFeatures);
  const MyFollowingList = useSelector(selectMyFollowingList);
  const followerList = useSelector(selectFollowerList);

  const [text, setText] = useState("");

  const commentsOnPost = comments.filter((com) => {
    return com.post === postId;
  });

  const prof = profiles.filter((prof) => {
    return prof.userProfile === userPost;
  });

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        const result = await dispatch(fetchAsyncGetMyFollowingList(myProfile.id));
        if (fetchAsyncGetFollowingList.rejected.match(result)) {
          return null;
        }
        await dispatch(fetchAsyncGetFollowerList(prof[0]?.id));
      }
    };
    fetchBootLoader();
  }, [dispatch, profiles]);

  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { text: text, post: postId };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPostComment(packet));
    await dispatch(fetchPostEnd());
    setText("");
  };

  const handlerLiked = async () => {
    const packet = {
      id: postId,
      description: description,
      playlist: playlist,
      genre: genre,
      current: liked,
      new: loginId,
    };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPatchLiked(packet));
    await dispatch(fetchPostEnd());
  };

  if (followerList[0] !== 0) {
    return (
      <div className={styles.post}>
        <div className={styles.post_header}>
          <NavLink to={`/user/${userPost}`} className={styles.post_header_link}>
          <Avatar className={styles.post_avatar} src={`https://res.cloudinary.com/hibhbyrja/${prof[0]?.img}`} />
          <h3 className={styles.post_nickName}>{prof[0]?.nickName}</h3>
          </NavLink>
          <div className={styles.connection_button_container}>
            {myProfile.id !== prof[0]?.id && (
              MyFollowingList.includes(prof[0].id) ? (
                <UnFollowButton followerId={myProfile.id} followingId={prof[0]?.id} />
              ) : (
                <FollowButton followerId={myProfile.id} followingId={prof[0]?.id} />
              )
            )}
          </div>
        </div>
        <img className={styles.post_image} src={`https://res.cloudinary.com/hibhbyrja/${imageUrl}`} alt="" />

        <div className={styles.readmore}>
          <input id={postId.toString()} className={styles.readmore_check} type="checkbox" />
            <div className={styles.readmore_content}>
              <h4 className={styles.post_text}>
                <div className={styles.container}>
                <Checkbox
                  className={styles.post_checkBox}
                  icon={<FavoriteBorder className={styles.favorite_border} />}
                  checkedIcon={<Favorite />}
                  checked={liked.some((like) => like === loginId)}
                  onChange={handlerLiked}
                />
                <AvatarGroup max={7}>
                  {liked.map((like) => (
                    <Avatar
                      className={styles.post_avatarGroup}
                      key={like}
                      src={`https://res.cloudinary.com/hibhbyrja/${profiles.find((prof) => prof.userProfile === like)?.img}`}
                    />
                  ))}
                </AvatarGroup>
                </div>
                  <p>Title&nbsp;-&nbsp;
                  {playlists.map((pl) => {
                      if (pl.url === playlist){
                        return <a href={pl.url} className={styles.post_playlist_link}>{pl.title}</a>;
                      }
                      return null;
                    })}
                  </p>
                  <p>Genre&nbsp;-&nbsp;{genre}</p>
                  <br />
                  <p>{description}</p>
                  <br />
                  <div>
                  {audioFeatures
                    .filter(audioFeature => audioFeature.playlist === playlist)
                    .map(audioFeature => (
                      <>
                        <Divider className={styles.audio_feature_divider} />
                        <div className={styles.audio_feature_content}>
                          <div key={audioFeature.id} className={styles.audio_feature_name}>アコースティックネス</div><div className={styles.audio_feature}>{audioFeature.acousticness}%</div>
                        </div>
                        <div className={styles.audio_feature_content}>
                          <div className={styles.audio_feature_name}>ダンサビリティー</div><div className={styles.audio_feature}>{audioFeature.danceability}%</div>
                        </div>
                        <div className={styles.audio_feature_content}>
                          <div className={styles.audio_feature_name}>エネルギッシュネス</div><div className={styles.audio_feature}>{audioFeature.energy}%</div>
                        </div>
                        <div className={styles.audio_feature_content}>
                          <div className={styles.audio_feature_name}>インストルメンタルネス</div><div className={styles.audio_feature}>{audioFeature.instrumentalness}%</div>
                        </div>
                        <div className={styles.audio_feature_content}>
                          <div className={styles.audio_feature_name}>ライブネス</div><div className={styles.audio_feature}>{audioFeature.liveness}%</div>
                        </div>
                        <div className={styles.audio_feature_content}>
                          <div className={styles.audio_feature_name}>ポジティビリティー</div><div className={styles.audio_feature}>{audioFeature.valence}%</div>
                        </div>
                        <div className={styles.audio_feature_content}>
                          <div className={styles.audio_feature_name}>スピーチネス</div><div className={styles.audio_feature}>{audioFeature.speechiness}%</div>
                        </div>
                        <div className={styles.audio_feature_content}>
                          <div className={styles.audio_feature_name}>ラウドネス(-60～0db)</div><div className={styles.audio_feature}>{audioFeature.loudness}db</div>
                        </div>
                        <div className={styles.audio_feature_content}>
                          <div className={styles.audio_feature_name}>BPM</div><div className={styles.audio_feature}>{audioFeature.tempo}</div>
                        </div>
                        <div className={styles.audio_feature_content}>
                          <div className={styles.audio_feature_name}>1小節あたりの拍子</div><div className={styles.audio_feature}>{audioFeature.time_signature}</div>
                        </div>
                        <div className={styles.audio_feature_content}>
                          <div className={styles.audio_feature_name}>キー(0 = C, 1 = C♯/D♭, 2 = D,...)</div><div className={styles.audio_feature}>{audioFeature.key}</div>
                        </div>
                        <div className={styles.audio_feature_content}>
                          <div className={styles.audio_feature_name}>コード(マイナー=0,メジャー=1)</div><div className={styles.audio_feature}>{audioFeature.mode}</div>
                        </div>
                      </>
                    ))}
                  </div>
              </h4>
              {commentsOnPost[0] && (
                <>
                  <Divider className={styles.post_divider} />
                  <div className={styles.post_comments}>
                    {commentsOnPost.map((comment) => (
                      <div key={comment.id} className={styles.post_comment}>
                        <Avatar
                          src={
                            profiles.find(
                              (prof) => prof.userProfile === comment.userComment
                            )?.img
                          }
                          className={classes.small}
                        />
                        <p>
                          <strong className={styles.post_strong}>
                            {
                              profiles.find(
                                (prof) => prof.userProfile === comment.userComment
                              )?.nickName
                            }
                          </strong>
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <form className={styles.post_commentBox}>
                <input
                  className={styles.post_input}
                  type="text"
                  placeholder="add a comment"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button
                  disabled={!text.length}
                  className={styles.post_button}
                  type="submit"
                  onClick={postComment}
                >
                  Post
                </button>
              </form>
            </div>
          <label className={styles.readmore_label} htmlFor={postId.toString()}></label>
        </div>
      </div>
    );
  }
  return null;
});

export default Post;