import React, { useEffect, useState } from "react";
import styles from "./Core.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  Grid,
  Button,
  CircularProgress,
} from "@material-ui/core";
import {
  selectProfile,
  setOpenSignIn,
  resetOpenSignIn,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../auth/authSlice";
import {
  selectPosts,
  fetchAsyncGetPosts,
  fetchAsyncGetComments,
} from "../post/postSlice";
import Post from "../post/Post";
import { fetchAsyncGetAudioFeatures, fetchAsyncGetMyPlaylist, fetchAsyncGetPlaylist } from "../playlist/playlistSlice";
import { AiOutlineSearch } from "react-icons/ai";
import { fetchAsyncGetFollowingList } from "../connection/connectionSlice";

type filterPost = {
  id: number;
  description: string;
  userPost: number;
  created_on: string;
  img: string;
  liked: number[];
  playlist: string;
  genre: string;
}


const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const posts = useSelector(selectPosts);

  const [keyword, setKeyword] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<filterPost[]>(posts);

  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const filteredPostsList = posts.filter((post) => post.genre.includes(keyword) || post.description.includes(keyword));
    setFilteredPosts(filteredPostsList)
    };

  const resetFilter = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setKeyword("")
    setFilteredPosts(posts)
  }

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        await dispatch(fetchAsyncGetProfs());
        await dispatch(fetchAsyncGetFollowingList(profile.id));
        await dispatch(fetchAsyncGetComments());
        await dispatch(fetchAsyncGetPlaylist());
        await dispatch(fetchAsyncGetMyPlaylist());
        await dispatch(fetchAsyncGetAudioFeatures());

        const postsResult = await dispatch(fetchAsyncGetPosts());
        if (fetchAsyncGetPosts.fulfilled.match(postsResult)) {
          setFilteredPosts(postsResult.payload);
        }
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div>
      {profile?.nickName && (
        <>
          <div className={styles.core_posts}>
            <div className={styles.search_playlist_container}>
              <form className={styles.search_playlist_form}>
                <div className={styles.search_playlist}>
                  <div>
                    <input className={styles.search_playlist_input} placeholder="Search" type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    <Button variant="contained" color="primary" style={{ display: 'none' }} type="submit" onClick={handleSubmit} />
                  </div>
                  <div>
                    <button type="submit" className={styles.reset_search_button} onClick={resetFilter}>
                      ✕
                    </button>
                  </div>
                </div>
                <div className={styles.search_playlist_button_container}>
                  <button type="submit" className={styles.search_playlist_button} onClick={handleSubmit}><AiOutlineSearch /></button>
                </div>
                <div className={styles.core_progress}>
                </div>
              </form>
            </div>
            {posts ?
            <Grid container spacing={2}>
            {filteredPosts
                .slice(0)
                .reverse()
                .map((post) => (
                  <Grid key={post.id} item xs={12} md={4}>
                    <Post
                      postId={post.id}
                      description={post.description}
                      loginId={profile.userProfile}
                      userPost={post.userPost}
                      imageUrl={post.img}
                      liked={post.liked}
                      playlist={post.playlist}
                      genre={post.genre}
                    />
                  </Grid>
                ))}
            </Grid>
            :<div className={styles.circular_progress}><CircularProgress /></div>}
          </div>
        </>
      )}
    </div>
  );
};

export default Core;