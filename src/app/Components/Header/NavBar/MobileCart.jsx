import React, { useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import {
  useEmptyCartMutation,
  useGetDiscountRulesMutation,
  useGetStateTaxMutation,
  useGetUpdateCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartQuantityMutation,
} from "@/redux/features/product/productApi";
import { set_cartdata } from "@/redux/features/product/productSlice";
import CartModal from "./cartModal";

const MobileCart = () => {
  const [openCartCanvas, setOpenCartCanvas] = useState(false);
  const [cartItem, setCartItem] = useState([]);
  const dispatch = useDispatch();
  const userId = Cookies.get("user_id") ? Number(Cookies.get("user_id")) : null;
  const [removeCartItem, {}] = useRemoveCartItemMutation();
  const [updateCartList, {}] = useGetUpdateCartMutation();
  const [emptyCart, {}] = useEmptyCartMutation();
  const [getStateTax, {}] = useGetStateTaxMutation();
  const [stateTax, setStateTax] = useState([]);
  const [updateCartQty, {}] = useUpdateCartQuantityMutation();
  const [getdiscountRules, {}] = useGetDiscountRulesMutation();
  const [rules, setRules] = useState([]);

  const storeCartItems = useSelector((store) => store?.product?.cart_data);
  const defaultAddress = useSelector(
    (store) => store?.product?.default_address
  );

  const handleToggle = () => setOpenCartCanvas(!openCartCanvas);

  const totalSubtotal = cartItem?.reduce(
    (acc, curr) => acc + (curr?.quantity || 0) * (curr?.product_price || 0),
    0
  );

  //Empty Cart Logic
  const handleEmptyCart = () => {
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
            setCartItem([]);
          } else {
            dispatch(set_cartdata(response?.data));
            setCartItem([]);
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
    const cartItems = [...data];
    const updatedItem = { ...cartItems[itemIndex] };
    if (updatedItem.quantity > 1) {
      updatedItem.quantity -= 1;
      cartItems[itemIndex] = updatedItem;
      setData(cartItems);
      const { updatedArray } = addTaxInItem(
        cartItems,
        stateTax,
        defaultAddress?.state
      );
      const productWithRules = applyRules(updatedArray, rules);
      updateCartList({ userId }).then((res) => {
        if (res?.data?.status) {
          const updatedResponse = { ...res?.data };
          updatedResponse.cart_items = productWithRules;
          dispatch(set_cartdata(updatedResponse));
        }
      });
      await updateQuantityOnServer(updatedItem);
    } else {
      notifyError("Cannot increase quantity beyond available stock");
    }
  };

  const increaseQuantity = async (itemIndex) => {
    const cartItems = [...data];
    const updatedItem = { ...cartItems[itemIndex] };

    if (updatedItem.max_quantity_var != "") {
      if (updatedItem.quantity >= updatedItem.max_quantity_var) {
        notifyError(
          `Each store can purchase maximum of ${updatedItem.max_quantity_var}`
        );
        return;
      }
    }
    if (updatedItem.quantity < updatedItem.stock) {
      updatedItem.quantity += 1;
      cartItems[itemIndex] = updatedItem;
      setData(cartItems);
      const { updatedArray } = addTaxInItem(
        cartItems,
        stateTax,
        defaultAddress?.state
      );
      const productWithRules = applyRules(updatedArray, rules);
      updateCartList({ userId }).then((res) => {
        if (res?.data?.status) {
          const updatedResponse = { ...res?.data };
          updatedResponse.cart_items = productWithRules;
          dispatch(set_cartdata(updatedResponse));
        }
      });
      await updateQuantityOnServer(updatedItem);
    } else {
      notifyError("Cannot increase quantity beyond available stock");
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
            setData([]);
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

  useEffect(() => {
    getdiscountRules().then((response) => {
      setRules(response?.data);
    });
  }, []);

  useEffect(() => {
    if (storeCartItems?.status) {
      setCartItem(storeCartItems?.cart_items);
    } else {
      setCartItem(storeCartItems?.cart_items);
    }
  }, [storeCartItems]);

  useEffect(() => {
    getStateTax().then((res) => {
      setStateTax(res?.data);
    });
  }, []);

  return (
    <div className="flex flex-row gap-5 justify-content-end cursor-pointer align-item-center">
      {openCartCanvas && (
        <CartModal
          openCartCanvas={openCartCanvas}
          handleToggle={handleToggle}
          handleEmptyCart={handleEmptyCart}
          decreaseQuantity={decreaseQuantity}
          increaseQuantity={increaseQuantity}
          removeProduct={removeProduct}
          defaultAddress={defaultAddress}
          totalSubtotal={totalSubtotal}
          cartItem={cartItem || []}
        />
      )}

      <div className="relative flex flex-row gap-4 cursor-pointer">
        <div className="relative">
          <ShoppingCartIcon
            style={{ color: "white", fontSize: "2.4rem" }}
            className="icons"
            onClick={handleToggle}
          />
          <span
            className="absolute top-0 right-0 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            style={{
              backgroundColor: "#d5007e",
              transform: "translate(50%, -50%)",
            }}
          >
            {cartItem?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MobileCart;
