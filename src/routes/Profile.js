import { signOut, updateProfile } from "@firebase/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { v4 } from "uuid";

const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newPhotoURL, setNewPhotoURL] = useState(userObj.photoURL);

  // console.log(newPhotoURL); // 여기서 파일 받아올때는 base64 형식으로 받아옴

  const onLogOutClick = () => {
    signOut(authService);
    navigate("/");
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      userObj.displayName !== newDisplayName ||
      userObj.photoURL !== newPhotoURL
    ) {
      //변경사항 없음
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
        photoURL: newPhotoURL,
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
  const onFileChange = (e) => {
    // console.log(e);
    const {
      target: { files },
    } = e;
    const theFile = files[0]; // 한개만 선택
    const reader = new FileReader();
    reader.onloadend = async (finishedEvent) => {
      // console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      // 프로필 이미지 업데이트를 위한 코드
      const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(fileRef, result, "data_url");
      const resultURL = await getDownloadURL(response.ref);

      setNewPhotoURL(resultURL);
    }; // 2. 여기서 파일 로드가 끝나면 처리
    reader.readAsDataURL(theFile); // 1. 여기서 파일을 받고
  };

  const getMyHwits = async () => {
    const hwitsQuery = await getDocs(
      // 지정하기만 하고 사용하지 않았는데 실행되는건가..
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
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          autoFocus
          className="profileInput"
        />
        {/* <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="profileInput"
        /> */}
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>ChangePhotos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ opacity: 0 }}
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
