import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../styles/styles.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import LoginModal from "./Header/NavBar/loginModal";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Cookies from "js-cookie";
import { Badge, Button, Card, CardBody } from "reactstrap";
import { useRouter } from "next/navigation";


const HomeCardsContainer = ({ data, startIndex, count }) => {
  const cardsToShow = data?.slice(startIndex, startIndex + count);
  const wordpressURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const [wishlist, setWishlist] = useState([]);
  const token = Cookies.get("token") || null;
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const router = useRouter();
  const [showBy, setShowBy] = useState("20");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const accountNo = Cookies.get("account_no")
  ? Number(Cookies.get("account_no"))
  : null;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1399) {
        setShowBy("15");
      } else{
        setShowBy("20");
      }
      
    };

    window.addEventListener("resize", handleResize);


    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showBy]);

  const containerStyle = {
    position: "relative",
    borderRadius: "0.25rem",
    overflow: "hidden",
  };

  const imageStyle = (isHovered) => ({
    transition: "transform 0.5s ease",
    transform: isHovered ? "scale(1.2)" : "scale(1)",
  });

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  const handleWishlistClick = async (productId) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const data = {
        product_id: productId,
      };

      const response = await axiosInstance.post(
        `add-wishlist?username=${username}`,
        data,
        { headers }
      );
     

      // Update wishlist state
      setWishlist((prevWishlist) => [...prevWishlist, productId]);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const extractPath = (url) => {
    const pattern = /\/wp-content\/uploads\/\d{4}\/\d{2}\/[^/]+\.[a-z]{3,4}$/i;
    const match = url?.match(pattern);
    return match ? match[0] : null;
  };

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-5 g-3">
      {cardsToShow?.map((card, index) => (
        <div key={index} className="col">
          <Card className="explore-box card-animate">
            <div
              key={index}
              style={containerStyle}
              // onMouseEnter={() => handleMouseEnter(index)}
              // onMouseLeave={handleMouseLeave}
            >
              <Link
                href={`/product/${card.slug}`}
                style={{ textDecoration: "none" }}
              >
              {card.thumbnail_url ? (
                <img
                  src={`${wordpressURL}/${extractPath(card.thumbnail_url)}`}
                  alt="Product Thumbnail"
                  width="200"
                  style={imageStyle(hoveredIndex === index)}
                  className="card-img-top explore-img"
                />
              ) : (
                <img
                  src="https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg"
                  alt="Placeholder"
                  width="200"
                  style={imageStyle(hoveredIndex === index)}
                  className="card-img-top explore-img"
                />
                
              )}
              </Link>
            </div>



            <CardBody className="p-2">
              <Link
                href={`/product/${card.slug}`}
                style={{ textDecoration: "none" }}
              >
                <h6 className="text-dark title-hover" style={{ height: "4rem" }}>
                  {card?.title.replace(/&amp;/g, '&')}
                </h6>
              </Link>           

             

              {token ? (
                <div className="d-flex align-items-center justify-content-between">
                  <Button
                    size="sm"
                    style={{
                      background: 'none',
                      border: 'none'
                     }}
                  >
                    {(() => {
                      const prices = card.meta
                        ?.filter((metaItem) => metaItem.meta_key === "_price")
                        .map((metaItem) => parseFloat(metaItem.meta_value));
                      const lowestPrice =
                        prices?.length > 0 ? Math.min(...prices) : null;
                      return (
                        prices?.length > 0 && (
                          <p
                          style={{
                            position: "relative",
                            display: "inline-block",
                            color: "#000000",
                            // fontWeight: "bold",
                            margin: '0px',
                            fontSize: '20px'
                          }}
                        >
                          Splash Price: <span style={{color:'red'}}> $ {lowestPrice.toFixed(2)} </span>

                        </p>
                        )
                      );
                    })()}
                  </Button>
                  <Button
                    size="sm"
                    style={{
                      backgroundColor: "white",
                      // border: "none",
                    }}
                    className="rounded-pill"
                  >
                    <Link
                      href={`/product/${card.slug}`}
                      style={{ textDecoration: "none", color: "darkpink" }}
                    >
                      <ShoppingCartOutlinedIcon />
                      
                    </Link>
                  </Button>
                </div>
              ) : (
                <div>
                  <Button onClick={handleOpen} size="sm" className="w-100">
                    Login for Price
                  </Button>
                  <LoginModal open={open} handleClose={handleClose} />
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default HomeCardsContainer;
