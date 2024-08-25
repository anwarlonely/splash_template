
"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TopBar from "../Components/Header/topBar";
import SideNav from "../Components/SideNav/sideNav";
import Footer from "../Components/Footer/footer";
import { Container, Box } from "@mui/material";
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import "../../styles/styles.scss";
import axios from "axios";
import Cookies from "js-cookie";
import { Button } from "react-bootstrap";
import Order from "./Order";
import Address from "./Address";
import Wishlists from "./Wishlists";
import {
  useGetAddressQuery,
  useGetUserOrdersQuery,
} from "@/redux/features/product/productApi";
import Login from "./SubLogin";
import RegisterForm from "./RegisterForm";
import DashBoard from "./DashBoard";
import ScrollTopButton from "../Components/scrollToTop";
import MobileStickey from "../Components/Header/NavBar/MobileStickeyNav";

function MyAccountContent() {
  const searchParams = useSearchParams();
  const orderData = useGetUserOrdersQuery();
  const addressData = useGetAddressQuery();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const tabValue = searchParams.get("tab") || "dashboard";

  const router = useRouter();
  const { query } = router;

  const token = Cookies.get("token") || null;
  const [customverticalTab, setcustomverticalTab] = useState(
    token ? tabValue : "login"
  );

  useEffect(() => {
    if (query?.tab && query.tab !== customverticalTab) {
      setcustomverticalTab(query.tab);
    }
  }, [query?.tab]);

  const handleTabChange = (tab) => {
    router.push(`/myaccount?tab=${tab}`, undefined, { shallow: true });
    setcustomverticalTab(tab);
  };

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogout = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      await axios.post(`${backendURL}/api/logout`, {}, { headers });
      Cookies.remove("token");
      Cookies.remove("username");
      Cookies.remove("user_id");
      Cookies.remove("expirationTime");
      router.push("/myaccount?tab=login");
      setcustomverticalTab("login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1224 && !isSmallScreen) {
        setIsSmallScreen(true);
      }else{
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

  return (
    <Container className="container">
      <TopBar />
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <SideNav />
        <Row xxl={12} className="p-2 m-2">
          <div className="w-100">
            <h6 className="mb-3">MY ACCOUNT</h6>
            <div className="p-2"></div>

            <div>
              <Row>
                <Col lg={2}>
                  <Nav
                    pills
                    className="nav nav-pills flex-column nav-pills-tab custom-verti-nav-pills text-center"
                  >
                    {token ? (
                      <>
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" ,  backgroundColor: customverticalTab === "dashboard" ? "#D5007E" : "",}}
                            className={classnames({
                              "mb-2": true,
                              active: customverticalTab === "dashboard",
                            })}
                            onClick={() => handleTabChange("dashboard")}
                            id="custom-v-pills-home-tab"
                          >
                            <i className="ri-home-4-line d-block fs-20 mb-1"></i>
                            Dashboard
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" ,   backgroundColor: customverticalTab === "Orders" ? "#D5007E" : "",}}
                            className={classnames({
                              "mb-2": true,
                              active: customverticalTab === "Orders",
                            })}
                            onClick={() => handleTabChange("Orders")}
                            id="custom-v-pills-profile-tab"
                          >
                            <i className="ri-user-2-line d-block fs-20 mb-1"></i>
                            Orders
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                             style={{ cursor: "pointer" ,   backgroundColor: customverticalTab === "address" ? "#D5007E" : "",}}
                            className={classnames({
                              "mb-2": true,
                              active: customverticalTab === "address",
                            })}
                            onClick={() => handleTabChange("address")}
                            id="custom-v-pills-messages-tab"
                          >
                            <i className="ri-mail-line d-block fs-20 mb-1"></i>
                            Address
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" ,   backgroundColor: customverticalTab === "wishlist" ? "#D5007E" : "",}}
                            className={classnames({
                              "mb-2": true,
                              active: customverticalTab === "wishlist",
                            })}
                            onClick={() => handleTabChange("wishlist")}
                          >
                            <i className="ri-mail-line d-block fs-20 mb-1"></i>
                            Wishlist
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <Button variant="danger" onClick={handleLogout}>
                            Logout
                          </Button>
                        </NavItem>
                      </>
                    ) : (
                      <>
                        <NavItem>
                          <NavLink
                             style={{ cursor: "pointer" ,   backgroundColor: customverticalTab === "login" ? "#D5007E" : "",}}
                            className={classnames({
                              "mb-2": true,
                              active: customverticalTab === "login",
                            })}
                            onClick={() => handleTabChange("login")}
                          >
                            <i className="ri-mail-line d-block fs-20 mb-1"></i>
                            Login
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                             style={{ cursor: "pointer" ,   backgroundColor: customverticalTab === "registerform" ? "#D5007E" : "",}}
                            className={classnames({
                              "mb-2": true,
                              active: customverticalTab === "registerform",
                            })}
                            onClick={() => handleTabChange("registerform")}
                          >
                            <i className="ri-mail-line d-block fs-20 mb-1"></i>
                            Registration
                          </NavLink>
                        </NavItem>
                      </>
                    )}
                  </Nav>
                </Col>
                <Col lg={10}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <TabContent
                      activeTab={customverticalTab}
                      className="text-muted mt-3 mt-lg-0"
                    >
                      <TabPane tabId="dashboard" id="custom-v-pills-home">
                        <div className="d-flex mb-4">
                          <div className="flex-grow-1 ms-3">
                            <DashBoard />
                          </div>
                        </div>
                      </TabPane>
                      <TabPane tabId="Orders" id="custom-v-pills-profile">
                        <div className="d-flex mb-4">
                          <div className="flex-grow-1 ms-3">
                            <Order />
                          </div>
                        </div>
                      </TabPane>
                      <TabPane tabId="address" id="custom-v-pills-messages">
                        <div className="d-flex mb-4">
                          <div className="flex-grow-1 ms-3">
                            <Address addressData={addressData} />
                          </div>
                        </div>
                      </TabPane>
                      <TabPane tabId="wishlist">
                        <div className="d-flex mb-4">
                          <div className="flex-grow-1 ms-3">
                            <Wishlists />
                          </div>
                        </div>
                      </TabPane>
                      <TabPane tabId="login">
                        <div className="d-flex mb-4">
                          <div className="flex-grow-1">
                            <Login token={token} />
                          </div>
                        </div>
                      </TabPane>
                      <TabPane tabId="registerform">
                        <div className="d-flex mb-4">
                          <div className="flex-grow-1">
                            <RegisterForm />
                          </div>
                        </div>
                      </TabPane>
                    </TabContent>
                  </Suspense>
                </Col>
              </Row>
            </div>
          </div>
        </Row>
      </Box>
      <Footer />
      <div>
        {isSmallScreen && <MobileStickey count={2} />}
      </div>
      <ScrollTopButton />
    </Container>
  );
}

export default function MyAccount() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyAccountContent />
    </Suspense>
  );
}
