import React from "react";
import style from "../../../styles/landingpage.module.css";
import { UncontrolledCarousel } from "reactstrap";



const SliderWithPosters = ({gifsSliders, gipPosters, gipPosters2}) => {
  return (
    <div className="p-2">
      <div className={style.mainContainerStyle1}>
        <div className={style.centerNewStyle1}>
          <React.Fragment>
            <UncontrolledCarousel
              interval={false}
              indicators={false}
              enableTouch={false}
              items={gifsSliders}
            />
          </React.Fragment>
        </div>
        <div className={style.leftNewStyle1}>
          {gipPosters.slice(0, 1).map((item, index) => (
            <div key={index}>
              {/* <Link href={item.link}> */}
              <img src={item.img_url} alt={`Card `} />
              {/* </Link> */}
            </div>
          ))}
        </div>
        <div className={style.rightNewStyle1}>
          {gipPosters2.slice(0, 1).map((item, index) => (
            <div key={index}>
              {/* <Link href={item.link}> */}
              <img src={item.img_url} alt={`Card `} />
              {/* </Link> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderWithPosters;
