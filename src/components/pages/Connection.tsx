import React, { memo, useEffect } from "react"
import styles from "./Connection.module.css"

import { useSelector, useDispatch } from "react-redux"
import { AppDispatch } from "../../app/store"

import {
  selectProfile,
  selectProfiles,
} from "../../features/auth/authSlice"

import { Avatar, CircularProgress } from "@material-ui/core"
import { NavLink, useLocation, useParams } from "react-router-dom"
import FollowButton from "../molecules/FollowButton"
import UnFollowButton from "../molecules/UnFollowButton"
import {
  fetchAsyncGetFollowerList,
  fetchAsyncGetFollowingList,
  fetchAsyncGetMyFollowerList,
  fetchAsyncGetMyFollowingList,
  selectFollowerList,
  selectFollowingList,
  selectIsLoadingConnection,
  selectMyFollowingList,
} from "../../features/connection/connectionSlice"


export const Connection: React.FC = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const myProfile = useSelector(selectProfile);
  const profiles = useSelector(selectProfiles);
  const followingList = useSelector(selectFollowingList);
  const followerList = useSelector(selectFollowerList);
  const MyFollowingList = useSelector(selectMyFollowingList);
  const isLoadingConnection = useSelector(selectIsLoadingConnection);


  const location = useLocation();
  const path = location.pathname;

  const params = useParams();
  const { userId } = params;
  const userprofile = profiles.filter((prof) => {
    return prof.userProfile === Number(userId);
  });

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        const result = await dispatch(fetchAsyncGetFollowingList(userprofile[0]?.id));
        if (fetchAsyncGetFollowingList.rejected.match(result)) {
          return null;
        }
        await dispatch(fetchAsyncGetFollowerList(userprofile[0]?.id));
        await dispatch(fetchAsyncGetMyFollowerList(myProfile?.id));
        await dispatch(fetchAsyncGetMyFollowingList(myProfile?.id));
      }
    };
    fetchBootLoader();
  }, [dispatch, profiles, userId]);

  if (followerList[0] !== 0 && followingList[0] !== 0) {
  return (
    <div className={styles.connection}>
      <div className={styles.connection_container}>
        {path.includes("followers") ? (
        <>
          <div className={styles.connection_menu}>
            <div>
              <NavLink to={`/user/${userId}/followers`} className={styles.follower_link_followers}>フォロワー</NavLink>
              <div><hr className={styles.connection_link_border} /></div>
            </div>
            <div>
              <NavLink to={`/user/${userId}/following`} className={styles.following_link_followers}>フォロー中</NavLink>
            </div>
          </div>

          <div className={styles.followers_container}>
            {profiles
              .filter(profile => followerList.includes(profile.id))
              .map(profile => (
                <div className={styles.follower_container}>
                  <NavLink to={`/user/${profile.userProfile}`} className={styles.user_page_link}>
                    <div className={styles.follower_image_container}>
                      <Avatar className={styles.follower_image} src={`https://res.cloudinary.com/hibhbyrja/${profile?.img}`} />
                    </div>
                    <div className={styles.nickName}>
                      {profile?.nickName}
                    </div>
                  </NavLink>
                  <div className={styles.connection_button_container}>
                  {isLoadingConnection ? <div className={styles.circular_progress}><CircularProgress size={30} /></div>:
                    <>
                      {myProfile.id !== profile?.id && (
                      MyFollowingList.includes(profile?.id) ? (
                        <UnFollowButton followerId={myProfile.id} followingId={profile?.id} userProfileId={userprofile[0].id} />
                      ) : (
                        <FollowButton followerId={myProfile.id} followingId={profile?.id} userProfileId={userprofile[0].id}/>
                      )
                      )}
                    </>}
                  </div>
                </div>
              ))}
          </div>
        </>
        ):(
          <>
            <div className={styles.connection_menu}>
              <div>
                <NavLink to={`/user/${userId}/followers`} className={styles.follower_link_following}>フォロワー</NavLink>
              </div>
              <div>
                <NavLink to={`/user/${userId}/following`} className={styles.following_link_following}>フォロー中</NavLink>
                <div><hr className={styles.connection_link_border} /></div>
              </div>
            </div>
            <div className={styles.followers_container}>
              {profiles
                .filter(profile => followingList.includes(profile.id))
                .map(profile => (
                  <div className={styles.follower_container}>
                    <NavLink to={`/user/${profile.userProfile}`} className={styles.user_page_link}>
                      <div className={styles.follower_image_container}>
                        <Avatar className={styles.follower_image} src={`https://res.cloudinary.com/hibhbyrja/${profile?.img}`} />
                      </div>
                      <div className={styles.nickName}>
                        {profile?.nickName}
                      </div>
                    </NavLink>
                    <div className={styles.connection_button_container}>
                    {isLoadingConnection ? <div className={styles.circular_progress}><CircularProgress size={30} /></div>:
                      <>
                        {myProfile.id !== profile?.id && (
                        MyFollowingList.includes(profile?.id) ? (
                          <UnFollowButton followerId={myProfile.id} followingId={profile?.id} userProfileId={userprofile[0].id} />
                        ) : (
                          <FollowButton followerId={myProfile.id} followingId={profile?.id} userProfileId={userprofile[0].id} />
                        )
                        )}
                      </>}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
return null
})

