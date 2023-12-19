import React from "react";

const CarItem = (props) => {
  function formatNumber(number) {
    return new Intl.NumberFormat("en-US").format(number);
  }

  return (
    <>
      <div className="row" style={{ marginBottom: 10 }} onClick={() => {props.clickCar(props.car)}}>
        <div className="col-sm-5">
          <img src={props.car.carImage} className="car-image" />
        </div>
        <div className="col-sm-7">
          <h5>{props.car.carModel}</h5>
          <p className="price">${formatNumber(props.car.carPrice)}</p>
        </div>
      </div>
    </>
  );
};

export default CarItem;
