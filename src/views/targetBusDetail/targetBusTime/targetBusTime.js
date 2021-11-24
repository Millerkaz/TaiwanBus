import React from "react";
import { useSelector } from "react-redux";

import "./targetBusTime.scss";

const renderEstimateTimeHelper = (obj) => {
  if (obj.StopStatus === 1) {
    return <span style={{ color: "#B4B3B3" }}>{"尚未發車"}</span>;
  }

  if (obj.StopStatus === 2) {
    return <span style={{ color: "#B4B3B3" }}>{"交管不停靠"}</span>;
  }

  if (obj.StopStatus === 3) {
    return <span style={{ color: "#B4B3B3" }}>{"末班車已過"}</span>;
  }

  if (obj.StopStatus === 4) {
    return <span style={{ color: "#B4B3B3" }}> {"今日未營運"}</span>;
  }

  if (Number(obj.EstimateTime) < 60) {
    return (
      <span
        className={"bus--arrive"}
        style={{ color: "#f66a4b", fontSize: "1.4rem" }}
      >
        {"即將到站"}
      </span>
    );
  }

  if (Number(obj.EstimateTime) >= 60) {
    return <span>{`${Math.ceil(Number(obj.EstimateTime) / 60)}分`}</span>;
  }
};

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
