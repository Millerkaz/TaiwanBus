import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { action } from "../../store";
import { getStopStartAndEndNameHelper } from "../../helper";
import TargetBusPosition from "./targetBusPosition/targetBusPosition";
import TargetBusTime from "./targetBusTime/targetBusTime";
import TargetBusTitle from "./targetBusTitle/targetBusTitle";
import Header from "../../components/header/header";
import Popup from "../../components/popup";

import "./targetBusDetail.scss";
import img from "../../img";

const checkBack = (routeStops) => {
  if (routeStops.length === 1 && routeStops[0].Direction === 0) {
    return false;
  }

  if (routeStops.length > 2) {
    return false;
  }

  if (
    routeStops.length === 2 &&
    routeStops[0].Direction === 0 &&
    routeStops[1].Direction === 1
  ) {
    return true;
  }
};

const listClickHandler = (mainSearchData, props, dispatch) => {
  if (mainSearchData.searchBy === "route") {
    dispatch(
      action.targetBusOnClickCreator(
        props.match.params.routeName,
        mainSearchData.data[props.match.params.routeName][0].RouteUID,
        props.match.params.city,
        mainSearchData.data[props.match.params.routeName]
      )
    );
  }
};

const TargetBusDetail = (props) => {
  const [height, setHeight] = useState(window.innerHeight);
  const [hide, setHide] = useState(false);
  const [direction, setDirection] = useState("0");
  const mainSearchData = useSelector((state) => state.mainSearchData);
  const target = useSelector((state) => state.targetBusRenderData.target);
  const routeStops = useSelector(
    (state) => state.targetBusRenderData.routeStops
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const heighCheck = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", heighCheck);

    dispatch(
      action.fetchDataByRouteCreator({
        term: props.match.params.routeName,
        cityCH: props.match.params.city,
      })
    );

    return () => {
      window.removeEventListener("resize", heighCheck);
    };
  }, []);

  useEffect(() => {
    setDirection("0");
    dispatch(action.changeDirectionCreator(true));
  }, [target]);

  useEffect(() => {
    listClickHandler(mainSearchData, props, dispatch);
  }, [mainSearchData]);

  if (!target && !routeStops) {
    return <></>;
  }

  // if (!routeStops[1]) {
  //   // setDirection("0");
  //   return <div>{"此線路無返程"}</div>;
  // }

  return (
    <div className={`targetBusDetail ${!hide ? "" : "bg--hidden"}`}>
      <Header color="black" className={`${!hide ? "" : "header--hidden"}`} />
      <TargetBusTitle
        className={`${!hide ? "" : "title--hidden"}`}
        direction={direction}
        mapClickHandler={() => {
          setHide((pre) => !pre);
        }}
      />
      <div className="targetBusDetail__main">
        {!hide ? (
          ""
        ) : (
          <img
            src={img.i_arrowD}
            alt="back"
            onClick={() => {
              setHide((pre) => !pre);
            }}
          />
        )}
        <div className="targetBusDetail__nav">
          <div className="targetBusDetail__nav--stop">
            <p>行駛方向</p>
            <p>
              <span>往</span>
              {`${
                getStopStartAndEndNameHelper(routeStops, Number(direction))[1]
              } 站`}
            </p>
          </div>
          {!checkBack(routeStops) ? (
            <div className="btn--icon targetBusDetail__nav--switch">
              <img src={img.i_leftArrowW} alt="single" />
            </div>
          ) : (
            <div
              className="btn btn--icon targetBusDetail__nav--switch"
              onClick={() => {
                dispatch(action.changeDirectionCreator());

                if (direction === "1") {
                  setDirection("0");
                  return;
                }
                setDirection("1");
              }}
            >
              <img src={img.i_switch} alt="switch" />
            </div>
          )}
        </div>
        <div
          className="targetBusDetail__container"
          style={{ height: `${!hide ? `${height - 333}` : "200"}px` }}
        >
          <TargetBusTime direction={direction} />
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
    </div>
  );
};

export default TargetBusDetail;

//一律用 routeUID get busGPS,busNext,Shape
