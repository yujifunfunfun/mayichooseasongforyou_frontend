import React, { useEffect } from "react";
import Auth from "../../../features/auth/Auth";

import styles from "../../../features/core/Core.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";

import { withStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Badge,
  CircularProgress,
} from "@material-ui/core";
import {
  editNickname,
  selectProfile,
  selectIsLoadingAuth,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  resetOpenProfile,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../../../features/auth/authSlice";

import {
  selectIsLoadingPost,
  setOpenNewPost,
  resetOpenNewPost,
  fetchAsyncGetPosts,
  fetchAsyncGetComments,
} from "../../../features/post/postSlice";

import NewPost from "../../../features/core/NewPost";
import { NavLink } from "react-router-dom";
import { BsPlusSquare } from "react-icons/bs";




const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const Header: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const isLoadingPost = useSelector(selectIsLoadingPost);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);

  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetProfs());
        await dispatch(fetchAsyncGetComments());
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div>
      <Auth />
      <NewPost />
      <div className={styles.core_header}>
        <h1 className={styles.app_title}>May I Choose A Song For U?</h1>
        {profile?.nickName ? (
          <>
            <div className={styles.navigation_tab_container}>
                  <NavLink to="/" className={styles.navigation_item}>ホーム</NavLink>
                  <NavLink to={`/user/${profile.userProfile}`} className={styles.navigation_item}>マイページ</NavLink>
                  <NavLink to="/analyse" className={styles.navigation_item}>曲分析</NavLink>
                  <NavLink to="/search" className={styles.navigation_item}>曲探し</NavLink>

                  <button
                    className={styles.core_postBtnModal}
                    onClick={() => {
                      dispatch(setOpenNewPost());
                      dispatch(resetOpenProfile());
                    }}
                  >
                    <BsPlusSquare className={styles.plus_square} />&nbsp;&nbsp;投稿
                  </button>
            </div>
            <div className={styles.core_logout}>
              {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
              <button
                onClick={() => {
                  localStorage.removeItem("localJWT");
                  dispatch(editNickname(""));
                  dispatch(resetOpenProfile());
                  dispatch(resetOpenNewPost());
                  dispatch(setOpenSignIn());
                }}
                className={styles.logout_button}
              >
                  ログアウト
              </button>
              <NavLink to={`/user/${profile.userProfile}`}>
              <button
                className={styles.core_btnModal}
              >
                <StyledBadge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  variant="dot"
                >
                  <Avatar alt="who?" src={profile.img} />
                </StyledBadge>
              </button>
              </NavLink>
            </div>
          </>
        ) : (
          <div>
            <button
              onClick={() => {
                dispatch(setOpenSignIn());
                dispatch(resetOpenSignUp());
              }}
              className={styles.logout_button}
            >
              ログイン
            </button>
            <button
              onClick={() => {
                dispatch(setOpenSignUp());
                dispatch(resetOpenSignIn());
              }}
              className={styles.logout_button}
            >
              サインアップ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;