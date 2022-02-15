import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Hwit from "components/Hwit";
import HwitFactory from "components/HwitFactory";
import { dbService } from "fbase";

const Home = ({ userObj }) => {
  const [hwits, setHwits] = useState([]);

  useEffect(() => {
    onSnapshot(
      query(collection(dbService, "hwits"), orderBy("createAt", "desc")),
      (snapshot) => {
        // getHwits역할 실시간
        // console.log("something happened")
        const hwitArr = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHwits(hwitArr);
      }
    );
  }, []);
  // console.log(hwits, "Home");

  return (
    <div>
      <HwitFactory userObj={userObj} />
      <div className="container">
        <div style={{ marginTop: 30 }}>
          {hwits.map((hwit) => (
            <Hwit
              key={hwit.id}
              hwitObj={hwit}
              isOwner={hwit.creatorId === userObj.uid}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
