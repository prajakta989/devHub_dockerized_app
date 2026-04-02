import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, showButtons }) => {
  if (!user) return;
  const { firstName, lastName, photoUrl, skills, about, age, gender, _id } =
    user;
  console.log("userrrr", user);

  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    // <div className="card bg-base-200 w-64  max-w-sm mx-auto shadow-lg">
    //   <figure className="overflow-hidden h-64 ">
    //     <img
    //       src={photoUrl}
    //       alt="photo"
    //       className="w-full object-contain "
    //     />
    //   </figure>
    //   <div className="card-body">
    //     <h2 className="card-title py-2">{`${firstName} ${lastName}`}</h2>
    //     {age && gender && <span>{`${age}, ${gender}`}</span>}
    //     <span className="py-2">{about}</span>
    //   </div>
    //   {showButtons && (
    //     <div className="card-actions justify-center py-10">
    //       <button className="btn btn-primary cursor-pointer" onClick={() => handleSendRequest("ignored", _id )}>Ignore</button>
    //       <button className="btn btn-secondary cursor-pointer" onClick={() => handleSendRequest("interested", _id )}>
    //         Send Request
    //       </button>
    //     </div>
    //   )}
    // </div>
    <div className=" w-80  rounded-full ">
      <figure>
        <img src={photoUrl} alt="photo" className="w-full object-contain" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{`${firstName} ${lastName}`}</h2>
        {age && gender && <p>{`${age}, ${gender}`}</p>}
        <p>{about}</p>
      </div>
      {showButtons && (
        <div className="card-actions justify-center py-2">
          <button
            className="btn btn-primary"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Send Request
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
