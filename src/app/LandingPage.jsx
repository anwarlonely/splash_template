"use client";
import React, { useState, useEffect } from "react";
import { Container, Box, IconButton } from "@mui/material";
import TopBar from "./Components/Header/topBar";
import SideNav from "./Components/SideNav/sideNav";
import Footer from "./Components/Footer/footer";
import CarouselComponent from "./Components/carouselComponent";
import Link from "next/link";
import HomeCardsContainer from "./Components/homeCardsContainer";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ScrollTopButton from "./Components/scrollToTop";
import Cookies from "js-cookie";
import style from "../styles/page.module.css";
import {
  useGetCategoryDataQuery,
  useGetDiscountRulesMutation,
  useGetLandingPageDataQuery,
  useGetUpdateCartMutation,
} from "@/redux/features/product/productApi";
import { set_cartdata } from "@/redux/features/product/productSlice";
import { useDispatch } from "react-redux";
import CarouselComponent2 from "./Components/CarouselComponent2";
import applyRules from "@/Utils/cartRule";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Row,
  Button,
} from "reactstrap";

import { UncontrolledCarousel } from "reactstrap";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Mousewheel } from "swiper/modules";
// import "swiper/swiper-bundle.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import './BrandCarousel.css';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SingleStrip from "./Components/landingpage/SingleStrip";
import CenterBanners from "./Components/landingpage/CenterBanners";
import SliderWithPosters from "./Components/landingpage/SliderWithPosters";
import Categories from "./Components/landingpage/Categories";
import PosterWithGifs from "./Components/landingpage/PosterWithGifs";
import Sliders from "./Components/landingpage/Sliders";
import Brands from "./Components/landingpage/Brands";
import HomeCards from "./Components/homeCards";
import MobileStickey from "./Components/Header/NavBar/MobileStickeyNav";

