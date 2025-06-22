import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../store/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store: RootState) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return;
    try {
      const response = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(response.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div className="flex justify-center my-10">
      {feed && feed[0] && <UserCard user={feed[0]} />}
    </div>
  );
};

export default Feed;
