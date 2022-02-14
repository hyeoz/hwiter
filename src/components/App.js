import { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { BrowserRouter } from "react-router-dom";
import { onAuthStateChanged, updateProfile } from "@firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
        // 작은 객체로 사용자 정보를 가져와 실시간으로 리렌더링 될 수 있도록
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => updateProfile(args),
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  // 프로필 수정 실시간으로 적용하기 위해
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => updateProfile(args),
    });
  };

  return (
    <BrowserRouter>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; Hwitter {new Date().getFullYear()}</footer>
    </BrowserRouter>
  );
}

export default App;
