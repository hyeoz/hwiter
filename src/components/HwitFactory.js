import { addDoc, collection } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 } from "uuid";

const HwitFactory = ({ userObj }) => {
  const [hwit, setHwit] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (e) => {
    if (hwit === "") {
      return;
    }
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
    <form onSubmit={onSubmit} className="fatoryForm">
      <div className="factoryInput__container">
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={128}
          value={hwit}
          onChange={onChange}
          className="factoryInput__input"
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>AddPhotos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{ opacity: 0 }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{ backgroundImage: attachment }}
            alt="image_here"
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
      <input type="submit" value="Hwitter" />
    </form>
  );
};

export default HwitFactory;
