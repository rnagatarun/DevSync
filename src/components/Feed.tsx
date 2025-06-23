import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../store/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";
import type { UserProps } from "../types/userprops";

const Feed = () => {
  const feed = useSelector((store: RootState) => store.feed) as UserProps[] | null;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!feed) return;
  if(feed.length <=0) return <h1 className="flex justify-center my-10">No new Users Found!!</h1>
  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
