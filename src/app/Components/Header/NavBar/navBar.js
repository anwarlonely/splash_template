"use client";
import React, { useState, useEffect } from "react";
import SearchBar from "./searchBar";
import style from "../../../../styles/Header/header.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CartModal from "./cartModal";
import LogoutModal from "./logoutModal";
import LoginModal from "./loginModal";
import Cookies from "js-cookie";
import {
  useGetLogoDataQuery,
  useGetVerifyAgeModalDataQuery,
} from "@/redux/features/product/productApi";
import { Col, Input } from "reactstrap";

export default function NavBar({ setSearcVal, isSticky }) {
  const router = useRouter();
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const ADURL = process.env.NEXT_PUBLIC_AD_URL;
  const imageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [token, setToken] = useState(null);
  const username = Cookies.get("username") || null;
  const [showModal, setShowModal] = useState(false);
  const [logoData, setLogoData] = useState([]);
  const [verifyAgeModalData, setVerifyAgeModalData] = useState([]);

  const logoResponse = useGetLogoDataQuery();
  const verifyAgeModalDataResponse = useGetVerifyAgeModalDataQuery();
  const [backgroundImage, setBackgroundImage] = useState(
    `${imageURL}/2024/04/Pop_Up_-01-min-scaled-1.jpg`
  );

  useEffect(() => {
    const updateBackgroundImage = () => {
      if (window.innerWidth <= 768) {
        // Adjust the max-width as needed
        setBackgroundImage(
          `${imageURL}/2024/05/WhatsApp-Image-2024-05-08-at-18.25.35.jpeg`
        );
      } else {
        setBackgroundImage(`${imageURL}/2024/04/Pop_Up_-01-min-scaled-1.jpg`);
      }
    };

    window.addEventListener("resize", updateBackgroundImage);
    updateBackgroundImage(); // Call initially to set the correct image on load

    return () => window.removeEventListener("resize", updateBackgroundImage);
  }, [imageURL]);

  useEffect(() => {
    const tokenFromStorage = Cookies.get("token");
    setToken(tokenFromStorage);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (logoResponse?.isSuccess) {
      const isPublicData = () => {
        if (token && logoResponse) {
          return logoResponse?.data?.filter(
            (item) =>
              item?.status === 1 &&
              (item?.visibility === "public" ||
                item?.visibility === "protected")
          );
        } else if (logoResponse) {
          return logoResponse?.data?.filter(
            (item) => item?.status === 1 && item?.visibility === "public"
          );
        } else {
          return [];
        }
      };

      const finalFilteredData = isPublicData();
      setLogoData(
        finalFilteredData
          ?.filter((item) => item?.position === "logoImage")
          ?.sort((a, b) => a?.serial - b?.serial)
      );
    }
  }, [logoResponse, token]);

  useEffect(() => {
    if (verifyAgeModalDataResponse?.isSuccess) {
      const isPublicData = () => {
        if (token && verifyAgeModalDataResponse) {
          return verifyAgeModalDataResponse?.data?.filter(
            (item) =>
              item?.status === 1 &&
              (item?.visibility === "public" ||
                item?.visibility === "protected")
          );
        } else if (verifyAgeModalDataResponse) {
          return verifyAgeModalDataResponse?.data?.filter(
            (item) => item?.status === 1 && item?.visibility === "public"
          );
        } else {
          return [];
        }
      };

      const finalFilteredData = isPublicData();
      setVerifyAgeModalData(
        finalFilteredData
          ?.filter((item) => item?.position === "productImage")
          ?.sort((a, b) => a?.serial - b?.serial)
      );
    }
  }, [verifyAgeModalDataResponse, token]);

  useEffect(() => {
    const visitedBefore = sessionStorage.getItem("visitedBefore");
    if (!visitedBefore) {
      setShowModal(true);
    }
  }, []);

  const toggleAgeModal = () => {
    sessionStorage.setItem("visitedBefore", "true");
    setShowModal(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [openLogin, setOpenLogin] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);

  const handleOpen = () => {
    if (token) {
      setOpenLogout(true);
    } else {
      router.push("/myaccount?tab=login");
    }
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleCloseLogout = () => {
    setOpenLogout(false);
  };

  return (
    <div
      className={
        isSticky
          ? "navbar-section  flex flex-row items-center justify-between"
          : "navbar-section py-5 flex flex-row items-center justify-between"
      }
      style={{
        backgroundImage:
          "url('https://splashdistributors.com/wp-content/uploads/2024/04/splash-header11.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        position: isSticky ? "fixed" : "",
        zIndex: isSticky ? "100" : "",
      }}
    >
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 cursor-wait age-modal-bg"
            style={{
              backgroundImage: `url(${imageURL}/2024/04/Pop_Up_-01-min-scaled-1.jpg)`,
            }}
          ></div>
          {verifyAgeModalData?.map((item, index) => (
            <div
              className="age-modal relative bg-white z-10 rounded-lg shadow-lg w-11/12 sm:w-96 p-6 m-4"
              key={index}
              style={{ backgroundImage: `url(${backgroundImage})` }}
            >
              <Link href={item.link}>
                <img
                  src={`${backendURL}/storage/${item.url}`}
                  alt="age-modal-gif"
                  className="w-full h-auto object-cover rounded-t-lg age-modal-gif"
                />
              </Link>
              <div className="flex flex-col sm:flex-row gap-6 mt-4 buttons">
                <button
                  className="yes-button w-full sm:w-auto"
                  onClick={toggleAgeModal}
                >
                  YES
                </button>
                <Link
                  href="https://www.google.com/search?q=american+distributors+llc&sca_esv=32726a2924a7740e&sxsrf=ADLYWIKu_YYEQoKlji6JueUrH0jwXMdS_A%3A1720247267664&source=hp&ei=4-OIZuXcJqSnseMP58qvuA4&iflsig=AL9hbdgAAAAAZojx8zEOZAlp8D7gJX3DnbAGWtGUvzEo&gs_ssp=eJwFwUsKgCAUAEDaBh2gnZvW-vDvEbqF3xDMQA2k0zezbvjCAImOz-tayWIOMpUiydGQQOsQA2hDpmA8MieoFABWcjh3e8eWva0o5D5adu94Wkel-B_A3xkT&oq=american+dis&gs_lp=Egdnd3Mtd2l6IgxhbWVyaWNhbiBkaXMqAggAMgsQLhiABBjHARivATIIEAAYgAQYsQMyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgsQLhiABBjHARivATIFEAAYgAQyBRAuGIAEMgUQABiABEjYPlCNA1j6KnABeACQAQKYAbIGoAHyIKoBDTAuMi4yLjMuMi4xLjG4AQHIAQD4AQGYAgqgArcXqAIKwgIHECMYJxjqAsICEBAAGAMY5QIY6gIYjAMYjwHCAhAQLhgDGOUCGOoCGIwDGI8BwgIREC4YgAQYsQMY0QMYgwEYxwHCAg4QABiABBixAxiDARiKBcICCxAuGIAEGNEDGMcBwgILEAAYgAQYsQMYgwHCAggQLhiABBixA8ICExAuGIAEGLEDGNEDGIMBGMcBGArCAg4QLhiABBixAxiDARjUAsICCxAAGIAEGLEDGIoFwgIOEC4YgAQYsQMY0QMYxwGYAwaSBwsxLjIuMi4zLjEuMaAHzKUB&sclient=gws-wiz"
                  className="no-button w-full sm:w-auto text-center"
                >
                  NO
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {logoData?.map((item, index) => (
        <div key={index}>
          <Link href={item.link}>
            <img
              src={
                "https://splashdistributors.com/wp-content/uploads/2023/11/splash-newlogo.png"
              }
              alt="logo"
              style={{ height: "101px", position: "relative", left: "30px" }}
            ></img>
          </Link>
        </div>
      ))}
      <div className="flex flex-row gap-3 items-center navbar-section-left h-auto">
        {/* <SearchBar setSearcVal={setSearcVal} /> */}
        <Col lg={6}>
          <div>
            <div className={`input-group ${style.inputCustomStyle}`}>
              <Input
                type="text"
                style={{ padding: "14px 190px 14px 10px ", }}
                className={style.inputCustomStyle1}
                placeholder="Search the product..."
              />
              <span
                className={`input-group-text ${style.inputCustomStyle2}`}
                id="basic-addon2"
                style={{ backgroundColor: "#D5007E" }}
              >
                Sign up
              </span>
            </div>
          </div>
        </Col>
        <div
          className="flex flex-row gap-2 cursor-pointer"
          onClick={toggleModal}
        >
          <WhatsAppIcon
            style={{ color: "white", fontSize: "2.4rem" }}
            className="icons"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs text-white span-text">Click Here</span>
            <span className="text-sm font-semibold text-white text-nowrap span-text">
              Join Our Community
            </span>
          </div>
        </div>

        {isModalOpen && (
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
              <img
                src={`${imageURL}/2024/04/WhatsApp-Image-2024-04-10-at-13.06.29.jpeg`}
                alt="scan-image"
                style={{ width: "44.7rem", height: "auto" }}
              />
            </div>
          </div>
        )}
        <Link href={`/wishlist`} className="flex flex-row gap-2">
          <FavoriteBorderIcon
            style={{ color: "white", fontSize: "2.4rem" }}
            className="icons"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs text-white span-text">Favorites</span>
            <span className="text-lg font-semibold text-white span-text">
              Wishlist
            </span>
          </div>
        </Link>
        <div className="flex flex-row gap-2 cursor-pointer">
          <Link href={`/myaccount`} className="flex flex-row gap-2">
            <PersonOutlineOutlinedIcon
              style={{
                color: "white",
                fontSize: "2.4rem",
                // border: "2px solid red",
              }}
              className="icons"
            />
          </Link>
          <div
            onClick={handleOpen}
            className="flex flex-row gap-2 cursor-pointer"
          >
            <div className="flex flex-col text-left">
              <span className="text-xs text-white span-text">Welcome</span>
              {mounted && token && username ? (
                <span className="text-lg font-semibold text-white span-text">
                  {username}
                </span>
              ) : (
                <span className="text-lg font-semibold text-white span-text">
                  Login/Register
                </span>
              )}
            </div>
          </div>
          <LoginModal open={openLogin} handleClose={handleCloseLogin} />
          <LogoutModal open={openLogout} handleClose={handleCloseLogout} />
        </div>
        <div className="vertical-line" />
        <CartModal />
      </div>
    </div>
  );
}
