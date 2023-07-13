/* eslint  @typescript-eslint/no-unused-expressions: "off" */

import React, { useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import Select from "react-select";
import styles from "./Core.module.css";
import styled from "styled-components";
import { File } from "../types";
import {
  selectOpenNewPost,
  resetOpenNewPost,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncNewPost,
} from "../post/postSlice";
import { Button, TextField } from "@material-ui/core";
import { selectMyPlaylists } from "../playlist/playlistSlice";

const customStyles = {
  overlay: {
    backgroundColor: "rgb(14, 14, 15, 0.8)",
  },
  content: {
    top: "55%",
    left: "50%",
    width: 450,
    height: 450,
    padding: "50px",
    transform: "translate(-50%, -50%)",
  },
};

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const StyledFileInput = styled.input`
  display: none;
`;
const FileName = styled.span`
  margin-left: 10px;
  font-size: 12px;
  color: #888;
`;


const NewPost: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openNewPost = useSelector(selectOpenNewPost);
  const myPlaylists = useSelector(selectMyPlaylists);

  const options = myPlaylists.map((myPlaylist) => {
    return { value: myPlaylist.url, label: myPlaylist.title };
  });


  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(options[0]);
  const [genre, setGenre] = useState("");

  const newPost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { description: description, img: image, playlist: selectedPlaylist.value, genre: genre };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncNewPost(packet));
    await dispatch(fetchPostEnd());
    setDescription("");
    setImage(null);
    dispatch(resetOpenNewPost());
  };


  return (
    <>
      <Modal
        isOpen={openNewPost}
        onRequestClose={async () => {
          await dispatch(resetOpenNewPost());
          setImage(null)
        }}
        style={customStyles}
      >
        <form className={styles.newpost_form}>
          <h1 className={styles.core_title}>プレイリスト投稿</h1>
          <br />

          <TextField
            placeholder="ジャンル"
            type="text"
            onChange={(e) => setGenre(e.target.value)}
          />
          <br />
          <TextField
            placeholder="説明文"
            type="text"
            multiline
            maxRows={10}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <Select
            options={options}
            placeholder="プレイリストを選ぶ"
            onChange={(value) => {
              value ? setSelectedPlaylist(value) : null;
            }}
            noOptionsMessage={() => "プレイリストを追加してください"}
          />
          <br />

          <FileInputWrapper>
            <StyledFileInput
              type="file"
              id="imageInput"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files![0])}
            />
            <label htmlFor="imageInput">
              <Button variant="outlined" color="primary" component="span">
                画像を選ぶ
              </Button>
              {image && <FileName>{image.name}</FileName>}
            </label>
          </FileInputWrapper>
          <br />
          <br />
          <Button
            disabled={!genre || !description || !selectedPlaylist || !image}
            variant="contained"
            color="primary"
            onClick={newPost}
          >
            投稿する
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default NewPost;