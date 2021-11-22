import React from "react";
import { useSelector } from "react-redux";

import "./targetBusPosition.scss";

const renderTargetBus = (bus) => {
  return (
    <ul className="targetBusPosition">
      {bus.map((v) => {
        if (v[0].length === 0) {
          return <li></li>;
        }

        return (
          <li>
            {v[0].map((eachBus) => {
              if (eachBus.DutyStatus === 2) {
                return <p></p>;
              }
              return <span>{eachBus.PlateNumb}</span>;
            })}
          </li>
        );
      })}
    </ul>
  );
};

const TargetBusPosition = (props) => {
  const Bus0 = useSelector(
    (state) => state.targetBusRenderData.routeDirection0Bus
  );
  const Bus1 = useSelector(
    (state) => state.targetBusRenderData.routeDirection1Bus
  );

  if (props.direction === "0") {
    return <>{renderTargetBus(Bus0)}</>;
  }

  if (props.direction === "1") {
    return <>{renderTargetBus(Bus1)}</>;
  }

  return <></>;
};

export default TargetBusPosition;
