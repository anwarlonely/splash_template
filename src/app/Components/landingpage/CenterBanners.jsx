import React from "react";
import style from "../../../styles/landingpage.module.css";


const CenterBanners = ({centerBanners}) => {
  return (
    <div style={{margin:0,padding:0,width:"100%"}}>
      <div className={style.categSectionStyle1}>
      {centerBanners?.slice(0, 10).map((item, index) => (
  <div key={index} className="image-container">
    {/* <Link href={item.link}> */}
    <img
      src={item.img_url}
      alt={`Card`}
      className="home-page-brands img-fluid"
      style={{
        width: "100%",
        height: "300px", // Set a fixed height for all images
        objectFit: "cover", // Ensures the image covers the container
      }}
    />
    {/* </Link> */}
  </div>
))}
      </div>
    </div>
  );
};

export default CenterBanners;
