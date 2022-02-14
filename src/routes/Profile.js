import { signOut, updateProfile } from "@firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    signOut(authService);
    navigate("/");
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      //변경사항 없음
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      // 변경되는것을 실시간으로 확인하려면 userObj 를 변경하여 리렌더링 해야 함 -> userObj는 App.js 에서 시작
      refreshUser();
    }
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  const getMyHwits = async () => {
    const hwitsQuery = await getDocs(
      query(
        collection(dbService, "hwits"),
        where("creatorId", "==", userObj.uid),
        orderBy("createAt", "desc")
      )
    );
    // console.log(hwitsQuery.docs.map((doc) => doc.data()));
  };
  useEffect(() => {
    getMyHwits();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
