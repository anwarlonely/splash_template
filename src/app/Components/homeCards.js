import React, { useState, useRef } from "react";
import { Button, Card, CardBody } from "reactstrap";
import "./homeCards.module.css";
import Link from "next/link";
import Cookies from "js-cookie";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const HomeCards = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const count = 5; // Number of cards to show at a time
  const cardWidth = 360; // Width of each card
  const gap = 15; // Gap between cards
  const wordpressURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const token = Cookies.get("token") || null;
  const carouselRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };
  const handleNextClick = () => {
    if (currentIndex < data?.length - count) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };
  const extractPath = (url) => {
    const pattern = /\/wp-content\/uploads\/\d{4}\/\d{2}\/[^/]+\.[a-z]{3,4}$/i;
    const match = url?.match(pattern);
    return match ? match[0] : null;
  };
  const slidingContainerStyle = {
    display: "flex",
    transition: "transform 0.3s ease",
    transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
    width: `${Math.min(count, data?.length) * (cardWidth + gap)}px`, // Limit width to the number of cards
  };
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
  };
  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const deltaX = e.clientX - startX.current;
      const movement = deltaX / (cardWidth + gap);
      const newIndex = Math.max(
        0,
        Math.min(data.length - count, Math.round(currentIndex - movement))
      );
      setCurrentIndex(newIndex);
    }
  };
  const handleMouseUp = () => {
    isDragging.current = false;
  };
  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    if (isDragging.current) {
      const deltaX = e.touches[0].clientX - startX.current;
      const movement = deltaX / (cardWidth + gap);
      const newIndex = Math.max(
        0,
        Math.min(data.length - count, Math.round(currentIndex - movement))
      );
      setCurrentIndex(newIndex);
    }
  };
  const handleTouchEnd = () => {
    isDragging.current = false;
  };
  return (
    <div
      className="cards-container flex p-2"
      ref={carouselRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        className="arrow left-arrow"
        onClick={handlePrevClick}
        disabled={currentIndex === 0}
      >
        <ArrowBackIosNewIcon />
      </button>
      <div
        className="carousel-wrapper"
        style={{ overflow: "hidden", width: "100%" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            fontWeight: "700",
            paddingBottom: "20px",
          }}
        >
          NEW ARRIVALS
        </h1>
        <div className="cards" style={slidingContainerStyle}>
          {data?.map((card, index) => (
            <div
              key={index}
              className="card-wrapper"
              style={{
                flex: `0 0 ${cardWidth}px`,
                marginRight: gap + "px",
                boxSizing: "border-box",
              }}
            >
              <Card
                className="explore-box card-animate"
                style={{ border: "none" }}
              >
                <div
                  style={{
                    position: "relative",
                    borderRadius: "0.25rem",
                    overflow: "hidden",
                  }}
                >
                  <Link
                    href={`/product/${card.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <img
                      src={
                        card.thumbnail_url
                          ? `${wordpressURL}/${extractPath(card.thumbnail_url)}`
                          : "https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg"
                      }
                      alt="Product Thumbnail"
                      width="250"
                      className="card-img-top explore-img title-hover"
                      style={{
                        transition: "transform 0.5s ease",
                        transform: "scale(1)",
                      }}
                    />
                  </Link>
                </div>
                <CardBody className="p-2">
                  <Link
                    href={`/product/${card.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <h6
                      className="text-dark title-hover"
                      style={{ height: "4rem" }}
                    >
                      {card?.title.replace(/&amp;/g, "&")}
                    </h6>
                  </Link>
                  {token ? (
                    <div className="d-flex align-items-center justify-content-between">
                      <Button
                        size="sm"
                        style={{ background: "none", border: "none" }}
                      >
                        {(() => {
                          const prices = card.meta
                            ?.filter(
                              (metaItem) => metaItem.meta_key === "_price"
                            )
                            .map((metaItem) => parseFloat(metaItem.meta_value));
                          const lowestPrice =
                            prices?.length > 0 ? Math.min(...prices) : null;
                          return (
                            prices?.length > 0 && (
                              <>
                                <p style={{ textAlign: "left" }}>
                                  <span
                                    style={{
                                      color: "#9AA5B3",
                                      textDecoration: "line-through",
                                      textAlign: "left",
                                    }}
                                  >
                                    $ {lowestPrice.toFixed(2)}
                                  </span>
                                  <br />
                                  <span
                                    style={{
                                      position: "relative",
                                      display: "inline-block",
                                      color: "#000000",
                                      margin: "0px",
                                      fontSize: "20px",
                                    }}
                                  >
                                    Splash Price:{" "}
                                    <span style={{ color: "red" }}>
                                      {" "}
                                      $ {lowestPrice.toFixed(2)}{" "}
                                    </span>{" "}
                                  </span>
                                </p>
                              </>
                            )
                          );
                        })()}
                      </Button>
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: "white",
                          border: "1px solid #E0E5EA",
                        }}
                      >
                        <Link
                          href={`/product/${card.slug}`}
                          style={{ textDecoration: "none", color: "#D3007E" }}
                        >
                          <ShoppingCartOutlinedIcon />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button onClick={handleOpen} size="sm" className="w-100">
                        Login to see prices
                      </Button>
                      <LoginModal open={open} handleClose={handleClose} />
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </div>
      {data?.length > count && (
        <button
          className="arrow right-arrow"
          onClick={handleNextClick}
          disabled={currentIndex >= data?.length - count}
        >
          <ArrowForwardIosIcon />
        </button>
      )}
    </div>
  );
};
export default HomeCards;
