import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import Hwit from "components/Hwit";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { v4 } from "uuid";

const Home = ({ userObj }) => {
  const [hwit, setHwit] = useState("");
  const [hwits, setHwits] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    onSnapshot(collection(dbService, "hwits"), (snapshot) => {
      // getHwits역할 실시간
      // console.log("something happened")
      const hwitArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHwits(hwitArr);
    });
  }, []);
  // console.log(hwits);

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = ""; // if 문 밖에서도 사용하기 위해
    if (attachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(fileRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
      // console.log("-----");
    }
    const hwitObj = {
      text: hwit,
      createAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "hwits"), hwitObj);
    setHwit("");
    setAttachment("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setHwit(value);
  };
  const onFileChange = (e) => {
    // console.log(e);
    const {
      target: { files },
    } = e;
    const theFile = files[0]; // 한개만 선택
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    }; // 2. 여기서 파일 로드가 끝나면 처리
    reader.readAsDataURL(theFile); // 1. 여기서 파일을 받고
  };
  const onClearAttachment = () => {
    setAttachment("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={128}
          value={hwit}
          onChange={onChange}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="image_here" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
        <input type="submit" value="Hwitter" />
      </form>
      <div>
        {hwits.map((hwit) => (
          <Hwit
            key={hwit.id}
            hwitObj={hwit}
            isOwner={hwit.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
