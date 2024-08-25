import React from "react";
import Link from "next/link";
import { Col, Container, Input, Row } from "reactstrap";
import style from "../../../styles/footer/footer.module.css";

const Footer = () => {
  return (
    <React.Fragment>
      <div className={`py-5  position-relative ${style.firstDiv}`}>
        <div className={style.contentDiv}>
          <div className={style.textcommonStyleFirst}>
            <p className={style.signUp}>Sign Up For Newsletters</p>
            <p className={style.getEmailText}>
              Get E-mail updates about our latest shop and{" "}
              <span className={style.texthover}>special offers.</span>{" "}
            </p>
          </div>
          <div>
            <div className={`input-group ${style.inputCustomStyle}`}>
              <Input
                type="text"
                style={{ padding: "14px 190px 14px 5px " }}
                className={style.inputCustomStyle1}
                placeholder="Your email address"
              />
              <span
                className={`input-group-text ${style.inputCustomStyle1}`}
                id="basic-addon2"
                style={{ backgroundColor: "#009ee3" }}
              >
                Sign up
              </span>
            </div>
          </div>
        </div>
      </div>
      <footer
        className="custom-footer  position-relative"
        style={{
          backgroundImage:
            "url('https://splashdistributors.com/wp-content/uploads/2024/04/splash-header11.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className={`py-5  position-relative `}>
          <div className={style.contentDiv2}>
            <div className="p-0">
              <p className={style.textcommonFontStyle}>About Us</p>
              <p className={style.textcommonFontStyle1}>
                Splash Distributors is your one-stop wholesale shop that offers
                the greatest and latest products in matters of all wholesale
                vape and smoke supplies.
              </p>
            </div>
            <div className="p-0 mt-2">
              <p className={`mt-1 ${style.textcommonFontStyle}`}>
                PAYMENT & SHIPPING
              </p>
              <p className={style.textcommonFontStyle1}>
                <span>
                  <Link href="#" className={style.commonHyperLinkStyle}>
                    Shipping Policy
                  </Link>
                </span>
                <br />
                <span>
                  <Link href="#" className={style.commonHyperLinkStyle}>
                    Privacy Policy
                  </Link>
                </span>
                <br />
                <span>
                  <Link href="#" className={style.commonHyperLinkStyle}>
                    Order Tracking
                  </Link>
                </span>
                <br />
                <span>
                  <Link href="#" className={style.commonHyperLinkStyle}>
                    Faq's
                  </Link>
                </span>
                <br />
                <span>
                  <Link href="#" className={style.commonHyperLinkStyle}>
                    Terms & Conditions
                  </Link>
                </span>
                <br />
              </p>
            </div>
            <div className="p-0 mt-2">
              <p className={`mt-1 ${style.textcommonFontStyle}`}>
                Popular Categories
              </p>
              <p className={style.textcommonFontStyle1}>
                <span>
                  <Link href="#" className={style.commonHyperLinkStyle}>
                    E-Liquids
                  </Link>
                </span>
                <br />
                <span>
                  <Link href="#" className={style.commonHyperLinkStyle}>
                    Salt Nic
                  </Link>
                </span>
                <br />
                <span>
                  <Link href="#" className={style.commonHyperLinkStyle}>
                    Disposable
                  </Link>
                </span>
                <br />
                <span>
                  <Link href="#" className={style.commonHyperLinkStyle}>
                    Vaporizers
                  </Link>
                </span>
                <br />
                <span>
                  <Link href="#" className={style.commonHyperLinkStyle}>
                    Batteries
                  </Link>
                </span>
                <br />
              </p>
            </div>
            <div className="p-0">
              <p className={style.textcommonFontStyle}>Our Location</p>
              <p className={style.textcommonFontStyle1}>
                400 W.Bell Court, Unit 200, Oak creek WI <br /> Phone: (414)
                928-6959
                <br /> Fax: (888) 208-6667 <br /> Email:
                splashdistrollc@gmail.com
                <p></p>
              </p>
            </div>
          </div>
        </div>
      </footer>
      <div className={`py-2  position-relative ${style.contentDiv3}`}>
        <p className={style.copywrite}>© 2020 Splash Distributors</p>
        <p/>
        <img  className={`img-fluid ${style.imageStyle}`} src="https://ecom-dev.phantasm.digital/_next/image?url=https%3A%2F%2Fad-fe-web-landing-page.s3.us-east-2.amazonaws.com%2FfooterImage.png&w=640&q=75" />
      </div>
    </React.Fragment>
  );
};

export default Footer;
