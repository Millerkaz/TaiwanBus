import React from "react";
import { useSelector } from "react-redux";
import { getStopStartAndEndNameHelper, historyPush } from "../../../helper";
import useDeviceCheck from "../../../hook/useDeviceCheck";
import img from "../../../img";

import "./targetBusTitle.scss";

const renderPath = (routeStop, direction = 0) => {
  if (!routeStop[direction]) {
    // setDirection("0");
    return <></>;
  }
  const [start, end] = getStopStartAndEndNameHelper(routeStop, direction);

  return (
    <React.Fragment>
      {start}
      <img src={img.i_arrowsAltW} alt="pass" />
      {end}
    </React.Fragment>
  );
};

const TargetBusTitle = (props) => {
  const device = useDeviceCheck();
  const target = useSelector((state) => state.targetBusRenderData.target);
  const routeStop = useSelector(
    (state) => state.targetBusRenderData.routeStops
  );

  return (
    <div className={`targetBusTitle ${props.className || ""}`}>
      <div className="targetBusTitle__icons">
        <div className="targetBusTitle__icons--back">
          <img
            style={{ cursor: "pointer" }}
            onClick={() => {
              historyPush("/searchBus");
            }}
            src={img.i_leftArrowW}
            alt="back"
          />
        </div>
        {device !== "normal" && (
          <div
            className="btn btn--icon targetBusTitle__icons--location"
            onClick={props.mapClickHandler}
          >
            <img src={img.i_map} alt="map" />
          </div>
        )}
      </div>
      <div className="targetBusTitle__target">
        <h1>{target.routeName}</h1>
        <h3>{renderPath(routeStop, Number(props.direction))}</h3>
      </div>
    </div>
  );
};

export default TargetBusTitle;
