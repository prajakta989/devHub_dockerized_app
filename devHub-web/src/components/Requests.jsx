import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";

const Requests = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getReceivedRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/received", {
        withCredentials: true,
      });
      setReceivedRequests(res?.data?.data);
      console.log("received", res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status, id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + id,
        {},
        { withCredentials: true }
      );
      const filterRequests = receivedRequests.filter(
        (request) => request._id !== id
      );
      setReceivedRequests(filterRequests);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getReceivedRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner w-24 h-24"></span>
      </div>
    );
  }

  if (!receivedRequests || receivedRequests.length === 0) {
    return <h1 className="text-center my-10">No Requests Found</h1>;
  }
  return (
    <div className="text-center ">
      <h1 className="text-3xl font-bold my-10">Connection Requests</h1>
      {receivedRequests.map((request) => {
        const { firstName, lastName, age, gender, about, photoUrl, skills } =
          request.fromUserId;
        return (
          <div
            className="  bg-base-200 shadow-lg w-1/2 mx-auto my-8 px-5 py-2 items-center flex flex-col lg:flex-row"
            key={request._id}
          >
            <img
              src={photoUrl}
              alt="photo"
              className="w-25 h-25 rounded-full "
            />
            <div className="card-body text-center w-full lg:w-1/2 lg:text-left">
              <h2 className="text-2xl font-bold lg:text-left ">{`${firstName} ${lastName}`}</h2>
              {age && gender && <p>{`${age}, ${gender}`}</p>}
              <p>{about}</p>
            </div>
            <div className="card-actions justify-end mt-8 lg:mt-8 lg:ml-auto">
              <button
                className="btn btn-primary"
                onClick={() => reviewRequest("rejected", request._id)}
              >
                Reject
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
