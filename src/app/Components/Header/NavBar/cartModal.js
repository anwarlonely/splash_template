"use client";
import React from "react";
import Link from "next/link";
import ClearIcon from "@mui/icons-material/Clear";
import Cookies from "js-cookie";
import {
  Card,
  CardBody,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
} from "reactstrap";
import SimpleBar from "simplebar-react";

export default function CartModal({
  openCartCanvas,
  handleToggle,
  handleEmptyCart,
  decreaseQuantity,
  increaseQuantity,
  removeProduct,
  totalSubtotal,
  cartItem,
}) {
  const accountNo = Cookies.get("account_no")
    ? Number(Cookies.get("account_no"))
    : null;
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;

  const buttonClass =
    "bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold py-0 px-2 rounded-lg hover:opacity-80 transition duration-200";

  return (
    <div className="relative">
      <Offcanvas
        isOpen={openCartCanvas}
        direction="end"
        toggle={handleToggle}
        id="offcanvasRight"
        className="border-bottom"
      >
        <OffcanvasHeader toggle={handleToggle} id="offcanvasRightLabel">
          Shopping Cart
        </OffcanvasHeader>
        <OffcanvasBody className="p-0 overflow-hidden">
          <SimpleBar style={{ height: "100vh" }}>
            {cartItem?.length > 0 ? (
              <div className="acitivity-timeline p-4">
                {cartItem?.map((item, index) => (
                  <Card className="mb-2" key={item.key}>
                    <div
                      className="bookmark-icon position-absolute top-0 end-0 p-2 cursor-pointer"
                      onClick={() => removeProduct(item.key)}
                    >
                      <ClearIcon
                        className="image-close"
                        style={{ fontSize: "1.2rem", color: "red" }}
                      />
                    </div>
                    <CardBody className="p-1">
                      <div className="d-flex align-items-center gap-2">
                        <div className="col-sm-auto">
                          <div className="avatar-lg bg-light rounded p-1">
                            {item?.product_image ? (
                              <img
                                className="img-thumbnail"
                                alt="200x200"
                                width="60"
                                src={`${ImageURL}/${item.product_image}`}
                              />
                            ) : (
                              <img
                                className="img-thumbnail"
                                alt="200x200"
                                width="60"
                                src={`https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg`}
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-sm">
                          <Link
                            href={`/product/${item.product_slug}`}
                            className="text-body text-decoration-none cursor-pointer"
                          >
                            <p
                              className="text-truncate"
                              style={{
                                whiteSpace: "normal",
                                width: "90%",
                                overflow: "hidden",
                                textTransform: "ellipsis",
                                fontSize: "0.7rem",
                              }}
                            >
                              {`${item?.product_name?.substring(0, 30)}`}
                              {item.variation && item.variation.length > 0
                                ? ` - ${item.variation[0]}`
                                : ""}
                              ({item?.variation?.join(" ")})
                              {item?.is_free_product && (
                                <button className={buttonClass}>Free</button>
                              )}
                            </p>
                          </Link>

                          <div
                            className=" gap-2"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="price-cal">
                              <p
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                  color: "#d5007e",
                                  fontWeight: "bold",
                                }}
                              >
                                $
                                {(item.product_price * item.quantity)?.toFixed(
                                  2
                                )}
                                {!isNaN(accountNo) && (
                                  <span
                                    style={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      color: "rgb(179 175 175 / 30%)",
                                      fontSize: "1.2rem",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    {accountNo}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="cart-count">
                              <button
                                className="px-2.5 py-1.5 symbol-right"
                                onClick={() => decreaseQuantity(index)}
                              >
                                {!item.is_free_product && "-"}
                              </button>
                              <span
                                className="px-2.5 py-1.5"
                                style={{ fontSize: "0.8rem" }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                className="px-2.5 py-1.5 symbol-left"
                                onClick={() => increaseQuantity(index)}
                              >
                                {!item.is_free_product && "+"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="d-flex justify-content-center mt-5">
                <img
                  src="https://bexcart.com/assets/images/empty-cart.gif"
                  width={"50%"}
                />
              </div>
            )}
          </SimpleBar>
        </OffcanvasBody>
        <div className="offcanvas-foorter border p-3 text-center">
          <div className="flex flex-row justify-between text-base font-bold">
            <h6 className="fs-14 mb-0 fs-bold">Sub Total :</h6>
            <p>${totalSubtotal ? totalSubtotal.toFixed(2) : "0.00"}</p>
          </div>
          <div className="flex flex-col text-center">
            <Link
              href="/cart"
              className="cart-button mb-1 text-decoration-none"
              style={{ backgroundColor: "#f2f3f5", color: "black",borderRadius:"none" }}
            >
              VIEW CART
            </Link>
            <Link
              href="#"
              className="cart-button black text-decoration-none"
              style={{ background: "#d5007e", borderRadius: "none" }}
              onClick={handleEmptyCart}
            >
              EMPTY CART
            </Link>
          </div>
        </div>
      </Offcanvas>
    </div>
  );
}
