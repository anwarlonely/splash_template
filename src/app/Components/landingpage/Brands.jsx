import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Brands = ({ slides }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
    prevArrow: (
      <div
        style={{
          display: "block",
          background: "black",
          color: "white",
          padding: "10px",
          borderRadius: "50%",
          zIndex: 1,
        }}
      >
        ◀
      </div>
    ),
    nextArrow: (
      <div
        style={{
          display: "block",
          background: "black",
          color: "white",
          padding: "10px",
          borderRadius: "50%",
          zIndex: 1,
        }}
      >
        ▶
      </div>
    ),
  };

  const carouselStyle = {
    margin: "0 auto",
    padding: "40px",
    width: "100%",
  };

  const slideImgStyle = {
    maxWidth: "100%",
    height: "auto",
    border: "none",
  };

  return (
    <div style={carouselStyle}>
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px",
          fontWeight: "700",
          paddingBottom:'20px'
        }}
      >
        TOP SELLING PRODUCTS
      </h1>
      <Slider {...settings} dotsClass="slick-dots">
        {slides?.length > 0 &&
          slides.map((item, index) => (
            <div key={index} style={{ width: "165px" }}>
              <img src={item.src} alt={`Card `} style={slideImgStyle} />
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default Brands;
