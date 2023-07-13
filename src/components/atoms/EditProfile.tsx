import React, { useState } from "react";
import Modal from "react-modal";
import styles from "../pages/MyPage.module.css";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { File } from "../../features/types";
import {
  editNickname,
  selectProfile,
  selectOpenProfile,
  resetOpenProfile,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncUpdateProf,
  editFavMusicGenre,
} from "../../features/auth/authSlice";
import { Button, TextField } from "@material-ui/core";

const customStyles = {
  overlay: {
    backgroundColor: "rgb(14, 14, 15, 0.8)",
  },
  content: {
    top: "55%",
    left: "50%",
    width: 450,
    height: 350,
    padding: "50px",
    transform: "translate(-50%, -50%)",
  },
};

const ProfileFileInputWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const StyledProfileFileInput = styled.input`
  display: none;
`;
const ProfileFileName = styled.span`
  margin-left: 10px;
  font-size: 12px;
  color: #888;
`;


const EditProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openProfile = useSelector(selectOpenProfile);
  const profile = useSelector(selectProfile);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { id: profile.id, nickName: profile.nickName, img: profileImage, fav_music_genre: profile.fav_music_genre };

    await dispatch(fetchCredStart());
    await dispatch(fetchAsyncUpdateProf(packet));
    await dispatch(fetchCredEnd());
    await dispatch(resetOpenProfile());
    setProfileImage(null);
  };

  return (
    <>
      <Modal
        isOpen={openProfile}
        onRequestClose={async () => {
          await dispatch(resetOpenProfile());
          setProfileImage(null)
        }}
        style={customStyles}
      >
        <form className={styles.edit_profile_form}>
          <h1 className={styles.edit_profile_title}>プロフィールを編集</h1>
          <br />
          <TextField
            placeholder="nickname"
            type="text"
            value={profile?.nickName}
            onChange={(e) => dispatch(editNickname(e.target.value))}
          />
          <br />
          <TextField
            placeholder="fav_music_genre"
            type="text"
            multiline
            maxRows={5}
            value={profile?.fav_music_genre}
            onChange={(e) => dispatch(editFavMusicGenre(e.target.value))}
          />
          <br />
          <ProfileFileInputWrapper>
            <StyledProfileFileInput
              type="file"
              id="profileImageInput"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileImage(e.target.files![0])}
            />
            <label htmlFor="profileImageInput">
              <Button variant="outlined" color="primary" component="span">
                画像を選ぶ
              </Button>
              {profileImage && <ProfileFileName>{profileImage.name}</ProfileFileName>}
            </label>
          </ProfileFileInputWrapper>
          <br />

          <br />
          <Button
            disabled={!profile?.nickName}
            variant="contained"
            color="primary"
            type="submit"
            onClick={updateProfile}
          >
            更新する
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default EditProfile;