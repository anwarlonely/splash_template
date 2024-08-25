"use client";
import React, { useState, useEffect } from "react";
import TopBar from "../../Components/Header/topBar";
import { Container, Box, Grid } from "@mui/material";
import SideNav from "../../Components/SideNav/sideNav";
import Footer from "../../Components/Footer/footer";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import "../../../styles/styles.scss";
import LoginModal from "../../Components/Header/NavBar/loginModal";
import ProfileData from "@/app/Components/Header/NavBar/profileData";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from "@mui/material/Tooltip";
import Carousel from "react-bootstrap/Carousel";
import {
  useAddProductMutation,
  useGetCartProductsQuery,
  useGetRecomandedDataMutation,
  useGetRecommandedProductMutation,
  useGetSingleProductQuery,
  useGetUpdateCartMutation,
} from "@/redux/features/product/productApi";
import { useDispatch } from "react-redux";
import { set_cartdata } from "@/redux/features/product/productSlice";
import { notifyError, notifySuccess, notifyWarning } from "@/Utils/toast";
import { Modal } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import {
  Button,
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  Spinner,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import ScrollTopButton from "@/app/Components/scrollToTop";

export default function SingleProductData({ params }) {
  const dispatch = useDispatch();
  const frontendURL = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const wordpressURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const [productData, setProductData] = useState(null);
  const [productId, setProductId] = useState("");
  const [recommendedData, setRecommendedData] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const [quantities, setQuantities] = useState([]);
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flavourSearch, setFlavourSearch] = useState("");
  const imageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const token = Cookies.get("token") || null;
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  const accountNo = Cookies.get("account_no")
    ? Number(Cookies.get("account_no"))
    : null;
  const [open, setOpen] = useState(false);
  const [membership, setMembership] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [novariationquantity, setNovariationquantity] = useState(0);
  const [message, setMessage] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [addProductCart, {}] = useAddProductMutation();
  const [getRecommandedProduct, {}] = useGetRecomandedDataMutation();
  const [updateCartList, {}] = useGetUpdateCartMutation();
  const singleProductResponse = useGetSingleProductQuery(params);
  const cartProducts = useGetCartProductsQuery(userId);
  const [getRecommanded, {}] = useGetRecommandedProductMutation();
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showBy, setShowBy] = useState("20");
  console.log("productDatasssss", productData);
  console.log("isSmallScreen", isSmallScreen);
  const filteredData = productData?.variations?.filter((item) =>
    item?.meta?.attribute_flavor
      .toLowerCase()
      .includes(flavourSearch.toLowerCase())
  );
  console.log("filteredData", filteredData);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1197);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1399) {
        setShowBy("15");
      } else {
        setShowBy("20");
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showBy]);

  useEffect(() => {
    if (productImages.length > 0) {
      setMainImage(productImages[0]);
    } else {
      setMainImage(productImages[0]);
    }
  }, [productImages]);

  const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
      function handleResize() {
        setWindowWidth(window.innerWidth);
      }

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowWidth;
  };

  const windowWidth = useWindowWidth();

  const handleGetRecommendedProduct = (productSlug) => {
    setSelectedSlug(productSlug);
    if (productSlug) {
      getRecommanded(productSlug).then((res) => {
        if (res?.data) {
          setNovariationquantity(0);
          updateCartList(userId).then((response) => {
            if (response?.data?.cart_items?.length > 0) {
              dispatch(set_cartdata(response?.data));
            }
          });
          setProductData(res?.data);
          setProductId(res?.data?.id);
          setQuantities(Array(res?.data?.variations?.length)?.fill(0));
          setProductImages(res?.data?.images);
          if (res?.data?.thumbnail_url) {
            setProductImages((prevImages) => [
              res?.data?.thumbnail_url,
              ...prevImages,
            ]);
          }
        }
      });
    }
  };

  useEffect(() => {
    if (cartProducts?.isSuccess) {
      dispatch(set_cartdata(cartProducts?.data));
    }
  }, [cartProducts]);

  useEffect(() => {
    if (singleProductResponse?.isSuccess) {
      setProductData(singleProductResponse?.data);

      setProductId(singleProductResponse?.data?.id);
      setQuantities(
        Array(singleProductResponse?.data?.variations?.length)?.fill(0)
      );
      setProductImages(singleProductResponse?.data?.images);
      if (singleProductResponse?.data?.thumbnail_url) {
        setProductImages((prevImages) => [
          singleProductResponse?.data?.thumbnail_url,
          ...prevImages,
        ]);
      }

      let title = `${singleProductResponse?.data?.name} - Splash Distributors LLC`;
      const description = singleProductResponse?.data?.name;
      const url = `${frontendURL}/product/${singleProductResponse?.data?.slug}`;
      const imageUrl = singleProductResponse?.data?.thumbnail_url;

      document.title = title;
      const setMetaTag = (key, value, attribute = "property") => {
        let metaTag = document.querySelector(`meta[${attribute}="${key}"]`);
        if (!metaTag) {
          metaTag = document.createElement("meta");
          metaTag?.setAttribute(attribute, key);
          document?.head.appendChild(metaTag);
        }
        metaTag.setAttribute("content", value);
      };

      setMetaTag("og:title", title);
      setMetaTag("og:description", description);
      setMetaTag("og:url", url);
      setMetaTag("og:image", imageUrl);
      setMetaTag("description", description, "name");

      setMetaTag("twitter:card", "summary_large_image", "name");
      setMetaTag("twitter:title", title, "name");
      setMetaTag("twitter:description", description, "name");
      setMetaTag("twitter:url", url, "name");
      setMetaTag("twitter:image", imageUrl, "name");
    }
  }, [singleProductResponse]);

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

  const toprightnotify = () => {
    toast.success("Products added to cart", {
      position: "top-right",
      hideProgressBar: true,
      className: "bg-success text-white",
    });
  };

  const warningnotify = () => {
    toast.warn(message, {
      position: "top-right",
      hideProgressBar: true,
      closeOnClick: false,
      className: "bg-warning text-white",
    });
  };

  useEffect(() => {
    if (message === "Products added to cart") {
      toprightnotify();
    } else if (message) {
      warningnotify();
    }
  }, [message]);

  const handleIncrease = () => {
    if (novariationquantity < productData?.stock_quantity) {
      if (productData?.max_quantity !== "") {
        if (novariationquantity + 1 <= parseInt(productData?.max_quantity)) {
          setNovariationquantity((prevQuantity) => prevQuantity + 1);
          if (novariationquantity + 1 === parseInt(productData?.max_quantity)) {
            notifyWarning(
              `Can not increase quantity more than purchase limit ${productData?.max_quantity}`
            );
          }
        }
      } else {
        setNovariationquantity((prevQuantity) => prevQuantity + 1);
      }
    }
  };

  const handleDecrease = () => {
    if (novariationquantity > 0) {
      setNovariationquantity(novariationquantity - 1);
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= productData.stock_quantity) {
      setNovariationquantity(value);
    } else {
      console.log("someting wrong quantity");
    }
  };

  // const handleOpen = () => router.push("/myaccount?tab=login");
  // const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const loginCredentials = ProfileData();
  const capabilities = loginCredentials?.capabilities;

  useEffect(() => {
    if (capabilities) {
      const [[key, value]] = Object.entries(capabilities);
      setMembership(key);
    }
  }, [capabilities]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (productId) {
      getRecommandedProduct(productId).then((res) => {
        if (res?.data?.related_products?.length > 0) {
          setRecommendedData(res?.data?.related_products);
        } else {
          setRecommendedData([]);
        }
      });
    }
  }, [productId]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  const handlePreviousClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleQuantityChange = (index, value) => {
    const updatedQuantities = [...quantities];
    const stock = productData.variations[index].meta._stock;
    const newValue = Math.max(0, Math.min(stock, value));
    updatedQuantities[index] = newValue;
    setQuantities(updatedQuantities);

    const updatedCart = productData.variations.map((product, i) => ({
      product_id: productData.id,
      quantity: updatedQuantities[i],
      variation_id: product.id,
    }));

    setCart(updatedCart.filter((item) => item.quantity > 0));
  };

  const decreaseQuantity = (index) => {
    if (quantities[index] > 0) {
      handleQuantityChange(index, quantities[index] - 1);
    }
  };

  const increaseQuantity = (index) => {
    if (quantities[index] < productData.variations[index].meta._stock) {
      handleQuantityChange(index, quantities[index] + 1);
      setMessage("");
    } else {
      console.log("Stock exceded");
      setMessage("Stock exceded");
    }
  };

  const handleAddToCart = () => {
    const variations = cart?.map((item) => ({
      variation_id: item.variation_id,
      quantity: item.quantity,
    }));

    const items = {
      user_id: userId,
      product_id: productData.id,
      variations: variations,
    };
    addProductCart(items).then((res) => {
      if (res?.data?.status) {
        const updatedQty = quantities?.map(() => 0);
        setQuantities(updatedQty);
        updateCartList(userId).then((response) => {
          if (response?.data?.cart_items?.length > 0) {
            dispatch(set_cartdata(response?.data));
          }
        });
        notifySuccess(res?.data?.success);
      }
    });
  };

  const handleAddToCartNoVariation = () => {
    const variations = [
      {
        variation_id: "",
        quantity: novariationquantity,
      },
    ];
    const itemsNoVariation = {
      user_id: userId,
      product_id: productData.id,
      variations: variations,
    };

    addProductCart(itemsNoVariation).then((res) => {
      if (res?.data?.status) {
        setNovariationquantity(0);
        updateCartList(userId).then((response) => {
          if (response?.data?.cart_items?.length > 0) {
            dispatch(set_cartdata(response?.data));
          }
        });
        notifySuccess(res?.data?.success);
      }
    });
  };

  const handleGalleryImageClick = (src, index) => {
    setShowImage(true);
    setMainImage(src);
    setSelectedImageIndex(index);
  };

  const extractPath = (url) => {
    const pattern = /\/wp-content\/uploads\/\d{4}\/\d{2}\/[^/]+\.[a-z]{3,4}$/i;
    const match = url?.match(pattern);
    return match ? match[0] : null;
  };

  const renderShimmerEffect = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} className="recommended">
        <div className="shimmer-wrapper shimmer-recommended">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="shimmer shimmer-image" />
              <div className="shimmer shimmer-text" style={{ width: "70%" }} />
            </div>
          ))}
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className="shimmer-wrapper shimmer-product">
          <div className="shimmer shimmer-image" />
        </div>
        <div className="shimmer-wrapper shimmer-details">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="shimmer shimmer-text" />
          ))}
        </div>
      </Grid>
      <Grid item xs={12} md={4}>
        <div className="shimmer-wrapper shimmer-details">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="shimmer shimmer-text"
              style={{ width: index % 2 === 0 ? "100%" : "60%" }}
            />
          ))}
          <div className="shimmer shimmer-table" />
          <div className="shimmer shimmer-button" />
        </div>
      </Grid>
    </Grid>
  );

  if (!productData) {
    return (
      <Container className="container">
        <TopBar />
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <SideNav />
          <Box sx={{ flexGrow: 1, padding: "20px" }} className="single-product">
            {/* {renderShimmerEffect()} */}
          </Box>
        </Box>
        <Footer />
        <ScrollTopButton />
      </Container>
    );
  }

  return (
    <Container className="container">
      <TopBar />
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {/* <SideNav /> */}
        <Box sx={{ flexGrow: 1, padding: "20px" }} className="single-product">
          <Grid
            container
            spacing={2}
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              item
              xs={12}
              md={8}
              lg={4}
              xl={3}
              className="recommended"
              style={{
                height: isSmallScreen ? "" : "100vh",
                minHeight: "200px",
                overflow: "hidden",
                // position: "-webkit-sticky",
                position: isSmallScreen ? "relative" : "sticky",
                border: "2px sold red",
                top: "1%",
              }}
            >
              <h1 className="text-2xl font-normal whitespace-normal mb-4">
                Recommended Products
              </h1>
              <SimpleBar
                autoHide={false}
                className="simplebar-track-secondary"
                style={{ maxHeight: "500px" }}
              >
                {recommendedData?.map((product, index) =>
                  product?.product_visibility !== "outofstock" ? (
                    // <Link
                    //           href={`/product/${product.slug}`}
                    //           style={{ textDecoration: "none" }}
                    //         >
                    <Card
                      className={`card mb-2 cursor-pointer ${
                        selectedSlug === product?.slug ? "highlighted" : ""
                      }`}
                      key={index}
                      onClick={() => handleGetRecommendedProduct(product?.slug)}
                    >
                      <CardBody className="card-body">
                        <div className="d-flex d-md-flex d-lg-flex align-items-center gap-2">
                          <div
                            style={containerStyle}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            className="avatar-sm rounded"
                          >
                            <img
                              className="img-thumbnail"
                              alt="200x200"
                              width="100"
                              style={imageStyle(hoveredIndex === index)}
                              src={
                                product.thumbnail
                                  ? `${imageURL}/${product.thumbnail}`
                                  : `${imageURL}/woocommerce-placeholder.png`
                              }
                            />
                          </div>
                          <div style={{ width: "100%" }}>
                            <Tooltip
                              title={product.name.replace(/&amp;/g, "&")}
                              arrow
                            >
                              <h6
                                className="text-dark"
                                style={{
                                  whiteSpace: "normal",
                                  width: "100%",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {product.name.replace(/&amp;/g, "&").length > 50
                                  ? `${product.name
                                      .replace(/&amp;/g, "&")
                                      .substring(0, 50)}...`
                                  : product.name.replace(/&amp;/g, "&")}
                              </h6>
                            </Tooltip>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ) : //  </Link>
                  null
                )}
              </SimpleBar>
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              lg={4}
              xl={4}
              style={{
                height: isSmallScreen ? "" : "100vh",
                minHeight: "200px",
                overflow: "hidden",
                // position: "-webkit-sticky",
                position: isSmallScreen ? "relative" : "sticky",
                top: "1%",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} xl={12}>
                  <div
                    className={`flex items-center justify-center product ${
                      isHovered ? "hovered" : ""
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onMouseMove={handleMouseMove}
                    style={{
                      width: windowWidth <= 896 && "50%",
                      margin: windowWidth <= 896 && "auto",
                    }}
                  >
                    <div
                      className="magnifier"
                      style={{
                        backgroundPosition,
                        // backgroundImage: `url('${mainImage}')`,
                        backgroundImage: `url('${wordpressURL}${extractPath(
                          mainImage
                        )}')`,
                        // border:"none"
                      }}
                    />
                    <img
                      src={
                        mainImage
                          ? `${wordpressURL}/${extractPath(mainImage)}`
                          : "https://eadn-wc05-12948169.nxedge.io/wp-content/uploads/woocommerce-placeholder.png"
                      }
                      alt="Product Image"
                      className="product-image cursor-pointer"
                    />
                    <>
                      <button
                        onClick={handlePreviousClick}
                        className="arrow-button left-arrow"
                      >
                        <NavigateBeforeIcon />
                      </button>
                      <button
                        onClick={handleNextClick}
                        className="arrow-button right-arrow"
                      >
                        <NavigateNextIcon />
                      </button>
                      <button className="plus-button" onClick={toggleModal}>
                        <AddIcon />
                      </button>
                      {/* {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                          <div
                            className="bg-black bg-opacity-50 absolute inset-0"
                            onClick={toggleModal}
                          ></div>
                          <div className="relative bg-white rounded-lg z-10">
                            <button
                              className="absolute top-2 right-2 text-black"
                              onClick={toggleModal}
                            >
                              <CloseIcon />
                            </button>
                            <button
                              onClick={handlePreviousClick}
                              className="arrow-button left-arrow"
                            >
                              <NavigateBeforeIcon />
                            </button>
                            <button
                              onClick={handleNextClick}
                              className="arrow-button right-arrow"
                            >
                              <NavigateNextIcon />
                            </button>
                            <img
                              src={productImages[currentImageIndex]}
                              alt="var-image"
                              style={{ width: "40.63rem", height: "40.63rem" }}
                            />
                          </div>
                        </div>
                      )} */}

                      <Modal show={isModalOpen} onHide={toggleModal}>
                        <Modal.Header closeButton>
                          <Modal.Title>Image Preview</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="d-flex">
                            <button
                              onClick={handlePreviousClick}
                              className="arrow-button left-arrow"
                            >
                              <NavigateBeforeIcon />
                            </button>
                            <div className="text-center">
                              <img
                                src={productImages[currentImageIndex]}
                                alt="var-image"
                                style={{ width: "100%", height: "auto" }}
                              />
                            </div>
                            <button
                              onClick={handleNextClick}
                              className="arrow-button right-arrow"
                            >
                              <NavigateNextIcon />
                            </button>
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={toggleModal}>
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} className="var-images-container ">
                    {/* {productImages?.map((image, index) => (
                      <Grid item key={index}>
                        <img
                          className={`img-thumbnail ${
                            currentImageIndex === index ? "selected" : ""
                          }`}
                          alt="var-images"
                          width="100"
                          style={{ cursor: "pointer" }}
                          src={image}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      </Grid>
                    ))} */}
                    <Carousel
                      indicators={false}
                      className="mt-4"
                      style={{ margin: "25px" }}
                    >
                      {productImages
                        ?.reduce((acc, img, index) => {
                          if (index % 4 === 0) {
                            acc.push([]);
                          }
                          acc[acc.length - 1].push(img);
                          return acc;
                        }, [])
                        .map((imagesInSlide, slideIndex) => (
                          <Carousel.Item
                            key={slideIndex}
                            style={{ maxWidth: "350px" }}
                          >
                            <Row>
                              {imagesInSlide.map((img, imgIndex) => (
                                <Col
                                  key={imgIndex}
                                  xs={3}
                                  md={3}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div
                                    onClick={() =>
                                      handleGalleryImageClick(
                                        img,
                                        slideIndex * 4 + imgIndex
                                      )
                                    }
                                  >
                                    <img
                                      src={`${wordpressURL}/${extractPath(
                                        img
                                      )}`}
                                      width={500}
                                      height={300}
                                      alt={`Gallery Description ${
                                        slideIndex * 4 + imgIndex + 1
                                      }`}
                                      // className={`img-fluid ${style.galleryImage}`}
                                      style={{
                                        border:
                                          selectedImageIndex ===
                                          slideIndex * 4 + imgIndex
                                            ? "1px solid #e5e8ec"
                                            : "1px solid white",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </Carousel.Item>
                        ))}
                    </Carousel>
                  </Grid>
                </Grid>
          
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={8} lg={4} xl={5}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <h6 className="text-dark  mb-1">{productData.name}</h6>
                  <p className="product-sku text-sm font-semibold mb-2">
                    SKU:
                    <span className="span-text ml-2">{productData.sku}</span>
                  </p>
                  {token ? (
                    <>
                      <p
                        className="product-price text-lg font-semibold m-4 mb-4"
                        style={{
                          position: "relative",
                          display: "inline-block",
                          zIndex: isModalOpen && "-1",
                        }}
                      >
                        {/* ${productData?.ad_price} */}
                        {membership !== "administrator" && (
                          <span
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "34px",
                              transform: "translate(-50%, -50%)",
                              color: "#8380804d",
                              fontSize: "xx-large",
                              pointerEvents: "none",
                              textDecoration: "line-through",
                            }}
                          >
                            ${productData?.ad_price}
                          </span>
                        )}
                      </p>
                      <p style={{ fontSize: "20px" }}>
                        Splash Price :{" "}
                        <span className="text-danger">
                          ${productData?.ad_price}
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <button onClick={handleOpen} className="login-button">
                        Login to see prices
                      </button>
                      <LoginModal open={open} handleClose={handleClose} />
                    </>
                  )}
                  <p className="product-sku text-sm font-semibold mb-2">
                    SKU:
                    <span className="text-dark ml-2">{productData.sku}</span>
                  </p>
                  <p className="product-categories text-sm font-semibold mb-2 ">
                    Categories:
                    {productData.categories
                      ?.filter((cat) => cat.name !== "variable")
                      .map((cat, index, array) => (
                        <Link
                          href={`/product-category/${cat.slug}?perPage=${showBy}&sort=latest`}
                          className="no-underline"
                        >
                          <span key={cat.id} className="ml-2 span-text">
                            {cat.name}
                            {index !== array.length - 1 && ","}
                          </span>
                        </Link>
                      ))}
                  </p>

                  <p className="product-categories text-sm font-semibold mb-2">
                    {Object.entries(productData?.brands).map(
                      ([key, brand], index, array) => (
                        <Link
                          key={brand.id}
                          href={`/brand/${brand.slug}`}
                          className="no-underline"
                        >
                          Brands:
                          <span className="ml-2 span-text">
                            {brand.name}
                            {index !== array.length - 1 && ","}
                          </span>
                        </Link>
                      )
                    )}
                  </p>
                  <div>
                    {productData?.max_quantity && (
                      <p className="no-data mb-2">
                        Each store is limited to sell a maximum of{" "}
                        {productData.max_quantity}
                      </p>
                    )}
                  </div>
                </Grid>
                {token && (
                  <Grid item xs={12}>
                    {productData?.variations?.length === 0 ? (
                      <>
                        {productData.stock_quantity <= 0 ? (
                          <div className="pt-2">
                            <Button
                              color="primary"
                              className="bg-gradient"
                              onClick={handleAddToCartNoVariation}
                              disabled={novariationquantity === 0}
                            >
                              {" "}
                              Out Of Stock{" "}
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <div>
                              <p className="product-sku text-sm font-semibold mb-2">
                                {productData.stock_quantity <= 0 ? (
                                  "Out of stock"
                                ) : (
                                  <span className="text-success ml-2 badge  bg-success-subtle fs-6">
                                    {productData.stock_quantity}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                border: "1px solid #e6dfdf",
                                padding: "10px",
                                width: "50%",
                                gap: "10px",
                                borderRadius: "5px",
                              }}
                            >
                              <div
                                className="cart-count"
                                style={{ padding: "10px" }}
                              >
                                <button
                                  style={{ minWidth: "2rem" }}
                                  onClick={handleDecrease}
                                >
                                  -
                                </button>
                                <input
                                  type="text"
                                  value={novariationquantity}
                                  onChange={handleChange}
                                  min="0"
                                  max={productData.stock_quantity}
                                  style={{ width: "3rem", textAlign: "center" }}
                                />
                                <button
                                  style={{ minWidth: "2rem" }}
                                  onClick={handleIncrease}
                                  disabled={
                                    parseInt(novariationquantity) ===
                                      parseInt(productData?.max_quantity) ||
                                    parseInt(novariationquantity) ===
                                      parseInt(productData?.stock_quantity)
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <div
                                className="pt-2"
                                style={{
                                  zIndex: isModalOpen ? "-1" : "2",
                                  border: isModalOpen ? "red" : "green",
                                }}
                              >
                                <button
                                  className="btn btn-danger"
                                  style={{
                                    backgroundColor: "#D4007E",
                                    color: "#FFFFFF",
                                    padding: "10px",
                                    position: "relative",
                                    bottom: "5px",
                                  }}
                                  onClick={handleAddToCartNoVariation}
                                  disabled={novariationquantity === 0}
                                >
                                  Add to cart
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div
                        className="table-container"
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div className="table-responsive">
                          <div
                            className="search-wrapper"
                            style={{
                              padding: "4px",
                              borderBottom: "1px solid #ccc",
                              boxSizing: "border-box", // Ensures padding is included in the width calculation
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Search..."
                              style={{
                                width: "100%", // Set width to 100% to match table width
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                boxSizing: "border-box",
                              }}
                              value={flavourSearch}
                              onChange={(e) => setFlavourSearch(e.target.value)}
                            />
                          </div>
                          <table className="table align-middle table-nowrap table-striped table-bordered mb-0">
                            <thead className="table-white">
                              <tr className="text-center">
                                <th scope="col">Flavor</th>
                                <th scope="col">Stock</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData?.map((product, index) => {
                                const attributeKeys = Object.keys(
                                  product.meta
                                ).filter((key) => key.startsWith("attribute_"));
                                let attributeValue = "";

                                if (attributeKeys.length >= 2) {
                                  attributeValue = `${
                                    product.meta[attributeKeys[0]]
                                  } - ${product.meta[attributeKeys[1]]}`;
                                } else if (attributeKeys.length === 1) {
                                  attributeValue =
                                    product.meta[attributeKeys[0]];
                                }

                                return (
                                  <tr key={product.id} className="text-center">
                                    <td className="text-left">
                                      {attributeValue}
                                    </td>
                                    <td>
                                      <p
                                        style={{
                                          borderRadius: "4px",
                                          backgroundColor: "#f4faf6",
                                          color:
                                            parseInt(product.meta._stock) <= 0
                                              ? "inherit"
                                              : "#00a046",
                                          padding: "6px 14px",
                                        }}
                                        className="mt-1"
                                      >
                                        <span
                                          style={{
                                            fontSize: "0.875rem",
                                            marginRight: "6px",
                                          }}
                                        >
                                          &#xe81c;
                                        </span>
                                        {parseInt(product.meta._stock) <= 0
                                          ? 0
                                          : parseInt(product.meta._stock)}
                                      </p>
                                    </td>
                                    <td style={{ textAlign: "left" }}>
                                      {membership === "administrator" ? (
                                        <p style={{ color: "#f60" }}>
                                          ${product?.ad_price || 0}
                                        </p>
                                      ) : (
                                        <>
                                          <p class="price">
                                            <span
                                              style={{
                                                textDecoration: "line-through",
                                              }}
                                            >
                                              ${accountNo}
                                            </span>
                                            <p class="overlay-text mb-2">
                                              Splash Price: <br />{" "}
                                              <span
                                                style={{
                                                  textDecoration: "underline",
                                                }}
                                              >
                                                ${product?.ad_price || 0}{" "}
                                              </span>
                                            </p>
                                          </p>
                                        </>
                                      )}
                                    </td>
                                    <td>
                                      {product.meta._stock <= 0 ? (
                                        "Out of stock"
                                      ) : (
                                        <div
                                          className="cart-count m-auto d-flex"
                                          style={{
                                            backgroundColor: "#eee",
                                            borderRadius: "4px",
                                            padding: "6px",
                                            border: "1px solid #eee",
                                          }}
                                        >
                                          <button
                                            onClick={() =>
                                              decreaseQuantity(index)
                                            }
                                            style={{
                                              minWidth: "1.5rem",
                                              borderRight: "2px solid #e2e2e2",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            -
                                          </button>
                                          <input
                                            type="text"
                                            value={quantities[index]}
                                            onChange={(e) =>
                                              handleQuantityChange(
                                                index,
                                                parseInt(e.target.value) || 0
                                              )
                                            }
                                            min="0"
                                            max={product.meta._stock}
                                            style={{
                                              width: "3rem",
                                              textAlign: "center",
                                              borderLeft: "1px solid #eee",
                                              background: "transparent",
                                              borderTop: "none",
                                              borderBottom: "none",
                                              fontWeight: "bold",
                                            }}
                                          />
                                          <button
                                            onClick={() =>
                                              increaseQuantity(index)
                                            }
                                            style={{
                                              minWidth: "1.5rem",
                                              borderLeft: "2px solid #e2e2e2",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            +
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                    <td>
                                      <button
                                        className="btn btn-danger"
                                        style={{
                                          backgroundColor: "#D4007E",
                                          color: "#FFFFFF",
                                        }}
                                      >
                                        Add
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      //   </CardBody>
                      // </Card>
                    )}
                    {token && productData?.variations?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          color: "#D4007E",
                        }}
                      >
                        {/* <button
          style={{
            color: "white",
            backgroundColor: "#D4007E", // Assuming you want a transparent background
            border: "none", // Remove default border if not needed
            cursor: "pointer",
            fontSize: "inherit",
            padding:"10px" ,
            borderRadius:"5px"// Inherit font size from parent, adjust as needed
          }}
          className="bg-gradient mt-2"
          onClick={handleAddToCart}
          disabled={quantities.every((quantity) => quantity === 0)}
        >
          Bulk cart
        </button> */}
                        <button
                          className="btn btn-danger"
                          style={{
                            backgroundColor: "#D4007E",
                            color: "#FFFFFF",
                          }} // Adjust text color for contrast
                          onClick={handleAddToCart}
                          disabled={quantities.every(
                            (quantity) => quantity === 0
                          )}
                        >
                          <ShoppingCartOutlinedIcon />
                          Bulk Cart
                        </button>
                      </div>
                    )}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>

          <>
            <ToastContainer />
          </>
          <div
          // className="product-description mt-4"
          // dangerouslySetInnerHTML={{ __html: productData.description }}
          />
        </Box>
      </Box>
      <Footer />
      <ScrollTopButton />
    </Container>
  );
}
