import { Routes, Route } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route
            path="/"
            element={
              <div>
                <Navigation userObj={userObj} />
                <Home userObj={userObj} />
              </div>
            }
          />
          <Route
            path="/profile"
            element={
              <div>
                <Navigation userObj={userObj} />
                <Profile refreshUser={refreshUser} userObj={userObj} />
              </div>
            }
          />
        </>
      ) : (
        <Route path="/" element={<Auth />} />
      )}
    </Routes>
  );
};

export default AppRouter;
