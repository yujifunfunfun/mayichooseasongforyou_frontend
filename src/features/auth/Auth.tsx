import React from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Auth.module.css";
import Modal from "react-modal";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import { fetchAsyncGetPosts, fetchAsyncGetComments } from "../post/postSlice";
import {
  selectIsLoadingAuth,
  selectOpenSignIn,
  selectOpenSignUp,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncCreateProf,
  selectError,
  resetError,
} from "./authSlice";
import { fetchAsyncGetAudioFeatures, fetchAsyncGetMyPlaylist } from "../playlist/playlistSlice";

const customStyles = {
  overlay: {
    backgroundColor: "#0E0E0F",
  },
  content: {
    top: "55%",
    left: "50%",
    width: 400,
    height: 400,
    padding: "50px",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
  },
};

const Auth: React.FC = () => {
  Modal.setAppElement("#root");
  const openSignIn = useSelector(selectOpenSignIn);
  const openSignUp = useSelector(selectOpenSignUp);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const error = useSelector(selectError);

  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <Modal
        isOpen={openSignUp}
        style={customStyles}
      >
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "" ,nickName: "", fav_music_genre: "",}}
          onSubmit={async (values) => {

            const user_values: { email: string; password: string } = {email: "", password: ""};
            user_values["email"] = values.email
            user_values["password"] = values.password

            const plofile_values: { nickName: string; fav_music_genre: string } = {nickName: "", fav_music_genre: ""};
            plofile_values["nickName"] = values.nickName
            plofile_values["fav_music_genre"] = values.fav_music_genre

            await dispatch(fetchCredStart());
            const resultReg = await dispatch(fetchAsyncRegister(user_values));
            if (fetchAsyncRegister.fulfilled.match(resultReg)) {
              await dispatch(fetchAsyncLogin(user_values));
              await dispatch(fetchAsyncCreateProf(plofile_values));
              await dispatch(fetchAsyncGetProfs());
              await dispatch(fetchAsyncGetPosts());
              await dispatch(fetchAsyncGetComments());
              await dispatch(fetchAsyncGetMyProf());
            }
            await dispatch(fetchCredEnd());
            await dispatch(resetOpenSignUp());
          }}
          validationSchema={Yup.object().shape({
            nickName: Yup.string().required("必須項目です"),
            email: Yup.string()
              .email("正しい形式で入力してください")
              .required("必須項目です"),
            password: Yup.string().required("必須項目です").test('password-length', 'パスワードは4文字以上で入力してください', value => value.length >= 4),
            fav_music_genre: Yup.string().required("必須項目です"),
          })}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <div>
              <form onSubmit={handleSubmit}>
                <div className={styles.auth_signUp}>
                {isLoadingAuth ? <div className={styles.circular_progress}><CircularProgress /></div>:
                  <>
                  <h1 className={styles.auth_title}>登録する</h1>
                  <br />
                  <TextField
                    placeholder="ニックネーム"
                    type="input"
                    name="nickName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nickName}
                  />
                  {touched.nickName && errors.nickName ? (
                    <div className={styles.auth_error}>{errors.nickName}</div>
                  ) : null}
                  <br />


                  <TextField
                    placeholder="好きな音楽のジャンル"
                    type="input"
                    name="fav_music_genre"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.fav_music_genre}
                  />
                  {touched.fav_music_genre && errors.fav_music_genre ? (
                    <div className={styles.auth_error}>{errors.fav_music_genre}</div>
                  ) : null}
                  <br />
                  <TextField
                    placeholder="メールアドレス"
                    type="input"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {touched.email && errors.email ? (
                    <div className={styles.auth_error}>{errors.email}</div>
                  ) : null}
                  <br />
                  <TextField
                    placeholder="パスワード"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {touched.password && errors.password ? (
                    <div className={styles.auth_error}>{errors.password}</div>
                  ) : null}
                  <br />
                  <br />

                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isValid}
                    type="submit"
                  >
                    登録
                  </Button>
                  <br />
                  <br />
                  <span
                    className={styles.auth_text}
                    onClick={async () => {
                      await dispatch(setOpenSignIn());
                      await dispatch(resetOpenSignUp());
                    }}
                  >
                    既にアカウントを持っている
                  </span>
                  </>}
                </div>
              </form>
            </div>
          )}
        </Formik>
      </Modal>

      <Modal
        isOpen={openSignIn}
        // onRequestClose={async () => {
        //   await dispatch(resetOpenSignIn());
        // }}
        style={customStyles}
      >
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await dispatch(resetError());
            await dispatch(fetchCredStart());
            const result = await dispatch(fetchAsyncLogin(values));
            if (fetchAsyncLogin.fulfilled.match(result)) {
              await dispatch(fetchAsyncGetProfs());
              await dispatch(fetchAsyncGetPosts());
              await dispatch(fetchAsyncGetComments());
              await dispatch(fetchAsyncGetMyProf());
              await dispatch(fetchAsyncGetMyPlaylist());
              await dispatch(fetchAsyncGetAudioFeatures());
              await dispatch(resetOpenSignIn());
            }
            await dispatch(fetchCredEnd());
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("正しい形式で入力してください")
              .required("必須項目です"),
            password: Yup.string().required("必須項目です"),
          })}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <div>
              <form onSubmit={handleSubmit}>
                <div className={styles.auth_signUp}>
                  <h1 className={styles.auth_title}>ログイン</h1>
                  <br />
                  <br />
                  <TextField
                    placeholder="メールアドレス"
                    type="input"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {touched.email && errors.email ? (
                    <div className={styles.auth_error}>{errors.email}</div>
                  ) : null}
                  <br />

                  <TextField
                    placeholder="パスワード"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {touched.password && errors.password ? (
                    <div className={styles.auth_error}>{errors.password}</div>
                  ) : null}
                  <br />
                  {error && <div className={styles.auth_error}>{error}</div>  }
                  <br />
                  {isLoadingAuth ? <div className={styles.circular_progress}><CircularProgress /></div>:
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isValid}
                      type="submit"
                    >
                      ログイン
                    </Button>
                    <br />
                    <br />
                    <span
                      className={styles.auth_text}
                      onClick={async () => {
                        await dispatch(resetOpenSignIn());
                        await dispatch(setOpenSignUp());
                        await dispatch(resetError());
                      }}
                    >
                      アカウントを作成する
                    </span>
                  </>}
                </div>
              </form>
            </div>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default Auth;