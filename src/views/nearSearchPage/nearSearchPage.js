import React, { useState } from "react";
import { useSelector } from "react-redux";
import { historyPush, cityISO } from "../../helper";
import useDeviceCheck from "../../hook/useDeviceCheck";
import img from "../../img";

import BtnBar from "../../components/btnBar/btnBar";
import ListSmallCard from "../../components/card/listSmallCard/listSmallCard";
import Header from "../../components/header/header";
import LeafletMap from "../../components/leafletMap/leafletMap";

import "./nearSearchPage.scss";

const renderNearData = (nearBusData) => {
  return nearBusData.map((station) => {
    let routes = station.Stops.map((stop) => stop.RouteName.Zh_tw).join(",");
    return (
      <ListSmallCard
        type="near"
        stationName={station.StationName.Zh_tw}
        stationUID={station.StationUID}
        key={station.StationUID}
        stationAddress={station.StationAddress}
        stops={routes}
        city={cityISO[station.LocationCityCode]}
      />
    );
  });
};

const NearSearchPage = (props) => {
  const target = useSelector((state) => state.targetBusRenderData.target);
  const nearBusData = useSelector((state) => state.nearBusData);
  const device = useDeviceCheck();
  const [hideStop, setHideStop] = useState(false);

  return (
    <div className="nearSearchPage">
      <div className="nearSearchPage__header">
        <Header />
        {target && (
          <div className="nearSearchPage__header--title">
            <img
              style={{ cursor: "pointer" }}
              alt="back"
              src={img.i_leftArrowB}
              onClick={() => {
                historyPush("/searchBus");
              }}
            />
            <p>{`${target.routeName} 路線圖`}</p>
          </div>
        )}
        <div className="nearSearchPage__icons">
          {props.location.pathname !== "/busMap" ? (
            <div
              className="nearSearchPage__icons--switch"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setHideStop((pre) => !pre);
              }}
            >
              <p>顯示站點</p>
              {hideStop ? (
                <img src={img.swithBtnOff} alt="closePoint" />
              ) : (
                <img src={img.swithBtnOn} alt="openPoint" />
              )}
            </div>
          ) : (
            <div></div>
          )}
          {props.location.pathname === "/busMap" && (
            <BtnBar className="nearSearchPage__icons--position" />
          )}
        </div>
      </div>
      <LeafletMap
        page={device === "normal" ? "near" : ""}
        hideStop={hideStop}
        stopsPosition={nearBusData.map((station) => {
          return {
            stationName: station.StationName.Zh_tw,
            bearing: station.Bearing,
            coords: {
              lat: station.StationPosition.PositionLat,
              lng: station.StationPosition.PositionLon,
            },
          };
        })}
      />

      <div className="nearSearchPage__list">{renderNearData(nearBusData)}</div>
    </div>
  );
};
export default NearSearchPage;
