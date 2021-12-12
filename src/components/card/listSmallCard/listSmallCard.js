import React, { useState, useEffect } from "react";
import { renderEstimateTimeHelper, addToFavoriteHelper } from "../../../helper";
import { local, historyPush } from "../../../helper";
import img from "../../../img";

import "./listSmallCard.scss";

/**
 *公車列表小卡
 * props:
 * @type 哪個頁面的小卡 ("string" : stop,route,near,choice)
 * @各頁面有的小卡有自己需要傳入的props值
 */

const ListSmallCard = (props) => {
  const [isFavor, setIsFavor] = useState(false);

  // 兩個我的收藏頁面需要提取本地端數據
  useEffect(() => {
    if (props.type === "stop") {
      const localData = local.getLocal("stop");
      if (localData[props.stopUID]) {
        setIsFavor(true);
      }
      return;
    }

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
            historyPush(`/routeChoice/${props.city}/${props.stationUID}`);
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

  if (props.type === "choice") {
    return (
      <div className={`listSmallCard listSmallCard--choice`}>
        <div
          style={{ width: "95%" }}
          onClick={(e) => {
            historyPush(`/busMap/${props.city}/${props.routeName}`);
          }}
        >
          <p className="listSmallCard__title">{props.routeName}</p>
          {props.stopName && (
            <p className="listSmallCard__subTitle">
              站牌名稱：{props.stopName}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (props.type === "stop") {
    return (
      <div className={`listSmallCard listSmallCard--stop`}>
        <div
          style={{ width: "95%" }}
          onClick={(e) => {
            historyPush(`/busMap/${props.city}/${props.routeName}`);
          }}
        >
          <p className="listSmallCard__title">{props.stopName}</p>

          <p className="listSmallCard__subTitle subTitle--favoriteStop">
            <span>
              公車號碼：{props.routeName} / {props.direction}
            </span>
          </p>
        </div>
        <div className="listSmallCard__favor">
          <img
            src={isFavor ? img.i_heartFill : img.i_heartLine}
            onClick={(e) => {
              addToFavoriteHelper("stop", props, setIsFavor);
            }}
          />
          {renderEstimateTimeHelper(props)}
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
            addToFavoriteHelper("route", props, setIsFavor);
          }}
        />
        <p>{props.data?.city}</p>
      </div>
    </div>
  );
};

export default ListSmallCard;
