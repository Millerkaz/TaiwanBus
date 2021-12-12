import React from "react";
import { renderEstimateTimeHelper } from "../../../helper";
import { useSelector } from "react-redux";

import "./targetBusTime.scss";

const renderTargetBus = (bus) => {
  return (
    <ul className="targetBusTime">
      {bus.map((v) => {
        if (v[1].length === 0) {
          return (
            <li>
              <span style={{ color: "#B4B3B3" }}>{"尚未發車"}</span>
            </li>
          );
        }

        if (v[1].StopStatus === 1) {
          return (
            <li>
              <span style={{ color: "#B4B3B3" }}>{"尚未發車"}</span>
            </li>
          );
        }
        return <li>{renderEstimateTimeHelper(v[1][0])}</li>;
      })}
    </ul>
  );
};

const TargetBusTime = (props) => {
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

export default TargetBusTime;