export default function LandingPage() {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const frontendURL = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [card, setCard] = useState([]);
  const [brandcards1, setBrandcards1] = useState([]);
  const [banner1, setBanner1] = useState([]);
  const [banner2, setBanner2] = useState([]);
  const [brandcards2, setBrandcards2] = useState([]);
  const [brandcards3, setBrandcards3] = useState([]);
  const [card2, setCard2] = useState([]);
  const [banner3, setBanner3] = useState([]);
  const [banner4, setBanner4] = useState([]);
  const [banner5, setBanner5] = useState([]);
  const [banner6, setBanner6] = useState([]);
  const [products1, setProducts1] = useState([]);
  const [banner7, setBanner7] = useState([]);
  const [products2, setProducts2] = useState([]);
  const [banner8, setBanner8] = useState([]);
  const [products3, setProducts3] = useState([]);
  const [banner9, setBanner9] = useState([]);
  const [products4, setProducts4] = useState([]);
  const [banner10, setBanner10] = useState([]);
  const [products5, setProducts5] = useState([]);
  const [carouselItems1, setCarouselItems1] = useState([]);
  const [carouselItems2, setCarouselItems2] = useState([]);
  // const [updateCartItems, {}] = useGetUpdateCartMutation();
  const [updateCartList, {}] = useGetUpdateCartMutation();
  const [showBy, setShowBy] = useState("20");
  const [getdiscountRules, {}] = useGetDiscountRulesMutation();
  const [rules, setRules] = useState([]);
  const wordpressURL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  const landingApiResponse = useGetLandingPageDataQuery();
  const [isSticky, setIsSticky] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1224 && !isSmallScreen) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };

    // Run the resize handler initially
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    updateCartList(userId).then((response) => {
      if (response?.data?.status) {
        const productWithRules = applyRules(response?.data?.cart_items, rules);

        let updatedResponse = { ...response?.data };
        updatedResponse.cart_items = productWithRules;
        dispatch(set_cartdata(updatedResponse));
      }
    });
  }, [userId, rules]);

  useEffect(() => {
    getdiscountRules().then((response) => {
      setRules(response?.data);
    });
  }, []);

  useEffect(() => {
    if (landingApiResponse?.isSuccess) {
      const isPublicData = () => {
        if (token && landingApiResponse) {
          const completeData = landingApiResponse?.data?.filter(
            (item) =>
              item?.status === 1 &&
              (item?.visibility === "public" ||
                item?.visibility === "protected")
          );
          return completeData;
        } else if (landingApiResponse) {
          const filteredData = landingApiResponse?.data?.filter(
            (item) => item?.status === 1 && item?.visibility === "public"
          );
          return filteredData;
        } else {
          return [];
        }
      };
      const finalFilteredData = isPublicData();

      setCard(finalFilteredData?.filter((item) => item?.position === "card"));
      setBrandcards1(
        finalFilteredData?.filter((item) => item?.position === "brandcards1")
      );
      setBanner1(
        finalFilteredData?.filter((item) => item?.position === "banner1")
      );
      setBanner2(
        finalFilteredData?.filter((item) => item?.position === "banner2")
      );
      setBrandcards2(
        finalFilteredData?.filter((item) => item?.position === "brandcards2")
      );
      setBrandcards3(
        finalFilteredData?.filter((item) => item?.position === "brandcards3")
      );
      setCard2(finalFilteredData?.filter((item) => item?.position === "card2"));
      setBanner3(
        finalFilteredData?.filter((item) => item?.position === "banner3")
      );
      setBanner4(
        finalFilteredData?.filter((item) => item?.position === "banner4")
      );
      setBanner5(
        finalFilteredData?.filter((item) => item?.position === "banner5")
      );
      setBanner6(
        finalFilteredData?.filter((item) => item?.position === "banner6")
      );
      setProducts1(
        finalFilteredData?.filter((item) => item?.position === "products1")
      );
      setBanner7(
        finalFilteredData?.filter((item) => item?.position === "banner7")
      );
      setProducts2(
        finalFilteredData?.filter((item) => item?.position === "products2")
      );
      setBanner8(
        finalFilteredData?.filter((item) => item?.position === "banner8")
      );
      setProducts3(
        finalFilteredData?.filter((item) => item?.position === "products3")
      );
      setBanner9(
        finalFilteredData?.filter((item) => item?.position === "banner9")
      );
      setProducts4(
        finalFilteredData?.filter((item) => item?.position === "products4")
      );
      setBanner10(
        finalFilteredData?.filter((item) => item?.position === "banner10")
      );
      setProducts5(
        finalFilteredData?.filter((item) => item?.position === "products5")
      );
      setCarouselItems1(
        finalFilteredData
          ?.filter((item) => item?.position === "slider")
          ?.sort((a, b) => a?.serial - b?.serial)
      );
      setCarouselItems2(
        finalFilteredData
          ?.filter((item) => item?.position === "slider2")
          ?.sort((a, b) => a?.serial - b?.serial)
      );
    }
  }, [landingApiResponse, token]);

  useEffect(() => {
    const tokenFromStorage = Cookies.get("token");
    setToken(tokenFromStorage);
    setIsMounted(true);
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

  const [currentIndexCategory5, setCurrentIndexCategory5] = useState(0);

  const category5 = products5[0]?.link.toLowerCase().replace(/\s+/g, "-");

  const categoryResponse5 = useGetCategoryDataQuery({
    params: category5,
    page: 1,
    count: showBy,
    sort: "latest",
  });

  const [itemsToShow, setItemsToShow] = useState(5);

  const updateItemsToShow = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      setItemsToShow(2);
    } else if (width > 768 && width <= 1024) {
      setItemsToShow(3);
    } else if (width > 1024 && width <= 1439) {
      setItemsToShow(4);
    } else if (width > 1439 && width <= 1912) {
      setItemsToShow(5);
    } else if (width > 1912 && width < 2560) {
      setItemsToShow(5);
    } else {
      setItemsToShow(5);
    }
  };

  useEffect(() => {
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    // window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", updateItemsToShow);
      // window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNextClick1 = (setCurrentIndex, currentIndex, data) => {
    const itemsToShow = 1; // Only slide one item
    const maxIndex = data.length - itemsToShow;

    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevClick1 = (setCurrentIndex, currentIndex) => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!isMounted) {
    return null;
  }

  const verticalgifs = [
    {
      img_url:
        "https://ecom-dev.phantasm.digital/_next/image?url=https%3A%2F%2Fad-public-bucket.b-cdn.net%2Fimages%2F1718007986754-1718007986700-BannersGif.gif&w=640&q=75",
    },
    {
      img_url:
        "https://ecom-dev.phantasm.digital/_next/image?url=https%3A%2F%2Fad-public-bucket.b-cdn.net%2Fimages%2F1718349239929-1718349239662-12483396b562859a90769dcf086b2c87.gif&w=640&q=75",
    },
    {
      img_url:
        "https://ecom-dev.phantasm.digital/_next/image?url=https%3A%2F%2Fad-public-bucket.b-cdn.net%2Fimages%2F1718007986754-1718007986700-BannersGif.gif&w=640&q=75",
    },
    {
      img_url:
        "https://ecom-dev.phantasm.digital/_next/image?url=https%3A%2F%2Fad-public-bucket.b-cdn.net%2Fimages%2F1718349239929-1718349239662-12483396b562859a90769dcf086b2c87.gif&w=640&q=75",
    },
    {
      img_url:
        "https://ecom-dev.phantasm.digital/_next/image?url=https%3A%2F%2Fad-public-bucket.b-cdn.net%2Fimages%2F1718007986754-1718007986700-BannersGif.gif&w=640&q=75",
    },
  ];
  
  const gifsSliders = [
    {
      altText: " ",
      caption: " ",
      key: 1,
      src: "https://splashdistributors.com/wp-content/uploads/2023/11/POSHXTRONINST.jpg",
    },
    {
      altText: " ",
      caption: " ",
      key: 2,
      src: "https://splashdistributors.com/wp-content/uploads/2023/11/RAWBN.jpg",
    },
    {
      altText: " ",
      caption: " ",
      key: 3,
      src: "https://splashdistributors.com/wp-content/uploads/2023/11/TWISTBN.jpg",
    },
  ];

  const gifsSliders1 = [
    {
      altText: " ",
      caption: " ",
      key: 2,
      src: "https://splashdistributors.com/wp-content/uploads/2023/11/RAWBN.jpg",
    },
    {
      altText: " ",
      caption: " ",
      key: 1,
      src: "https://splashdistributors.com/wp-content/uploads/2023/11/POSHXTRONINST.jpg",
    },
    {
      altText: " ",
      caption: " ",
      key: 3,
      src: "https://splashdistributors.com/wp-content/uploads/2023/11/TWISTBN.jpg",
    },
  ];

  const centerBanners = [
    {
      img_url:
        "https://i.pinimg.com/originals/7d/75/99/7d75997dcd415b124da62b5e4df92900.gif",
    },
    {
      img_url:
        "https://im.indiatimes.in/content/2014/Aug/insta_1409378500.gif?w=640&h=427&cc=1&webp=1&q=75",
    },
    {
      img_url:
        "https://i.pinimg.com/originals/2d/63/4a/2d634a1d6a017484526a7be14b5d8c3c.gif",
    },
    {
      img_url:
        "https://im.indiatimes.in/content/2014/Aug/cc1_1409378556.gif?w=640&h=427&cc=1&webp=1&q=75",
    },
    {
      img_url:
        "https://i.pinimg.com/originals/35/9c/33/359c33b58d05836d3d1e2fd3aed306fc.gif",
    },
    {
      img_url:
        "https://static.wixstatic.com/media/bc4f04_033fc271c73d4586b4a19a55a48e9757~mv2.gif",
    },
  ];

  const gipPosters = [
    {
      img_url:
        "https://splashdistributors.com/wp-content/uploads/2024/06/1SALE-BANNER.png",
    },
  ];

  const gipPosters2 = [
    {
      img_url:
        "https://splashdistributors.com/wp-content/uploads/2024/06/GLASS-WEBSITE-BANNER.png",
    },
  ];

  const categoriesBanners = [
    {
      img1: "https://i.pinimg.com/564x/36/53/aa/3653aac5c3b29c95676b85a4e2483b4a.jpg",
      id: 1,
    },
    {
      img1: "https://i.pinimg.com/564x/fd/ee/c9/fdeec9234bd0222a375ade2c713c0ade.jpg",
      id: 2,
    },
    {
      img1: "https://i.pinimg.com/564x/d5/35/4d/d5354d0ff6499e9b480ed703c114317e.jpg",
      id: 3,
    },
    {
      img1: "https://i.pinimg.com/564x/53/75/d7/5375d7558e179e8db9c8ff21572aa8d6.jpg",
      id: 4,
    },
    {
      img1: "https://i.pinimg.com/564x/b8/41/6b/b8416b9f9f4831200060438ce6cb60d7.jpg",
      id: 5,
    },
    {
      img1: "https://i.pinimg.com/564x/5c/7f/73/5c7f73bc235d35f122becdde3a7d45f8.jpg",
      id: 6,
    },
  ];

  const slides = [
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/09/BLINKTORCHLOGO.jpg",
      alt: "Blink Torch Logo",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/10/Uuwell-logo.jpg",
      alt: "Image 2",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/09/reds-apple-brand-logo.jpg",
      alt: "Image 3",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/09/hyde-brand-logo.jpg",
      alt: "Image 4",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/09/FLUMFLOAT-brand-logo.jpg",
      alt: "Image 5",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/10/Uuwell-logo.jpg",
      alt: "Image 2",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/09/reds-apple-brand-logo.jpg",
      alt: "Image 3",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/09/BLINKTORCHLOGO.jpg",
      alt: "Blink Torch Logo",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/10/Uuwell-logo.jpg",
      alt: "Image 2",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/09/reds-apple-brand-logo.jpg",
      alt: "Image 3",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/10/Uuwell-logo.jpg",
      alt: "Image 2",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/09/reds-apple-brand-logo.jpg",
      alt: "Image 3",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/09/BLINKTORCHLOGO.jpg",
      alt: "Blink Torch Logo",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/10/Uuwell-logo.jpg",
      alt: "Image 2",
    },
    {
      src: "https://splashdistributors.com/wp-content/uploads/2021/09/reds-apple-brand-logo.jpg",
      alt: "Image 3",
    },
  ];

  const productCarouselStyle = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    prevArrow: (
      <div
        style={{
          display: "block",
          background: "black",
          color: "#d42727",
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
          color: "#d42727 !important",
          padding: "10px",
          borderRadius: "50%",
          zIndex: 1,
        }}
      >
        ▶
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const carouselStyle = {
    margin: "0 auto",
    padding: "40px",
    width: "100%",
  };

  const productCardStyle = {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px",
    textAlign: "center",
  };

  const priceStyle = {
    color: "red",
    fontWeight: "bold",
  };

  const buttonStyle = {
    display: "inline-block",
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    textDecoration: "none",
    cursor: "pointer",
  };

  const products = [
    {
      image:
        "https://splashdistributors.com/wp-content/uploads/2024/07/SMYLEDSPENS-400x400.jpg",
      title: "Product 1",
      price: "23.49",
    },
    {
      image:
        "https://splashdistributors.com/wp-content/uploads/2024/07/HANDSHAKE15KD-400x400.jpg",
      title: "Product 2",
      price: "23.49",
    },
    {
      image:
        "https://splashdistributors.com/wp-content/uploads/2024/07/POSHPLUS20KDIS-400x400.jpg",
      title: "Product 3",
      price: "74.99",
    },
    {
      image:
        "https://splashdistributors.com/wp-content/uploads/2024/07/PUFFCOPEAKKIT-400x400.jpg",
      title: "Product 4",
      price: "82.49",
    },
    {
      image:
        "https://splashdistributors.com/wp-content/uploads/2024/07/NORTHVISION15K-400x400.jpg",
      title: "Product 5",
      price: "82.49",
    },
    // Add more products as needed
  ];

  return (
    <Container className="container">
      <TopBar isSticky={isSticky} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            // padding: "20px",
          }}
        >
          <SingleStrip  />

          <CenterBanners centerBanners={centerBanners} />

          <SliderWithPosters
            gifsSliders={gifsSliders}
            gipPosters={gipPosters}
            gipPosters2={gipPosters2}
          />

          <Categories categoriesBanners={categoriesBanners} />

          <PosterWithGifs verticalgifs={verticalgifs} />

          {/* Two Sliders */}
          <div className={`${style.mainSliders} p-2`}>
            <div className={style.gifSliders}>
              <Sliders gifsSliders={gifsSliders} />
            </div>
            <div className={style.gifSliders1}>
              <Sliders gifsSliders={gifsSliders1} />
            </div>
          </div>
        </Box>
      </Box>
      {/* <div style={carouselStyle}>
        <Slider {...productCarouselStyle}>
          {products?.length > 0 &&
            products.map((product, index) => (
              <div key={index} style={productCardStyle}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{ width: "100%", height: "auto" }}
                />
                <h3>{product.title}</h3>
                <p style={priceStyle}>Splash Price: ${product.price}</p>
                <div style={buttonStyle}>Add to Cart</div>
              </div>
            ))}
        </Slider>
      </div> */}
      {token && <HomeCards data={categoryResponse5.data?.data} />}
      <Brands slides={slides} />

      <div style={{ position: "sticky", zIndex: 10 }}>
        <Footer />
      </div>

      <div>
        {isSmallScreen && <MobileStickey count={0} />}
      </div>

      <ScrollTopButton />
    </Container>
  );
}
