import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TargetBusPosition from "./targetBusPosition/targetBusPosition";
import Popup from "../../components/popup";

import "./targetBusDetail.scss";

const TargetBusDetail = (props) => {
  const [direction, setDirection] = useState("0");
  const target = useSelector((state) => state.targetBusRenderData.target);
  const routeStops = useSelector(
    (state) => state.targetBusRenderData.routeStops
  );

  useEffect(() => {
    setDirection("0");
  }, [target, routeStops]);

  if (!target && !routeStops) {
    return <></>;
  }

  if (!routeStops[1]) {
    // setDirection("0");
    return <div>{"此線路無返程"}</div>;
  }

  return (
    <div className="targetBusDetail">
      <h1 className="targetBusDetail__title">{target.routeName}</h1>
      {
        <div className="targetBusDetail__nav">
          <button className="btn" onClick={() => setDirection("0")}>
            去程
          </button>
          <button className="btn" onClick={() => setDirection("1")}>
            返程
          </button>
        </div>
      }
      <div className="targetBusDetail__container">
        <ul className="targetBusDetail__container--stopName">
          {routeStops[direction].Stops.map((stopObj, i) => {
            // console.log(stopObj.StopName.Zh_tw);
            return (
              <li key={stopObj.StopName.Zh_tw + i}>
                <span>{stopObj.StopName.Zh_tw}</span>
              </li>
            );
          })}
        </ul>
        <TargetBusPosition direction={direction} />
      </div>
    </div>
  );
};

export default TargetBusDetail;

//一律用 routeUID get busGPS,busNext,Shape
