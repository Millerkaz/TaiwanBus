import React from "react";
import ListSmallCard from "../card/listSmallCard/listSmallCard";
import UseDiv100 from "../../hook/useDiv100vh";
import useDeviceCheck from "../../hook/useDeviceCheck";

import "./listSmall.scss";

const renderMainSearchData = (page, data) => {
  if (page === "route") {
    return Object.values(data[page]).map((obj) => {
      return (
        <ListSmallCard
          key={obj.routeUID}
          routeName={obj.routeName}
          routeUID={obj.routeUID}
          start={obj.start}
          end={obj.end}
          data={{ city: obj.city }}
        />
      );
    });
  }

  if (page === "choice") {
    return data.stops.map((obj) => {
      return (
        <ListSmallCard
          type="choice"
          city={data.city}
          stopName={obj.StopName.Zh_tw}
          routeName={obj.RouteName.Zh_tw}
        />
      );
    });
  }

  if (page === "stop") {
    // console.log(data);
    return data.map((obj) => {
      return (
        <ListSmallCard
          type="stop"
          city={obj.city}
          stopName={obj.StopName.Zh_tw}
          routeName={obj.RouteName.Zh_tw}
          stopUID={obj.StopUID}
          EstimateTime={obj.EstimateTime}
          direction={obj.Direction === 0 ? "去程" : "返程"}
          StopStatus={obj.StopStatus}
        />
      );
    });
  }
};

const ListSmall = (props) => {
  const height = UseDiv100();
  const device = useDeviceCheck();

  let list;

  if (props.page === "routeChoicePage") {
    list = renderMainSearchData("choice", props.data);
  }

  if (props.page === "favoriteRoutePage") {
    list = renderMainSearchData("route", props.data);
  }

  if (props.page === "favoriteStopPage") {
    list = renderMainSearchData("stop", props.data);
  }

  return (
    <div
      className="listSmall"
      style={
        device === "normal"
          ? { height: `${height - 275}px` }
          : { height: `${height - 255}px` }
      }
    >
      {list}
    </div>
  );
};

export default ListSmall;
