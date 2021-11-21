import React from "react";
import { useSelector } from "react-redux";

import "./targetBusPosition.scss";

const renderEstimateTimeHelper = (obj) => {
  if (obj.StopStatus === 1) {
    return <span>{"尚未發車"}</span>;
  }

  if (obj.StopStatus === 2) {
    return <span>{"交管不停靠"}</span>;
  }

  if (obj.StopStatus === 3) {
    return <span>{"末班車已過"}</span>;
  }

  if (obj.StopStatus === 4) {
    return <span>{"今日未營運"}</span>;
  }

  if (Number(obj.EstimateTime) < 60) {
    return <span>{"進站中"}</span>;
  }

  if (Number(obj.EstimateTime) > 60) {
    return <span>{`約${Math.ceil(Number(obj.EstimateTime) / 60)}分`}</span>;
  }
};

const renderTargetBus = (bus) => {
  return (
    <div className="targetBusPosition">
      <ul className="targetBusPosition__bus">
        {bus.map((v) => {
          if (v[0].length === 0) {
            return <li></li>;
          }

          return (
            <li>
              {v[0].map((eachBus) => {
                if (eachBus.DutyStatus === 2) {
                  return <span></span>;
                }
                return <span>{eachBus.PlateNumb}</span>;
              })}
            </li>
          );
        })}
      </ul>
      <ul className="targetBusPosition__estimateTime">
        {bus.map((v) => {
          if (v[1].length === 0) {
            return <li></li>;
          }

          if (v[1].StopStatus === 1) {
            return <li>{"尚未發車"}</li>;
          }

          return <li>{renderEstimateTimeHelper(v[1][0])}</li>;
        })}
      </ul>
    </div>
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
