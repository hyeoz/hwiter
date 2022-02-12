import { signOut } from "@firebase/auth";
import { authService } from "fbase";
import React from "react";
import { useNavigate } from "react-router";

const Profile = () => {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    signOut(authService);
    navigate("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
