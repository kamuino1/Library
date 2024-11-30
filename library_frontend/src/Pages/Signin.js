import React, { useContext, useState } from "react";
import "./Signin.css";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext.js";

function Signin() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const { dispatch } = useContext(AuthContext);

  const API_URL = process.env.REACT_APP_API_URL;

  const loginCall = async (userCredential, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(API_URL + "api/auth/signin", userCredential);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err });
      setError("Wrong Password Or Username");
    }
  };

  const handleForm = (e) => {
    e.preventDefault();
    loginCall({ username, password }, dispatch);
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="card p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <form onSubmit={handleForm}>
          <h2 className="text-center mb-4">Log in</h2>
          <div className="text-danger mb-3">{error}</div>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              <b>Username</b>
            </label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter Username"
              name="username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <b>Password</b>
            </label>
            <input
              className="form-control"
              type="password"
              minLength="6"
              placeholder="Enter Password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100 mb-3" type="submit">
            Log In
          </button>

          <div className="text-center">
            <a href="#home" className="text-decoration-none">
              Forgot password?
            </a>
          </div>
        </form>

        <div className="text-center mt-3">
          <p className="mb-0">
            Don't have an account?{" "}
            <a href="#contact" className="text-decoration-none">
              Contact Librarian
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
