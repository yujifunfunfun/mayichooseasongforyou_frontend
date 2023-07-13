import React, { memo, useEffect } from "react";
import styles from "./MyPage.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  selectProfile,
  selectProfiles,
  setOpenProfile,
} from "../../features/auth/authSlice";
import { Grid, Avatar, Divider } from "@material-ui/core";
import { selectPosts, setOpenDeletePost } from "../../features/post/postSlice";
import EditProfile from "../atoms/EditProfile";
import Post from "../../features/post/Post";
import { NavLink } from "react-router-dom";
import DeletePost from "../atoms/DeletePost";
import { fetchAsyncGetAudioFeatures, fetchAsyncGetMyPlaylist, fetchAsyncGetPlaylist } from "../../features/playlist/playlistSlice";
import { useParams } from 'react-router-dom';
import FollowButton from "../molecules/FollowButton";
import { fetchAsyncGetFollowerList, fetchAsyncGetFollowingList, selectFollowerList, selectFollowingList } from "../../features/connection/connectionSlice";
import UnFollowButton from "../molecules/UnFollowButton";


export const MyPage: React.FC = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const myProfile = useSelector(selectProfile);
  const profiles = useSelector(selectProfiles);
  const posts = useSelector(selectPosts);
  const followingList = useSelector(selectFollowingList);
  const followerList = useSelector(selectFollowerList);

  const params = useParams();
  const { userId } = params;

  const profile = profiles.filter((prof) => {
    return prof.userProfile === Number(userId);
  });

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        const result = await dispatch(fetchAsyncGetFollowerList(profile[0]?.id));
        if (fetchAsyncGetFollowerList.rejected.match(result)) {
          return null;
        }
        await dispatch(fetchAsyncGetFollowingList(profile[0]?.id));
        await dispatch(fetchAsyncGetPlaylist());
        await dispatch(fetchAsyncGetMyPlaylist());
        await dispatch(fetchAsyncGetAudioFeatures());
      }
    };
    fetchBootLoader();
  }, [dispatch, profiles, userId]);

  const myPosts = posts.filter((post) => post.userPost.toString() === userId)

  if (followerList[0] !== 0 && followingList[0] !== 0) {
  return (
    <>
      <EditProfile />
      <div className={styles.mypage_container}>
        <div className={styles.myplofile_container}>
          <div className={styles.myplofile_image_container}>
            <Avatar className={styles.myplofile_image} src={profile[0]?.img} />
          </div>
          <div className={styles.myplofile_content}>
            <div className={styles.nickName}>
              <div>{profile[0]?.nickName}</div>
              <div className={styles.connection_button_container}>
              {myProfile.id !== profile[0]?.id && (
              followerList.includes(myProfile.id) ? (
                <UnFollowButton followerId={myProfile.id} followingId={profile[0]?.id} userProfileId={profile[0].id}/>
              ) : (
                <FollowButton followerId={myProfile.id} followingId={profile[0]?.id} userProfileId={profile[0].id}/>
              )
              )}
              </div>
            </div>
            <br />
            <p className={styles.fav_music_genre}>投稿{myPosts.length}件&emsp;&emsp;<NavLink to={`/user/${userId}/following`} className={styles.connection_link}>フォロー{followingList.length}人</NavLink>&emsp;&emsp;<NavLink to={`/user/${userId}/followers`} className={styles.connection_link}>フォロワー{followerList.length}人</NavLink></p>
            <br />
            <p className={styles.fav_music_genre}>{profile[0]?.fav_music_genre}</p>
            <br />
            <br />
            {(userId===myProfile.userProfile.toString()) &&
            <div className={styles.mpl_epb}>
              <NavLink to="/mypage/myplaylists" className={styles.myplaylist_link}>マイプレイリスト</NavLink>
              <br />
              <button
                className={styles.edit_plofile_button}
                onClick={() => {
                  dispatch(setOpenProfile());
                }}
              >
                プロフィールを編集
              </button>
            </div>
            }
          </div>
        </div>
        <Divider className={styles.mypage_divider} />
        <div>
          <Grid container spacing={1}>
            {myPosts
              .slice(0)
              .reverse()
              .map((post) => (
                <Grid key={post.id} item xs={12} md={4}>
                  <DeletePost postId={post.id} />
                  {(post.userPost===myProfile.userProfile) &&
                  <button className={styles.delete_post_button} onClick={() => {dispatch(setOpenDeletePost());}}>削除</button>
                  }
                  <Post
                    postId={post.id}
                    description={post.description}
                    loginId={myProfile.userProfile}
                    userPost={post.userPost}
                    imageUrl={post.img}
                    liked={post.liked}
                    playlist={post.playlist}
                    genre={post.genre}
                  />
                </Grid>
              ))}
          </Grid>
        </div>
      </div>

    </>

  )
    }
    return null
})

