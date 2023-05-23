import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Spinner from "./spinner";
import noImg from "./img/No-Image.webp";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
// getDoc can be used, but it must refresh each time within the page to show the new elements

const Images = () => {
  const [images, setImages] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [i, setI] = useState(15);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const collectionRef = collection(db, "gallery-images");
    const querySnapshot = query(collectionRef, orderBy("createdAt", "desc"));
    const unSnapshot = onSnapshot(querySnapshot, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setImages(docs);
    });
    return unSnapshot;
  }, [i]);

  let readMore = images?.slice(0, i);

  const handleclick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setI((prev) => prev + 16);
      if (i > images?.length - 17) {
        setShowButton(false);
      }
      setIsLoading(false);
    }, 5000);
  };

  return (
    <>
      <div className="images">
        {readMore?.map((img) => (
          <div key={img.id} className="image">
            <img src={!img.url ? noImg : img.url} alt={img.name} />
            <h3>{img.name}</h3>
          </div>
        ))}
      </div>
      <div className="center">
        {showButton ? (
          <button type="submit" className="button-24" onClick={handleclick}>
            {isLoading ? <Spinner /> : "Read More"}
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Images;
