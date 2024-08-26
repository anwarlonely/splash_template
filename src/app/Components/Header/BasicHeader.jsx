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
            "url('data:image/jpeg;base64,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')",
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
        {/* {!isSmallScreen && !isSticky && (
          <Row style={{ color: "white" }}>
            <HeaderCategory />
          </Row>
        )} */}
      </div>
    </>
  );
};

export default BasicHeader;
