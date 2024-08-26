import React from "react";
import Link from "next/link";

const SingleStrip = ({  }) => {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  return (
    <div className="p-2">
      <div className="py-1">
        
      <div style={{ overflow: 'hidden' }}>
  <img
    src="https://thumbs.dreamstime.com/b/assorted-colorful-cupcakes-various-toppings-arranged-wooden-surface-delectable-array-topped-creamy-frosting-311583729.jpg"
    className="w-full h-22 sm:h-40 md:h-48 lg:h-56"
    style={{
      objectFit: 'cover',
      display: 'block',
    }}
  />
</div>


      
      </div>
    </div>
  );
};

export default SingleStrip;
