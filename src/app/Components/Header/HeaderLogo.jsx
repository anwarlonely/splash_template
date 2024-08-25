import Link from "next/link";
import React from "react";

const HeaderLogo = () => {
  return (
    <>
      <div>
        <Link href={`/`}>
          <img
            src={
              "https://splashdistributors.com/wp-content/uploads/2023/11/splash-newlogo.png"
            }
            alt="logo"
            style={{ height: "100px", position: "relative" }}
          />
        </Link>
      </div>
    </>
  );
};

export default HeaderLogo;
