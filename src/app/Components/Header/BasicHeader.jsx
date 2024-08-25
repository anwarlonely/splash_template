// import { Col, Row } from "reactstrap";
// import HeaderLogo from "./HeaderLogo";
// import HeaderSearchBar from "./HeaderSearchBar";
// import RightSideHeader from "./RightSideHeader";
// import HeaderCategory from "./HeaderCategory";
// import React, { useEffect, useState } from "react";
// import MenuIcon from "@mui/icons-material/Menu";
// import MobileCart from "./NavBar/MobileCart";
// import MobileMenu from "./NavBar/MobileMenu";
// import HeaderTopBar from "./HeaderTopBar";

// const BasicHeader = ({setSearcVal}) => {
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const [isMediumScreen, setIsMediumScreen] = useState(false);
//   const [isRight, setIsRight] = useState(false);
//   const toggleRightCanvas = () => {
//     setIsRight(!isRight);
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 1325 && !isSmallScreen) {
//         setIsSmallScreen(true);
//         setIsMediumScreen(false);
//       } else if (
//         window.innerWidth <= 1640 &&
//         window.innerWidth > 1325 &&
//         !isMediumScreen
//       ) {
//         setIsMediumScreen(true);
//         setIsSmallScreen(false);
//       } else if (window.innerWidth >= 800) {
//         setIsMediumScreen(false);
//         setIsSmallScreen(false);
//       } else {
//         setIsSmallScreen(false);
//         setIsMediumScreen(false);
//       }
//     };

//     handleResize();

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <>
//       {isSmallScreen && <HeaderTopBar />}
//       <div
//         className="top-nav top-header sticky-header p-4"
//         style={{
//           backgroundImage:
//             "url('https://splashdistributors.com/wp-content/uploads/2024/04/splash-header11.png')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         {isSmallScreen ? (
//           <Row className="navbar-top d-flex align-items-center text-light">
//             <Col xs={2}>
//               <MenuIcon size={24} onClick={toggleRightCanvas} />
//               <MobileMenu
//                 isRight={isRight}
//                 toggleRightCanvas={toggleRightCanvas}
//               />
//             </Col>
//             <Col
//               xs={8}
//               className="text-center d-flex justify-content-center m-auto"
//             >
//               <HeaderLogo />
//             </Col>
//             <Col xs={2} className="text-right">
//               <MobileCart />
//             </Col>
//           </Row>
//         ) : (
//           <Row>
//             <Col xs="12">
//               {isMediumScreen ? (
//                 <Row className="navbar-top d-flex  align-items-center text-light">
//                   <Col lg={2}>
//                     <HeaderLogo />
//                   </Col>
//                   <Col lg={5}>
//                     <HeaderSearchBar setSearcVal={setSearcVal} />
//                   </Col>
//                   <Col lg={5}>
//                     <RightSideHeader />
//                   </Col>
//                 </Row>
//               ) : (
//                 <Row className="navbar-top d-flex  align-items-center text-light">
//                   <Col lg={2}>
//                     <HeaderLogo />
//                   </Col>
//                   <Col lg={6}>
//                     <HeaderSearchBar setSearcVal={setSearcVal}/>
//                   </Col>
//                   <Col lg={4}>
//                     <RightSideHeader />
//                   </Col>
//                 </Row>
//               )}
//             </Col>
//           </Row>
//         )}
//         {isSmallScreen ? (
//           ""
//         ) : (
//           <Row style={{ color: "white" }}>
//             <HeaderCategory />
//           </Row>
//         )}
//       </div>
//     </>
//   );
// };

// export default BasicHeader;

import { Col, Row } from "reactstrap";
import HeaderLogo from "./HeaderLogo";
import HeaderSearchBar from "./HeaderSearchBar";
import RightSideHeader from "./RightSideHeader";
import HeaderCategory from "./HeaderCategory";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MobileCart from "./NavBar/MobileCart";
import MobileMenu from "./NavBar/MobileMenu";
import HeaderTopBar from "./HeaderTopBar";

const BasicHeader = ({ setSearcVal }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const toggleRightCanvas = () => {
    setIsRight(!isRight);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1325 && !isSmallScreen) {
        setIsSmallScreen(true);
        setIsMediumScreen(false);
      } else if (
        window.innerWidth <= 1640 &&
        window.innerWidth > 1325 &&
        !isMediumScreen
      ) {
        setIsMediumScreen(true);
        setIsSmallScreen(false);
      } else if (window.innerWidth >= 800) {
        setIsMediumScreen(false);
        setIsSmallScreen(false);
      } else {
        setIsSmallScreen(false);
        setIsMediumScreen(false);
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isSticky) {
      const styleSheet = document.styleSheets[0];
      if (
        !Array.from(styleSheet.cssRules).some(
          (rule) => rule.name === "slideDown"
        )
      ) {
        styleSheet.insertRule(
          `
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `,
          styleSheet.cssRules.length
        );
      }
    }
  }, [isSticky]);

  // Inline styles for sticky header
  const stickyHeaderStyle = isSticky
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        transition: "background-color 0.5s ease-in-out",
        animation: "slideDown 0.5s ease-in-out",
      }
    : {
        position: "relative",
        transition: "background-color 0.5s ease-in-out",
      };

  return (
    <>
      {isSmallScreen && <HeaderTopBar />}
      <div
        className={`top-nav top-header ${isSticky ? "p-3" : "p-4"}`}
        style={{
          ...stickyHeaderStyle,
          backgroundImage:
            "url('https://splashdistributors.com/wp-content/uploads/2024/04/splash-header11.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {isSmallScreen ? (
          <Row className="navbar-top d-flex align-items-center text-light">
            <Col xs={2}>
              <MenuIcon size={24} onClick={toggleRightCanvas} />
              <MobileMenu
                isRight={isRight}
                toggleRightCanvas={toggleRightCanvas}
              />
            </Col>
            <Col
              xs={8}
              className="text-center d-flex justify-content-center m-auto"
            >
              <HeaderLogo />
            </Col>
            <Col xs={2} className="text-right">
              <MobileCart />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs="12">
              {isMediumScreen ? (
                <Row className="navbar-top d-flex align-items-center text-light">
                  <Col lg={2}>
                    <HeaderLogo />
                  </Col>
                  <Col lg={5}>
                    <HeaderSearchBar setSearcVal={setSearcVal} />
                  </Col>
                  <Col lg={5}>
                    <RightSideHeader />
                  </Col>
                </Row>
              ) : (
                <Row className="navbar-top d-flex align-items-center text-light">
                  <Col lg={2}>
                    <HeaderLogo />
                  </Col>
                  <Col lg={6}>
                    <HeaderSearchBar setSearcVal={setSearcVal} />
                  </Col>
                  <Col lg={4}>
                    <RightSideHeader />
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        )}
        {!isSmallScreen && !isSticky && (
          <Row style={{ color: "white" }}>
            <HeaderCategory />
          </Row>
        )}
      </div>
    </>
  );
};

export default BasicHeader;
