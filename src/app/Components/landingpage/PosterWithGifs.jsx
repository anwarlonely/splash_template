import React from "react";
import { Card } from "reactstrap";

const PosterWithGifs = ({ verticalgifs }) => {
  return (
    <div className="p-2">
      <div className="card-group">
        {verticalgifs?.map((item, index) => (
          <Card className="" key={index}>
            <img
              className="card-img-top img-fluid"
              src={item?.img_url}
              alt="Card cap"
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PosterWithGifs;
