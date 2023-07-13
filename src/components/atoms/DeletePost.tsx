import Modal from "react-modal";
import styles from "../pages/MyPage.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { CircularProgress } from "@material-ui/core";
import { fetchAsyncDeletePost, fetchAsyncGetPosts, fetchDeletePostEnd, fetchDeletePostStart, resetOpenDeletePost, selectIsLoadingDeletePost, selectOpenDeletePost } from "../../features/post/postSlice";

const customStyles = {
  overlay: {
    backgroundColor: "rgb(14, 14, 15, 0.8)",
  },
  content: {
    top: "55%",
    left: "50%",
    width: 200,
    height: 100,
    padding: "50px",
    transform: "translate(-50%, -50%)",
  },
};

type Props = {
  postId: any
}

const DeletePost: React.FC<Props> = (props) => {
  const {postId} = props
  const dispatch: AppDispatch = useDispatch();
  const openDeletePost = useSelector(selectOpenDeletePost);
  const isLoadingDeletePost = useSelector(selectIsLoadingDeletePost);


  const deletePost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await dispatch(fetchDeletePostStart());
    await dispatch(fetchAsyncDeletePost(postId));
    await dispatch(fetchDeletePostEnd());
    await dispatch(fetchAsyncGetPosts());
    dispatch(resetOpenDeletePost());
  };

  return (
    <>
      <Modal
        isOpen={openDeletePost}
        onRequestClose={async () => {
          await dispatch(resetOpenDeletePost());
        }}
        style={customStyles}
      >
        <form className={styles.delete_post_form}>
          <p className={styles.delete_post_title}>削除しますか？</p>
          <br />
          <br />
          <div className={styles.button_container}>
            <button
              type="submit"
              disabled={isLoadingDeletePost}
              onClick={deletePost}
              className={styles.delete_confirm_button}
            >
              削除する
            </button>
            <br />
            <button
              type="submit"
              disabled={isLoadingDeletePost}
              onClick={async () => {
                await dispatch(resetOpenDeletePost());
              }}
              className={styles.cancel_delete_button}
            >
              キャンセル
            </button>
          </div >
          <div className={styles.core_progress}>
            {isLoadingDeletePost && <CircularProgress />}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DeletePost;