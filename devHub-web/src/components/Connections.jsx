import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

const Connections = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log("connections", res.data.data);
      setRequests(res?.data?.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getConnections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner w-24 h-24"></span>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return <h1 className="text-center my-10">No Connections Found</h1>;
  }

  // if(!connections) return

  // if(connections.length === 0) return <h1>No Connections Found</h1>
  return (
    // <div className="my-10  max-w-1/2 text-center mx-auto">
    //   <h1 className="text-2xl font-bold">My Connections</h1>
    //   {requests?.map((connection) => {
    //     const { firstName, lastName, age, gender, about, photoUrl, skills } =
    //       connection;
    //     return (
    //       <div key={connection._id} className="flex my-10 shadow-lg p-5 bg-base-200">
    //         <img src={photoUrl} className="w-25 h-25 mr-8 rounded-full" />
    //         <div className="text-left">
    //           <p className="text-3xl font-bold">{`${firstName} ${lastName} `}</p>
    //           {age && gender && <span className="text-2xl">{`${age}, ${gender}`}</span>}
    //           {/* <p className="text-2xl">{about}</p> */}
    //         </div>
    //       </div>
    //     );
    //   })}
    // </div>
    <div className="text-center ">
      <h1 className="text-3xl font-bold my-10">My Connections</h1>
      {requests.map((connection) => {
        const { firstName, lastName, age, gender, about, photoUrl, skills } =
          connection;
        return (
          <div
            className=" bg-base-200 shadow-lg w-1/2 mx-auto my-8 px-5 py-2 items-center flex flex-col lg:flex-row"
            key={connection._id}
          >
            <img
              src={photoUrl}
              alt="photo"
              className="w-25 h-25 rounded-full object-contain"
            />

            <div className="card-body text-center lg:text-left">
              <h2 className=" text-2xl font-bold ">{`${firstName} ${lastName}`}</h2>
              {age && gender && <p>{`${age}, ${gender}`}</p>}
              <p>{about}</p>
            </div>
            <Link to={"/chat/" + connection._id}><button className="btn btn-outline">Message</button></Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
