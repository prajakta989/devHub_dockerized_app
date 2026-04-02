import React from "react";
import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setfirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [about, setAbout] = useState(user.about);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  const handleEditProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (err) {
      setError(err?.response?.data);
      console.log(err);
    }
  };  
  return (
    <div className="flex justify-center my-10 ">
      <div className="flex mx-20 sm:mx-20 w-1/2 flex-col md:flex-row">
        
          <div className="card-body ">
            <h1 className="card-title text-3xl">Profile</h1>
            <div>
              <fieldset className="fieldset my-4">
                <legend className="fieldset-legend">Firstname:</legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Please enter Firstname"
                  value={firstName}
                  onChange={(e) => setfirstName(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset my-4">
                <legend className="fieldset-legend">Lastname:</legend>
                <input
                  type="text"
                  className="input  w-full"
                  placeholder="Please enter Lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset my-4">
                <legend className="fieldset-legend">PhotoUrl:</legend>
                <input
                  type="text"
                  className="input  w-full"
                  placeholder="Please Enter PhotoUrl"
                  value={photoUrl}
                  onChange={(e) => setPhotUrl(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset my-4">
                <legend className="fieldset-legend">Age:</legend>
                <input
                  type="text"
                  className="input  w-full"
                  placeholder="Please Enter Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </fieldset>
              {/* <fieldset className="fieldset my-4">
                <legend className="fieldset-legend">Gender:</legend>
                <input
                  type="select"
                  className="input"
                  placeholder="Please Enter Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />
              </fieldset> */}
              <fieldset className="fieldset my-4">
                <legend className="fieldset-legend">Gender:</legend>
                <select
                  name="cars"
                  id="cars"
                  className="input w-full"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male" className="">
                    Male
                  </option>
                  <option value="female">Female</option>
                  <option value="others">others</option>
                </select>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">About:</legend>
                <textarea
                  className="textarea h-24 w-full"
                  placeholder="About"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                ></textarea>
              </fieldset>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="card-actions justify-center mt-2">
              <button className="btn btn-primary" onClick={handleEditProfile}>
                Edit profile
              </button>
            </div>
          </div>
        
      </div>
      <div className="w-1/2">
        <UserCard user={{ firstName, lastName, photoUrl, age, gender, about }} showButton={false}/>
      </div>
      
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-info">
            <span>Profile edited Successfully !</span>
          </div>
        </div>
      )}
    </div>

    // <div className="flex w-full">
    //   <div className="card  rounded-box grid grow place-items-center">
    //     <div className="card-body w-full">
    //       <h2 className="card-title text-3xl">Profile</h2>
    //       <div className="items-center">
    //         <fieldset className="fieldset my-4">
    //           <legend className="fieldset-legend">Firstname:</legend>
    //           <input
    //             type="text"
    //             className="input"
    //             placeholder="Please enter Firstname"
    //             value={firstName}
    //             onChange={(e) => setfirstName(e.target.value)}
    //           />
    //         </fieldset>
    //         <fieldset className="fieldset my-4">
    //           <legend className="fieldset-legend">Lastname:</legend>
    //           <input
    //             type="text"
    //             className="input"
    //             placeholder="Please enter Lastname"
    //             value={lastName}
    //             onChange={(e) => setLastName(e.target.value)}
    //           />
    //         </fieldset>
    //         <fieldset className="fieldset my-4">
    //           <legend className="fieldset-legend">PhotoUrl:</legend>
    //           <input
    //             type="text"
    //             className="input"
    //             placeholder="Please Enter PhotoUrl"
    //             value={photoUrl}
    //             onChange={(e) => setPhotUrl(e.target.value)}
    //           />
    //         </fieldset>
    //         <fieldset className="fieldset my-4">
    //           <legend className="fieldset-legend">Age:</legend>
    //           <input
    //             type="text"
    //             className="input"
    //             placeholder="Please Enter Age"
    //             value={age}
    //             onChange={(e) => setAge(e.target.value)}
    //           />
    //         </fieldset>
    //         {/* <fieldset className="fieldset my-4">
    //             <legend className="fieldset-legend">Gender:</legend>
    //             <input
    //               type="select"
    //               className="input"
    //               placeholder="Please Enter Gender"
    //               value={gender}
    //               onChange={(e) => setGender(e.target.value)}
    //             />
    //           </fieldset> */}
    //         <fieldset className="fieldset my-4">
    //           <legend className="fieldset-legend">Gender:</legend>
    //           <select
    //             name="cars"
    //             id="cars"
    //             className="input"
    //             value={gender}
    //             onChange={(e) => setGender(e.target.value)}
    //           >
    //             <option value="male" className="">
    //               Male
    //             </option>
    //             <option value="female">Female</option>
    //             <option value="others">others</option>
    //           </select>
    //         </fieldset>
    //         <fieldset className="fieldset">
    //           <legend className="fieldset-legend">About:</legend>
    //           <textarea
    //             className="textarea h-24"
    //             placeholder="About"
    //             value={about}
    //             onChange={(e) => setAbout(e.target.value)}
    //           ></textarea>
    //         </fieldset>
    //       </div>
    //       {error && <p className="text-red-500">{error}</p>}
    //       <div className="card-actions  mt-2">
    //         <button className="btn btn-primary" onClick={handleEditProfile}>
    //           Edit profile
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="card 0 rounded-box grid grow place-items-center">
    //     <UserCard
    //       user={{ firstName, lastName, photoUrl, age, gender, about }}
    //       showButton={false}
    //     />
    //   </div>
    //   {showToast && (
    //     <div className="toast toast-top toast-center">
    //       <div className="alert alert-info">
    //         <span>Profile edited Successfully !</span>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};

export default EditProfile;
