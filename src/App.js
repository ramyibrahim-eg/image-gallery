import React from "react";
import UploadImg from "./components/UploadImg";
import { ToastContainer } from "react-toastify";
import Images from "./components/Images";

const App = () => {
  return (
    <div className="container">
      <ToastContainer />
      <UploadImg />
      <Images />
    </div>
  );
};

export default App;
