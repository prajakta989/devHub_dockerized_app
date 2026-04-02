import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import Swipe from "./Swipe";

const Feed = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const feedData = useSelector((store) => store.feed);
  console.log("feedData", feedData);

  console.log("feedData", feedData);

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      console.log("responseeee", res);

      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleRemoveUser = async (userId, direction) => {
    const status = direction === "left" ? "ignored" : "interested";
  
    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${userId}`, {}, { withCredentials: true });
      dispatch(removeUserFromFeed(userId)); // removes user from Redux store
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };
  
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner w-24 h-24"></span>
      </div>
    );

  if (!feedData) return;

  if (feedData.length <= 0)
    return <h1 className="flex justify-center">No more users found</h1>;

  return (
    feedData && (
      <div className="flex justify-center  py-10 overflow-x-hidden">
        {/* <UserCard user={feedData[0]} showButtons={true} /> */}
        <Swipe user={feedData[0]}/>
      </div>
    )
  );
  
};

export default Feed;
