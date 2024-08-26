import React, { useState } from "react";

const categories = [
  "Cakes",
  "Cakes",
  "Cakes",
  "Cakes",
  "Cakes",
  "Cakes",
  "Cakes",
  "Cakes",

];

const HeaderCategory = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div
      style={{
       
        padding: "10px",
        display: "flex",
        justifyContent: "space-around",
       
        color: "#ff1200",
        position: "relative", // Ensure relative positioning for dropdowns
      }}
    >
      {categories.map((category, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            cursor: "pointer",
            padding: "10px",
          }}
          onMouseEnter={() => setHoveredCategory(index)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div>{category}</div>
          {hoveredCategory === index && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                backgroundColor: "#fff",
                padding: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                zIndex: "1000",
                color: "#000",
                width: "300px", // Adjust the width as needed
                opacity: 1,
                transform: "translateY(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              {/* Example content similar to your screenshot */}
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ width: "50%", padding: "10px" }}>
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Thumbnail"
                    style={{ width: "100%" }}
                  />
                  <p style={{ textAlign: "center", marginTop: "10px" }}>
                    Paris
                  </p>
                </div>
                <div style={{ width: "50%", padding: "10px" }}>
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Thumbnail"
                    style={{ width: "100%" }}
                  />
                  <p style={{ textAlign: "center", marginTop: "10px" }}>
                    Tokyo
                  </p>
                </div>
                {/* Add more items as needed */}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HeaderCategory;
