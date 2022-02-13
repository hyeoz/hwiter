import { addDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import Hwit from "components/Hwit";

const Home = ({ userObj }) => {
  const [hwit, setHwit] = useState("");
  const [hwits, setHwits] = useState([]);

  const getHwits = async () => {
    const dbHwits = await getDocs(collection(dbService, "hwits"));
    // console.log(dbHwits);
    dbHwits.forEach((doc) => {
      const hwitObj = {
        ...doc.data(),
        id: doc.id,
      };
      // set 함수 사용 시 값이 아니라 함수 전달할 수도 있음
      setHwits((prev) => [hwitObj, ...prev]);
    });
  };
  useEffect(() => {
    onSnapshot(collection(dbService, "hwits"), (snapshot) => {
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
    await addDoc(collection(dbService, "hwits"), {
      text: hwit,
      createAt: Date.now(),
      creatorId: userObj.uid,
    });
    setHwit("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setHwit(value);
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
