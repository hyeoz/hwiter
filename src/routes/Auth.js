import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "@firebase/auth";
import { authService } from "fbase";
import React, { useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => {
    // console.log(e.target.name);
    // onChangeEmail, onChangePassword 함수 두 개 만들 필요 없게
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newAccount) {
        // create new account
        // createUserWithEmailAndPassword() 는 promise 를 반환하기 때문에 async 써줘야 함
        // persist 옵션에서 local에 저장, 없음 등 선택할 수 있음
        const data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log(data);
      } else {
        // log in
        const data = await signInWithEmailAndPassword(
          authService,
          email,
          password
        );
        console.log(data);
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
  };
  // create account, sign in 버튼을 반대로 바꿔주는 함수
  const toggleAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = async (e) => {
    // console.log(e.target.name);
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {errorMsg}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue With Google
        </button>
        <button name="github" onClick={onSocialClick}>
          Continue With Github
        </button>
      </div>
    </div>
  );
};
export default Auth;
