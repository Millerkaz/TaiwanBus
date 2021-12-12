import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { action } from "../../store";
import {
  getStopStartAndEndNameHelper,
  historyPush,
  local,
  addToFavoriteHelper,
} from "../../helper";
import TargetBusPosition from "./targetBusPosition/targetBusPosition";
import TargetBusTime from "./targetBusTime/targetBusTime";
import TargetBusTitle from "./targetBusTitle/targetBusTitle";
import Header from "../../components/header/header";
import Popup from "../../components/popup";
import UseDiv100 from "../../hook/useDiv100vh";
import useDeviceCheck from "../../hook/useDeviceCheck";

import "./targetBusDetail.scss";
import img from "../../img";
import LeafletMap from "../../components/leafletMap/leafletMap";

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

const stopAddToFavorite = (data) => {
  let localData = local.getLocal("stop");

  if (localData[data.StopUID]) {
    delete localData[data.StopUID];
    local.storeInLocal("stop", localData);

    return;
  }

  localData[data.StopUID] = {
    stopUID: data.StopUID,
    city: data.city,
  };
  local.storeInLocal("stop", localData);
};

const TargetBusDetail = (props) => {
  const device = useDeviceCheck();
  const [isFavor, setIsFavor] = useState(false);
  const [hide, setHide] = useState(false);
  const [direction, setDirection] = useState("0");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const stopIndex = useSelector((state) => state.stopIndex);
  const mainSearchData = useSelector((state) => state.mainSearchData);
  const target = useSelector((state) => state.targetBusRenderData.target);
  const routeStops = useSelector(
    (state) => state.targetBusRenderData.routeStops
  );

  const dispatch = useDispatch();
  const height = UseDiv100();

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
              if (device !== "normal") {
                mapClickHandler();
              }
              dispatch(
                action.setStopIndexCreator([
                  i,
                  { ...stopObj, city: target.city },
                ])
              );
            }}
          >
            {stopObj.StopName.Zh_tw}
          </span>
        </li>
      );
    });
  };

  useEffect(() => {
    dispatch(
      action.fetchDataByRouteCreator({
        term: props.match.params.routeName,
        cityCH: props.match.params.city,
      })
    );

    return () => {
      dispatch(action.clearTargetCreator());
    };
  }, []);

  useEffect(() => {
    if (!target) return;

    const localData = local.getLocal("route");
    local.initLocalData();
    if (localData[target.routeUID]) {
      setIsFavor(true);
    }

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

  if (!target || !routeStops) {
    return (
      <div className={`targetBusDetail `}>
        <div className={`targetBusDetail__loading`}>
          <div>
            <img src={img.i_busLoading} alt="loading" />
            <h1>等待公車進站...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`targetBusDetail ${!hide ? "" : "bg--hidden"}`}>
      <Header
        hide={hide}
        color="black"
        className={`header-B ${!hide ? "" : "header--hidden"}`}
      />

      <TargetBusTitle
        className={`${!hide ? "" : "title--hidden"}`}
        direction={direction}
        mapClickHandler={mapClickHandler}
      />
      {/*------------------------------------main------------------------------------*/}
      <div
        className={`targetBusDetail__main ${
          device === "normal" ? `pc--targetBusDetail__main` : ""
        } `}
      >
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
        {/*------------------------------------main 的導航列------------------------------------*/}
        <div className={`targetBusDetail__nav ${!hide ? "" : "nav--hidden"}`}>
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
          <div className="targetBusDetail__nav--bar">
            <div className="listSmallCard__favor">
              <img
                style={{ cursor: "pointer" }}
                alt="favor"
                src={isFavor ? img.i_heartFill : img.i_heartLine}
                onClick={(e) => {
                  addToFavoriteHelper(
                    "route",
                    {
                      routeUID: target.routeUID,
                      routeName: target.routeName,
                      data: { city: target.city },
                      start: routeStops[0].Stops[0].StopName.Zh_tw,
                      end: routeStops[0].Stops[routeStops[0].Stops.length - 1]
                        .StopName.Zh_tw,
                    },
                    setIsFavor
                  );
                }}
              />
            </div>
            <div
              className="btn  targetBusDetail__nav--refresh"
              onClick={() => {
                dispatch(
                  action.reFetchNowBusCreator(
                    target.routeUID,
                    target.city,
                    mainSearchData.data[props.match.params.routeName]
                  )
                );
              }}
            >
              <img src={img.i_loop} alt="refresh" />
            </div>
            {/*------------------------------------單向或雙向icon顯示------------------------------------*/}
            {!checkBack(routeStops) ? (
              <div className=" targetBusDetail__nav--switch">
                <img src={img.i_leftArrowW} alt="single" />
              </div>
            ) : (
              <div
                className="btn  targetBusDetail__nav--switch"
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
        </div>
        {/*------------------------------------路段詳細內容------------------------------------*/}
        <div
          className="targetBusDetail__container"
          style={
            device === "normal"
              ? { height: height - 380 + "px" }
              : { height: `${!hide ? `${height - 338}` : "150"}px` }
          }
        >
          <TargetBusTime direction={direction} />
          <ul className="targetBusDetail__container--stopName">
            {renderStopList()}
          </ul>
          <TargetBusPosition direction={direction} />
        </div>
        {/*------------------------------------裝置監控 MAP------------------------------------*/}
        {device === "normal" && (
          <React.Fragment>
            <LeafletMap />
            {/* <Footer /> */}
          </React.Fragment>
        )}
      </div>
      {/*------------------------------------popup------------------------------------*/}
      <Popup isPopupOpen={isPopupOpen} popUpOpenHandler={popupOpenHandler}>
        {isPopupOpen === "add" && (
          <div className="targetBusDetail__popup ">
            <div className="targetBusDetail__popup--btns">
              <p
                onClick={() => {
                  stopAddToFavorite(stopIndex[1]);
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
              {device === "normal" && <img src={img.addStop} alt="addStop" />}
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
                  historyPush("/favorite/stop");
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
