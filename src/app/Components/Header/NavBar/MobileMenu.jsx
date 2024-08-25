import React from "react";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import HeaderLogo from "../HeaderLogo";
import SimpleBar from "simplebar-react";
import HeaderCategory from "../HeaderCategory";

const MobileMenu = ({isRight,toggleRightCanvas}) => {
  return (
    <Offcanvas
      isOpen={isRight}
      direction="start"
      toggle={toggleRightCanvas}
      id="offcanvasRight"
      className="border-bottom"
    >
      <OffcanvasHeader
        toggle={toggleRightCanvas}
        id="offcanvasRightLabel"
        style={{
          backgroundImage:
            "url('https://splashdistributors.com/wp-content/uploads/2024/04/splash-header11.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "white", // Align the button to the right
        }}
      >
        <div className="d-flex align-items-center justify-content-between gap-5">
          <HeaderLogo />
          <button
            type="button"
            className="btn-close"
            style={{
              backgroundColor: "#00ff1c",
              filter: "invert(1)",
              borderRadius: "50%",
              padding: "0.5rem",
              marginLeft: "6rem",
            }}
            aria-label="Close"
            onClick={toggleRightCanvas}
          />
        </div>
      </OffcanvasHeader>
      <OffcanvasBody className="p-0 overflow-hidden">
        <SimpleBar style={{ height: "100vh" }}>
          <div className="acitivity-timeline p-4">
            <h1 className="text-dark">Category Banners</h1>
          </div>
        </SimpleBar>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default MobileMenu;
