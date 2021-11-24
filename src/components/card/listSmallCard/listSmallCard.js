import React, { useState, useEffect } from "react";
import { action } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { local, historyPush } from "../../../helper";
import { map } from "../../leafletMap/leafletMap";
import img from "../../../img";

import "./listSmallCard.scss";

const routeAddToFavorite = (key, props, setFunction) => {
  let localData = local.getLocal(key);

  if (localData[props.routeUID]) {
    delete localData[props.routeUID];
    local.storeInLocal(key, localData);
    setFunction(false);
    return;
  }

  localData[props.routeUID] = {
    routeUID: props.routeUID,
    routeName: props.routeName,
    start: props.start,
    end: props.end,
    city: props.data.city,
  };
  local.storeInLocal("route", localData);
  setFunction(true);
};

const ListSmallCard = (props) => {
  const [isFavor, setIsFavor] = useState(false);

  useEffect(() => {
    local.initLocalData();
    const localData = local.getLocal("route");
    if (localData[props.routeUID]) {
      setIsFavor(true);
    }
  }, []);

  if (props.type === "near") {
    return (
      <div className={`listSmallCard listSmallCard--nearPage`}>
        <div
          style={{ width: "95%" }}
          onClick={(e) => {
            historyPush(`/busMap/${props.data.city}/${props.routeName}`);
          }}
        >
          <p className="listSmallCard__title">{props.stationName}</p>
          {props.stationAddress && (
            <p className="listSmallCard__subTitle">
              地址 : {props.stationAddress}
            </p>
          )}
          {props.stops && (
            <p className="listSmallCard__subTitle">◎：{props.stops}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`listSmallCard`}>
      <div
        style={{ width: "75%" }}
        onClick={(e) => {
          historyPush(`/busMap/${props.data.city}/${props.routeName}`);
        }}
      >
        <p className="listSmallCard__title">{props.routeName}</p>
        {props.start && (
          <p className="listSmallCard__subTitle">
            {props.start}
            <img src={img.i_arrowsAltB} />
            {props.end}
          </p>
        )}
      </div>

      <div className="listSmallCard__favor">
        <img
          src={isFavor ? img.i_heartFill : img.i_heartLine}
          onClick={(e) => {
            routeAddToFavorite("route", props, setIsFavor);
          }}
        />
        <p>{props.data?.city}</p>
      </div>
    </div>
  );
};

export default ListSmallCard;
