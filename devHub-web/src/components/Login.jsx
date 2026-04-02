import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { data, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(res?.data));
       navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
      console.log(err);
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        BASE_URL + "/signup",
        { firstName:firstname, lastName: lastname, emailId, password },
        { withCredentials: true }
      );

      console.log("resposneeeee", response);
      
      dispatch(addUser(response?.data?.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
      console.log(err);
    }
  };
  return (
    <div className="flex justify-center my-8">
      <div className="  bg-base-300 w-96 ">
        <div className="card-body">
          <h2 className="card-title">{isLogin ? "Login" : "Sign Up"}</h2>
          <div>
            {!isLogin && (
              <>
                <fieldset className="fieldset my-4">
                  <legend className="fieldset-legend">Firstname</legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Please Enter Firtsname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                  {/* <p className="fieldset-label">Optional</p> */}
                </fieldset>
                <fieldset className="fieldset my-4">
                  <legend className="fieldset-legend">Lastname</legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Please Enter Lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                  {/* <p className="fieldset-label">Optional</p> */}
                </fieldset>
              </>
            )}
            <fieldset className="fieldset my-4">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="text"
                className="input"
                placeholder="Please Enter Email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
              {/* <p className="fieldset-label">Optional</p> */}
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password:</legend>
              <input
                type="password"
                className="input"
                placeholder="Please Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* <p className="fieldset-label">Optional</p> */}
            </fieldset>
          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center mt-2">
            <button
              className="btn btn-primary"
              onClick={isLogin ? handleLogin : handleSignUp}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </div>
          <p
            className="cursor-pointer text-center py-4"
            onClick={() => setIsLogin((value) => !value)}
          >
            {isLogin ? "New user? Sign up" : "Already a user? Login"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
