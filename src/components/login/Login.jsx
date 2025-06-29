import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import "./login.css";

function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const formHandler = (e) => {
    e.preventDefault();
    setMessage("");
    let name = "abc";
    let pass = "abc";
    if (name == email && pass == password) {
      setMessage("Successfully Login");
      localStorage.setItem("loginId", email);
      setTimeout(() => {
        navigate("/dashboard/student");
      }, 1000);
    } else {
      setMessage("Email or password is incorrect!");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  return (
    <div className="form_box">
      <div className="logo">
        <img src={logo} alt="" />
        <h1>Khuddam Admin Portal</h1>
      </div>
      <form>
        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="btnLogin"
          onClick={(e) => {
            formHandler(e);
          }}
        >
          Go
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default login;
