import React from "react";
import Link from "next/link";

const SingleStrip = ({ banner6 }) => {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  return (
    <div className="p-2">
      <div className="py-1">
        {banner6?.map((item, index) => (
          <div key={index}>
            <Link href={item.link}>
              <img
                src={`https://splashdistributors.com/wp-content/uploads/2024/05/BREEZE-BANNER-WEBSITE.gif`}
                alt={`Card ${item.serial}`}
                className="w-full"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleStrip;
