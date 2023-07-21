import { Button } from "@material-ui/core";
import axios from "axios";
import styles from "./FollowButton.module.css";
import { fetchAsyncGetFollowerList, fetchAsyncGetFollowingList, fetchAsyncGetMyFollowerList, fetchAsyncGetMyFollowingList, fetchConnectionEnd, fetchConnectionStart } from "../../features/connection/connectionSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

interface UnFollowButtonProps {
  followerId: number; // フォローするユーザーのID
  followingId: number; // フォローされるユーザーのID
  userProfileId?: number;
}

const UnFollowButton: React.FC<UnFollowButtonProps> = ({ followerId, followingId, userProfileId }) => {
  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await dispatch(fetchConnectionStart());
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DEV_API_URL}api/unfollow/`,
        {
          follower: followerId, // propsから受け取ったフォローするユーザーのIDを使用
          following: followingId, // propsから受け取ったフォローされるユーザーのIDを使用
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      );
      await dispatch(fetchAsyncGetMyFollowerList(followerId))
      await dispatch(fetchAsyncGetMyFollowingList(followerId))
      if (userProfileId) {
        await dispatch(fetchAsyncGetFollowerList(userProfileId));
        await dispatch(fetchAsyncGetFollowingList(userProfileId));
      }
      await dispatch(fetchConnectionEnd());
    } catch (error: any) {
      console.error("Error:", error.response);
      // エラーハンドリングを行います
    }
  };

  return (
    <Button
      variant="text"
      color="secondary"
      type="submit"
      onClick={handleSubmit}
      className={styles.follow_button}
    >
      フォロー解除
    </Button>
  );
};

export default UnFollowButton;
