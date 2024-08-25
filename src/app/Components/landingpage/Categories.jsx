import React from "react";
import style from "../../../styles/landingpage.module.css";


const Categories = ({categoriesBanners}) => {
  return (
    <div>
      <div className={style.categoryStyle} style={{overflow:'hidden'}}>
        {categoriesBanners.map((banner) => (
          <div
            key={banner.id}
            className="home-page-brands"
            style={{
              overflow: "hidden",
              width:'100%'
            }}
          >
            <img
              src={banner.img1}
              alt={`Category ${banner.id}`}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
                borderRadius: "20px",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
