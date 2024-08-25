import React from "react";
import style from "../../../styles/landingpage.module.css";


const CenterBanners = ({centerBanners}) => {
  return (
    <div style={{margin:0,padding:0,width:"100%"}}>
      <div className={style.categSectionStyle1}>
        {centerBanners?.slice(0, 10).map((item, index) => (
          <div key={index}>
            {/* <Link href={item.link}> */}
            <img
              src={item.img_url}
              alt={`Card`}
              className="home-page-brands image-fluid"
              style={{
                transition: "none",
                transform: "none",
                height: "auto",
                objectFit: "cover",
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
