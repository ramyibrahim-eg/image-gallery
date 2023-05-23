import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Spinner from "./spinner";
import imgLogo from "./img/img-icon.webp";

const UploadImg = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];

  const types = ["image/png", "image/jpeg", "image/jpg"];

  const handleFile = (e) => {
    if (e.target.files[0] && types.includes(e.target.files[0].type)) {
      setImage(e.target.files[0]);
      setDisabled(false);
    } else {
      setImage(null);
      toast.error("Enter a valid image");
      setDisabled(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setDisabled(true);
    const storageRef = ref(
      storage,
      `gallery-images/${image.name + Date.now()}`
    );
    uploadBytes(storageRef, image).then((snapshot) => {
      toast.success("Uploaded a image!");
      setIsLoading(false);
      setDisabled(true);
      getDownloadURL(snapshot.ref)
        .then((url) => {
          addDoc(collection(db, "gallery-images"), {
            url,
            createdAt: Timestamp.fromDate(new Date()),
            name: `images-${randomCharacter}`,
          });
        })
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setIsLoading(false);
        });
    });
    setImage(null);
  };

  useEffect(() => {
    const imgInp = document.querySelector("#imgInp");
    const blah = document.querySelector("#blah");
    const submit = document.querySelector('[type="submit"]');

    imgInp.onchange = (evt) => {
      const [img] = imgInp.files;
      if (img) {
        blah.src = URL.createObjectURL(img);
      }
    };

    submit.addEventListener("click", () => {
      blah.src = imgLogo;
    });
  }, []);

  return (
    <div className="form">
      <h2>Upload and upload photos</h2>
      <form onSubmit={handleSubmit}>
        <div className="handleFile">
          <input type="file" onChange={handleFile} accept={types} id="imgInp" />
          <img id="blah" src={imgLogo} alt="your image" />
        </div>
        <button type="submit" disabled={disabled} className="button-24">
          {isLoading ? <Spinner /> : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadImg;
