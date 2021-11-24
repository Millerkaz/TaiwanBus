import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { action } from "../../store";
import { getStopStartAndEndNameHelper, historyPush } from "../../helper";
import TargetBusPosition from "./targetBusPosition/targetBusPosition";
import TargetBusTime from "./targetBusTime/targetBusTime";
import TargetBusTitle from "./targetBusTitle/targetBusTitle";
import Header from "../../components/header/header";
import Nav from "../../components/nav/nav";
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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const mainSearchData = useSelector((state) => state.mainSearchData);
  const target = useSelector((state) => state.targetBusRenderData.target);
  const routeStops = useSelector(
    (state) => state.targetBusRenderData.routeStops
  );
  const dispatch = useDispatch();

  const popupOpenHandler = useCallback((content) => {
    if (content === "add") {
      setIsPopupOpen("add");
      return;
    }

    if (content === "success") {
      setIsPopupOpen("success");
      return;
    }

    setIsPopupOpen(false);
  }, []);

  const mapClickHandler = useCallback((force = true) => {
    if (force) {
      setHide(true);
      return;
    }
    setHide(false);
  }, []);

  const renderStopList = () => {
    return routeStops[direction].Stops.map((stopObj, i) => {
      return (
        <li key={stopObj.StopName.Zh_tw + i}>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              popupOpenHandler("add");
              mapClickHandler();
              dispatch(action.setStopIndexCreator([i]));
            }}
          >
            {stopObj.StopName.Zh_tw}
          </span>
        </li>
      );
    });
  };

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
      dispatch(action.clearTargetCreator());
      window.removeEventListener("resize", heighCheck);
      // console.log("clear");
    };
  }, []);

  useEffect(() => {
    setDirection("0");
    dispatch(action.changeDirectionCreator(true));
  }, [target]);

  useEffect(() => {
    if (
      !mainSearchData.data ||
      !mainSearchData?.data[props.match.params.routeName]
    )
      return;
    listClickHandler(mainSearchData, props, dispatch);
  }, [mainSearchData]);

  if (!target && !routeStops) {
    return <></>;
  }

  return (
    <div className={`targetBusDetail ${!hide ? "" : "bg--hidden"}`}>
      <Header
        hide={hide}
        color="black"
        className={`header-B ${!hide ? "" : "header--hidden"}`}
      />
      {/* //// */}
      <TargetBusTitle
        className={`${!hide ? "" : "title--hidden"}`}
        direction={direction}
        mapClickHandler={mapClickHandler}
      />
      {/* //// */}
      <div className="targetBusDetail__main">
        {!hide ? (
          ""
        ) : (
          <img
            src={img.i_arrowD}
            alt="back"
            onClick={() => {
              mapClickHandler(false);
            }}
          />
        )}
        {/* //// */}
        <div className="targetBusDetail__nav">
          <div className="targetBusDetail__nav--stop">
            <p>行駛方向</p>
            <p>
              <span style={{ color: `${direction === "0" ? "" : "#f43b47"}` }}>
                往
              </span>
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
        {/* //// */}
        <div
          className="targetBusDetail__container"
          style={{ height: `${!hide ? `${height - 333}` : "200"}px` }}
        >
          <TargetBusTime direction={direction} />
          <ul className="targetBusDetail__container--stopName">
            {renderStopList()}
          </ul>
          <TargetBusPosition direction={direction} />
        </div>
      </div>
      {/* //// */}
      <Popup isPopupOpen={isPopupOpen} popUpOpenHandler={popupOpenHandler}>
        {isPopupOpen === "add" && (
          <div className="targetBusDetail__popup ">
            <div className="targetBusDetail__popup--btns">
              <p
                onClick={() => {
                  popupOpenHandler("success");
                }}
              >
                收藏站牌
              </p>
            </div>
            <div className="targetBusDetail__popup--cancel">
              <p
                onClick={() => {
                  popupOpenHandler();
                }}
              >
                取消
              </p>
            </div>
          </div>
        )}
        {isPopupOpen === "success" && (
          <div className="targetBusDetail__popup ">
            <div className="targetBusDetail__popup--content">
              <p>已成功收藏此站牌</p>
            </div>
            <div className="targetBusDetail__popup--btns">
              <p
                onClick={() => {
                  popupOpenHandler();
                }}
              >
                關閉
              </p>
              <p
                onClick={() => {
                  historyPush("/favorite");
                }}
              >
                前往查看
              </p>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default TargetBusDetail;

//一律用 routeUID get busGPS,busNext,Shape
