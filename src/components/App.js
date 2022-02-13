import { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { BrowserRouter } from "react-router-dom";
import { onAuthStateChanged } from "@firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <BrowserRouter>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; Hwitter {new Date().getFullYear()}</footer>
    </BrowserRouter>
  );
}

export default App;
