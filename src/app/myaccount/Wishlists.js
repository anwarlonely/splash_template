import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { Table } from "reactstrap";
import style from "../../styles/whilist.module.css";
import Test from "./test";

const Wishlists = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 450);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
   <>
    {isSmallScreen ? (<div style={{fontWeight:700}}> Data Will Update Soon!  </div>) : (   <div className="p-4" style={{ width: "68vw" }}>
      <div className="d-flex mb-4 w-100">
        <div className="flex-grow-1 ms-3">
          <div className="table-responsive w-100">
            <Table className="align-middle table-nowrap mb-0">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">PRODUCT</th>
                  <th scope="col">PRICE</th>
                  <th scope="col">STOCK STATUS</th>
                  <th scope="col">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <img
                      src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL-ERzrBww4nzVoovPa9UeUEsVIMpUY4E_yQ&s "}
                      alt="cart-product-image"
                      className="cart-product-image"
                    />
                  </th>
                  <td style={{ whiteSpace: "pre-wrap" }}>
                    {" "}
                    VECEE VC VERSE BY YOCAN 5% DISPOSABLE (60ML) 8K PUFFS 5CT/
                    BOX
                  </td>
                  <td>Bobby Davis</td>
                  <td>300</td>
                  <td>
                    <div className="mb-2">
                      <button className={style.selectBtn}>Select Option</button>
                    </div>
                    <button className={style.QuickBtn}>Quick View</button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div>
        <Test/>
      </div>
        </div>
      </div>
      
    </div>) }
   
   </>
   
  );
};

export default Wishlists;
