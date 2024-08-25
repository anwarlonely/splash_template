import React from "react";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";
import SimpleBar from "simplebar-react";
import HeaderLogo from "../HeaderLogo";
import SplashSearch from "./SplashSearch";

const MobileSearchCanvas = ({
  openSearchCanvas,
  setOpenSearchCanvas,
  setValue,
  count,
}) => {
  const handleToggle = () => {
    setOpenSearchCanvas(!openSearchCanvas);
    setValue(count);
  };
  return (
    <div className="relative">
      <Offcanvas
        isOpen={openSearchCanvas}
        direction="end"
        toggle={handleToggle}
        id="offcanvasRight"
        className="border-bottom"
      >
        <OffcanvasHeader
          toggle={handleToggle}
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
          <HeaderLogo/>
          <button
            type="button"
            className="btn-close"
            style={{
              backgroundColor: "#00ff1c",
              filter: "invert(1)", 
              borderRadius: "50%", 
              padding: "0.5rem", 
              marginLeft : "6rem"
            }}
            aria-label="Close"
            onClick={handleToggle}
          />
            
          </div>
        </OffcanvasHeader>

        <OffcanvasBody className="p-0 overflow-hidden">
          <SimpleBar style={{ height: "100vh" }}>
            <div className="acitivity-timeline p-4">
                <SplashSearch/>
            </div>
          </SimpleBar>
        </OffcanvasBody>
      </Offcanvas>
    </div>
  );
};

export default MobileSearchCanvas;
