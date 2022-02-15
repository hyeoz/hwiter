import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => {
  // console.log(userObj, "navigation information");

  return (
    <nav>
      <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <li>
          <Link to="/" style={{ marginRight: 10 }}>
            <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="4x" />
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            style={{
              marginLeft: 10,
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              // textAlign: "center",
              fontSize: 12,
            }}
          >
            <img
              src={userObj.photoURL}
              width="50px"
              height="50px"
              alt="Profile_Image_Here"
              style={{ margin: "0 auto" }}
            />
            {/* <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" /> */}
            <span style={{ marginTop: 10, marginBottom: 20 }}>
              {userObj.displayName
                ? `${userObj.displayName}의 Profile`
                : "Profile"}
            </span>
          </Link>
        </li>
      </ul>
      {/* 내가 추가한 프로필 이미지 부분 CSS 수정해야 함! */}
    </nav>
  );
};

export default Navigation;
