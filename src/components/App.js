import { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { BrowserRouter } from "react-router-dom";
import { onAuthStateChanged } from "@firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <BrowserRouter>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing..."}
      <footer>&copy; Hwitter {new Date().getFullYear()}</footer>
    </BrowserRouter>
  );
}

export default App;
