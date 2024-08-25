import React from "react";
import style from "../../../styles/landingpage.module.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";




const Sliders = ({gifsSliders}) => {
  return (

      <div className={"style.gifSliders"}>
        <Carousel showStatus={false} showThumbs={false} autoPlay={true}>
          {gifsSliders?.map((item, index) => (
            // <Link href={item.link} key={index}>
            <div>
              <img src={item?.src} alt={"image?.alt"} />
            </div>
            // {/* </Link> */}
          ))}
        </Carousel>
      </div>
    
  );
};

export default Sliders;
