import { Button } from "@material-ui/core";
import axios from "axios";
import styles from "./FollowButton.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { fetchAsyncGetFollowerList, fetchAsyncGetFollowingList, fetchAsyncGetMyFollowerList, fetchAsyncGetMyFollowingList, fetchConnectionEnd, fetchConnectionStart } from "../../features/connection/connectionSlice";
import { selectProfiles } from "../../features/auth/authSlice";

interface FollowButtonProps {
  followerId: number; // フォローするユーザーのID
  followingId: number;
  userProfileId? : number;// フォローされるユーザーのID
}

const FollowButton: React.FC<FollowButtonProps> = ({ followerId, followingId, userProfileId }) => {
  const dispatch: AppDispatch = useDispatch();
  const profiles = useSelector(selectProfiles);



  const handleSubmit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await dispatch(fetchConnectionStart());
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_DEV_API_URL}api/follow/`,
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
      color="primary"
      type="submit"
      onClick={handleSubmit}
      className={styles.follow_button}
    >
      フォロー
    </Button>
  );
};

export default FollowButton;
