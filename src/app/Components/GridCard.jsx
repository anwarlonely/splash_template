import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button, Card, CardBody } from "reactstrap";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LoginModal from "./Header/NavBar/loginModal";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";



const GridCard = ({ displayedProducts, token }) => {
  const [wishlist, setWishlist] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const wordpressURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const router = useRouter();
  const [showBy, setShowBy] = useState("20");
  const accountNo = Cookies.get("account_no")
    ? Number(Cookies.get("account_no"))
    : null;
  // const handleOpen = () => router.push("/myaccount?tab=login");
  
  const handleOpen = () => {
    // Store the current path in local storage
    sessionStorage.setItem("lastPath", window.location.pathname);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

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
      {displayedProducts?.map((product, index) => (
        <div key={index} className="col">
          <Card className="explore-box card-animate">
            <div
              key={index}
              style={containerStyle}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <Link href={`/product/${product.slug}`}>
                {product.thumbnail_url ? (
                  <img
                    src={`${wordpressURL}/${extractPath(product.thumbnail_url)}`}
                    alt="Product Thumbnail"
                    width="200"
                    style={imageStyle(hoveredIndex === index)}
                    className="card-img-top explore-img"
                  />
                ) : (
                  <img
                    src={`${ImageURL}/woocommerce-placeholder.png`}
                    alt="Placeholder"
                    width="200"
                    style={imageStyle(hoveredIndex === index)}
                    className="card-img-top explore-img"
                  />
                )}
              </Link>
            </div>

            <div
              className="bookmark-icon position-absolute top-0 end-0 p-2 cursor-pointer"
              onClick={() => handleWishlistClick(product.ID)}
            >
              {wishlist?.includes(product?.ID) ? (
                <FavoriteOutlinedIcon style={{ color: "#e27c7c" }} />
              ) : (
                <FavoriteBorderOutlinedIcon style={{ color: "#444" }} />
              )}
            </div>

            <div className="bookmark-icon position-absolute top-0 start-0 p-2">
              {product.meta?.map(
                (metaItem) =>
                  metaItem.meta_key === "_stock_status" && (
                    <span
                      key={metaItem.meta_key}
                      className={`badge ${
                        metaItem.meta_value === "instock"
                          ? "bg-success-subtle text-success"
                          : "bg-warning text-body"
                      }`}
                    >
                      {metaItem.meta_value}
                    </span>
                  )
              )}
            </div>

            <CardBody className="p-2">
              <Link
                href={`/product/${product.slug}`}
                style={{ textDecoration: "none" }}
              >
                <h6 className="text-dark title-hover" style={{ height: "4rem" }}>
                  {product?.title.replace(/&amp;/g, '&')}
                </h6>
              </Link>
              {/* <div
                className={`flex flex-row items-center flex-wrap gap-1 mb-1 mt-1 ${
                  product?.categories?.some(
                    (cat) => cat.taxonomy === "product_cat"
                  )
                    ? "h-20"
                    : ""
                }`}
              >
                {product?.categories?.map(
                  (cat, index) =>
                    cat.taxonomy === "product_cat" && (
                      <div key={index}>
                        <Link
                          href={`/product-category/${cat?.slug}?perPage=${showBy}&sort=latest`}
                          key={cat?.term_id}
                          className="category"
                        >
                          <span className="badge bg-warning-subtle text-dark">
                            {cat?.name.replace(/&amp;/g, '&')}
                          </span>
                        </Link>
                      </div>
                    )
                )}
              </div> */}
              {/* <div>
                {product.meta?.map(
                  (metaItem) =>
                    metaItem.meta_key === "_sku" && (
                      <p key={metaItem.meta_key} className="product-des">
                        <Badge color="light" className="text-body">
                          SKU: {metaItem.meta_value}
                        </Badge>
                      </p>
                    )
                )}
              </div> */}

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
                      const prices = product.meta
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
                            fontSize: '16px'
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
                      border: "1px solid #e0e5ea"
                    }}
                    
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      style={{ textDecoration: "none", color: "#d3007e" }}
                    >
                      <ShoppingCartOutlinedIcon />
                      
                    </Link>
                  </Button>
                </div>
              ) : (
                <div>
                  <Button  size="sm" onClick={handleOpen} className="w-100">
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

export default GridCard;
