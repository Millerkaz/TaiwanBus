import React, { useState } from "react";
import img from "../../img";
import { useSelector } from "react-redux";
import { historyPush } from "../../helper";
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
      />
    );
  });
};

const NearSearchPage = (props) => {
  const target = useSelector((state) => state.targetBusRenderData.target);
  const nearBusData = useSelector((state) => state.nearBusData);
  const [hideStop, setHideStop] = useState(false);

  return (
    <React.Fragment>
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
      <LeafletMap hideStop={hideStop} />

      <div className="nearSearchPage__list">{renderNearData(nearBusData)}</div>
    </React.Fragment>
  );
};
export default NearSearchPage;
