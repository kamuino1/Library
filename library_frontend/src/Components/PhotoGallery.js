import React from "react";
import "./css/PhotoGallery.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function PhotoGallery() {
  return (
    <div className="photogallery-container">
      <h1 className="photogallery-title">Photo Gallery</h1>
      <div className="photogallery-images">
        <img src="https://source.unsplash.com/1300x1200/?algeria" alt="" />
        <img src="https://source.unsplash.com/1300x1200/?lebanon" alt="" />
        <img src="https://source.unsplash.com/1300x1200/?qatar" alt="" />
        <img src="https://source.unsplash.com/1300x1200/?uae" alt="" />
        <img src="https://source.unsplash.com/1300x1200/?kuwait" alt="" />
        <img src="https://source.unsplash.com/1300x1200/?oman" alt="" />
        <img src="https://source.unsplash.com/1300x1200/?turkey" alt="" />
        <img src="https://source.unsplash.com/1300x1200/?iran" alt="" />
        <img src="https://source.unsplash.com/1300x1200/?jordan" alt="" />
        <img src="https://source.unsplash.com/1300x1200/?Kuwait" alt="" />
      </div>
      <button>
        VIEW MORE
        <ArrowForwardIosIcon style={{ fontSize: 20 }} />
      </button>
    </div>
  );
}

export default PhotoGallery;
