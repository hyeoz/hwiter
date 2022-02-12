import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import firebase from "./fbase";
// console.log(firebase); // test

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
