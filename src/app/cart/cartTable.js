import React, { useState, useEffect } from "react";
import CartDetailsTabel from "./cartDetailsTabel";
import "../../styles/styles.scss";
import ClearIcon from "@mui/icons-material/Clear";
import Link from "next/link";
import Cookies from "js-cookie";
import style from "../../styles/cartTable.module.css";
import { Button, Col, Table } from "react-bootstrap";
import {
  useEmptyCartMutation,
  useGetUpdateCartMutation,
  useGetUpdateCertItemsMutation,
  useRemoveCartItemMutation,
  useUpdateCartQuantityMutation,
} from "@/redux/features/product/productApi";
import { set_cartdata } from "@/redux/features/product/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { notifyError, notifySuccess } from "@/Utils/toast";
import Swal from "sweetalert2";
import applyRules from "@/Utils/cartRule";
import { Card, CardBody, Input } from "reactstrap";

const CartTable = ({
  setStep,
  step,
  userData,
  cartList,
  sideList,
  handleUpdateListWithTax,
  shippingAddres,
  isVape,
  stateTax,
  rules,
}) => {
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  const [cartsItemData, setCartItemData] = useState([]);
  const [updatedCartItems, setUpdatedCartItems] = useState([]);

  const [removeCartItem, {}] = useRemoveCartItemMutation();
  const [updateCartList, {}] = useGetUpdateCartMutation();
  const [updateCartItems, {}] = useGetUpdateCertItemsMutation();
  const [updateCartQty, {}] = useUpdateCartQuantityMutation();
  const [emptyCart, {}] = useEmptyCartMutation();

  const defaultAddress = useSelector(
    (store) => store?.product?.default_address
  );

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const accountNo = isClient
    ? Cookies.get("account_no")
      ? Number(Cookies.get("account_no"))
      : null
    : null;
  // console.log('cartsItemData',cartsItemData)

  useEffect(() => {
    if (cartList?.length > 0) {
      setCartItemData(cartList);
    } else {
      setCartItemData([]);
    }
  }, [cartList]);

  const handleCouponCodeChange = (event) => {
    setCouponCode(event.target.value);
  };

  const handleApplyEmptyCart = () => {
    emptyCart().then((res) => {
      if (res?.data?.status) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: `${res?.data?.message}`,
        });
        updateCartList(userId).then((response) => {
          if (response?.data?.status) {
            dispatch(set_cartdata(response?.data));
            setCartItemData([]);
          } else {
            dispatch(set_cartdata(response?.data));
            setCartItemData([]);
          }
        });
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: `${res?.error}`,
        });
      }
    });
  };

  const applyCoupon = async () => {};

  const removeProduct = async (itemIndex) => {
    removeCartItem(itemIndex).then((res) => {
      if (res?.data?.status) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title: `${res?.data?.success}`,
        });
        updateCartList(userId).then((response) => {
          if (response?.data?.status) {
            dispatch(set_cartdata(response?.data));
          } else {
            dispatch(set_cartdata(response?.data));
            setCartItemData([]);
          }
        });
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: `${res?.error}`,
        });
      }
    });
  };

  const decreaseQuantity = async (itemIndex) => {
    const cartItems = [...cartsItemData];
    const updatedItem = { ...cartItems[itemIndex] };
    if (updatedItem.quantity > 1) {
      updatedItem.quantity -= 1;
      cartItems[itemIndex] = updatedItem;
      setCartItemData(cartItems);
      const productWithRules = applyRules(cartItems, rules);
      handleUpdateListWithTax(productWithRules, defaultAddress?.state);
      await updateQuantityOnServer(updatedItem);
    } else {
      notifyError("Cannot increase quantity beyond available stock");
    }
  };

  const increaseQuantity = async (itemIndex) => {
    const cartItems = [...cartsItemData];
    const updatedItem = { ...cartItems[itemIndex] };

    if (
      updatedItem.max_quantity_var &&
      updatedItem.quantity >= updatedItem.max_quantity_var
    ) {
      Swal.fire({
        icon: "error",
        title: "Limit Exceeded",
        text: `Each store can purchase a maximum of ${updatedItem.max_quantity_var}`,
      });
      return;
    }

    if (updatedItem.quantity < updatedItem.stock) {
      updatedItem.quantity += 1;
      cartItems[itemIndex] = updatedItem;
      setCartItemData(cartItems);

      const productWithRules = applyRules(cartItems, rules);
      handleUpdateListWithTax(productWithRules, defaultAddress?.state);

      await updateQuantityOnServer(updatedItem);
    } else {
      Swal.fire({
        icon: "error",
        title: "Out of Stock",
        text: "Cannot increase quantity beyond available stock",
      });
    }
  };

  const updateQuantityOnServer = async (updatedItem) => {
    const data = {
      product_id: updatedItem.product_id,
      quantity: updatedItem.quantity,
      variation_id: updatedItem.variation_id,
    };
    updateCartQty(data);
  };

  useEffect(() => {
    if (cartsItemData?.length > 0) {
      const newUpdatedCartItem = cartsItemData?.map((item) => ({
        ...item,
        product_id: item?.product_id,
        variation_id: item?.variation_id,
        quantity: item?.quantity,
      }));
      setUpdatedCartItems(newUpdatedCartItem);
    }
  }, [cartsItemData]);

  const handleUpdateCartItems = () => {
    updateCartItems({ items: updatedCartItems }).then((res) => {
      if (res?.data?.status === true) {
        alert(res?.data?.success);
        notifySuccess(res?.data?.success);
      }
    });
  };

  const calculateSubtotalAmount = (quantity, produc_price) => {
    return quantity * produc_price;
  };

  const buttonClass =
    "bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold py-0 px-2 rounded-lg hover:opacity-80 transition duration-200";

  return (
    <>
      {cartsItemData?.length > 0 ? (
        <div
          className="  d-flex flex-wrap "
          style={{ width: "100%", height: "auto" }}
        >
          <Col lg={8} md={12} xs={12}>
            <div
              className="email-content table-responsive me-4 table-container"
              style={{ maxHeight: "700px", overflowY: "auto" }}
            >
              {/* Your content here */}
              <style jsx>{`
                .email-content::-webkit-scrollbar {
                  width: 5px;
                }

                .email-content::-webkit-scrollbar-track {
                  background: #f1f1f1;
                }

                .email-content::-webkit-scrollbar-thumb {
                  background: #888;
                  border-radius: 10px;
                }

                .email-content::-webkit-scrollbar-thumb:hover {
                  background: #555;
                }

                @media (max-width: 430px) {
                  .table-container {
                    display: none;
                  }
                  .small-screen-message {
                    display: block;
                  }
                }

                @media (min-width: 431px) {
                  .small-screen-message {
                    display: none;
                  }
                }
              `}</style>

              <Table
                responsive="sm"
                className="align-middle table-nowrap mb-0 p-4 responsive-table"
              >
                <thead
                  className="table-light"
                  style={{
                    borderBottom: "1px solid #DCDEE2",
                    padding: "10px",
                    position: "sticky",
                    top: "0",
                    zIndex: "1",
                    backgroundColor: "white",
                  }}
                >
                  <tr style={{ fontSize: "14px" }}>
                    <th scope="col">IMAGE</th>
                    <th scope="col">PRODUCT</th>
                    <th scope="col">PRICE</th>
                    <th scope="col">STOCK</th>
                    <th scope="col">QUANTITY</th>
                    <th scope="col">SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody className="mt-1">
                  {cartsItemData?.map((product, index) => (
                    <tr
                      key={product.key}
                      style={{
                        borderBottom: "1px solid #DCDEE2",
                        padding: "20px 10px",
                      }}
                    >
                      <td
                        style={{ padding: "20px 10px", position: "relative" }}
                      >
                        <div
                          className="cart-page-image-close-bg cursor-pointer"
                          onClick={() => removeProduct(product.key)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            left: "5px",
                          }}
                        >
                          <ClearIcon className="image-close" />
                        </div>
                        <Link
                          href={`/product/${product.product_slug}`}
                          className="relative top-0 right-0 cursor-pointer"
                        >
                          {product?.product_image ? (
                            <img
                              className="img-thumbnail"
                              alt="200x200"
                              width="80"
                              src={`${ImageURL}/${product.product_image}`}
                            />
                          ) : (
                            <img
                              className="img-thumbnail"
                              alt="200x200"
                              width="80"
                              src={`https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg`}
                            />
                          )}
                        </Link>
                      </td>

                      <td className="text-success">
                        <Link
                          href={`/product/${product.product_slug}`}
                          className={`relative top-0 right-0 cursor-pointer ${style.linkText}`}
                          style={{
                            display: "block", // Make the link element behave like a block
                            width: "80%", // Ensure it takes the full width of the container
                            whiteSpace: "normal", // Allow text to wrap normally
                            overflowWrap: "break-word", // Break long words if necessary
                            wordBreak: "break-word", // Break words at the end of the line
                          }}
                        >
                          {product.product_name} <br />
                          {product.variation}
                          {product?.is_free_product && (
                            <button className={buttonClass}>Free</button>
                          )}
                        </Link>
                      </td>
                      <td
                        style={{
                          fontSize: "14px",
                          color: "rgb(119, 119, 119)",
                          textDecoration: "none",
                          fontWeight: "400",
                          width: "6rem",
                        }}
                      >
                        $ {product.product_price}
                      </td>
                      <td>{product?.stock}</td>
                      <td style={{ width: "10px" }}>
                        <Button className="bg-light bg-border border-light text-dark">
                          {!product?.is_free_product && (
                            <span onClick={() => decreaseQuantity(index)}>
                              -
                            </span>
                          )}
                          <span className="px-2.5 py-1.5">
                            {product.quantity}
                          </span>
                          {!product?.is_free_product && (
                            <span onClick={() => increaseQuantity(index)}>
                              +
                            </span>
                          )}
                        </Button>
                      </td>
                      <td
                        style={{
                          position: "relative",
                          color: "#f60",
                          fontWeight: "bold",
                          color : "#d5007e"
                        }}
                      >
                        ${" "}
                        {parseFloat(
                          calculateSubtotalAmount(
                            product?.quantity,
                            product?.product_price
                          )
                        )?.toFixed(2)}
                        {!isNaN(accountNo) && (
                          <span
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              color: "rgb(179 175 175 / 30%)",
                              fontSize: "1.5rem",
                              pointerEvents: "none",
                            }}
                          >
                            {accountNo}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="small-screen-message">
              {cartsItemData?.map((item, index) => (
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
                              width="120"
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
                                color: "#f60",
                                fontWeight: "bold",
                              }}
                            >
                              $
                              {(item.product_price * item.quantity)?.toFixed(2)}
                              {!isNaN(accountNo) && (
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    color: "rgb(179 175 175 / 30%)",
                                    fontSize: "1.5rem",
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
            <div className="flex justify-between mt-4 mb-4">
              <div className="flex">
                <Input
                  placeholder="Enter coupon"
                  className="p-2"
                  style={{ borderRadius: "4px 0px 0px 4px" }}
                />

                <Button
                  className="p-2"
                  style={{
                    borderRadius: "0px 4px 4px 0px",
                    backgroundColor: "#d5007e",
                    border: "none",
                  }}
                >
                  APPLY
                </Button>
              </div>

              <Button
                className="p-2"
                style={{ backgroundColor: "#009ee3", border: "none" }}
                onClick={handleApplyEmptyCart}
              >
                Empty Cart
              </Button>

              <Button
                className="p-2 text-dark"
                style={{
                  backgroundColor: "#f8f9fa",
                  border: "0.5px solid #d5007e",
                  marginRight: "1.5rem",
                }}
                onClick={handleUpdateCartItems}
              >
                Update Cart
              </Button>
            </div>
          </Col>
          <Col lg={4} md={12} xs={12}>
            <CartDetailsTabel
              total={total}
              setStep={setStep}
              step={step}
              userData={userData}
              cartItemData={cartsItemData}
              sideList={sideList || null}
              handleUpdateListWithTax={handleUpdateListWithTax}
              shippingAddres={shippingAddres || []}
              isVape={isVape}
              cartList={cartList}
              stateTax={stateTax}
            />
          </Col>
        </div>
      ) : (
        <div className="d-flex justify-content-center flex-column align-items-center">
          <img
            src="https://bexcart.com/assets/images/empty-cart.gif"
            width={"50%"}
          />

          <Link href={"/"}>
            <Button style={{ backgroundColor: "#d5007e", border: "none" }}>
              RETURN TO SHOP
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default CartTable;
