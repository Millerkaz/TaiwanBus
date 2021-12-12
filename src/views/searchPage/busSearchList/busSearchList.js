import React from "react";
import { useSelector } from "react-redux";
import UseDiv100 from "../../../hook/useDiv100vh";
import useDeviceCheck from "../../../hook/useDeviceCheck";
import img from "../../../img";

import ListSmallCard from "../../../components/card/listSmallCard/listSmallCard";

import "./busSearchList.scss";

const renderMainSearchData = (data) => {
  if (data.searchBy === "route") {
    return Object.entries(data.data).map(([key, value]) => {
      let filterValue = value.find(
        (route) =>
          route.Direction === 0 ||
          route.Direction === 1 ||
          route.Direction === 2
      );

      let startEnd = `${filterValue.Stops[0].StopName.Zh_tw} <–> ${
        filterValue.Stops[filterValue.Stops.length - 1].StopName.Zh_tw
      }`;

      let start = `${filterValue.Stops[0].StopName.Zh_tw} `;
      let end = ` ${
        filterValue.Stops[filterValue.Stops.length - 1].StopName.Zh_tw
      }`;

      return (
        <ListSmallCard
          routeName={filterValue.RouteName.Zh_tw}
          routeUID={filterValue.RouteUID}
          searchBy={data.searchBy}
          key={key}
          title={key}
          startEnd={startEnd}
          start={start}
          end={end}
          data={data}
        />
      );
    });
  }

  if (data.searchBy === "stop") {
    // console.log(Object.entries(data.data));
    return Object.entries(data.data).map(([key, value]) => {
      return (
        <ListSmallCard
          searchBy={data.searchBy}
          key={key}
          title={key}
          secondData={value}
          data={data}
        />
      );
    });
  }
};

const BusSearchList = (props) => {
  const mainSearchData = useSelector((state) => state.mainSearchData);
  const height = UseDiv100();
  const device = useDeviceCheck();

  if (!mainSearchData.data) {
    return (
      <div
        className="busSearchList"
        style={
          device === "normal"
            ? { height: `${height - 355}px` }
            : { height: `${height - 315}px` }
        }
      >
        {device === "normal" ? (
          <div className="busSearchList__header">
            <p>搜尋結果</p>
          </div>
        ) : (
          ``
        )}
        <div className="busSearchList__first">
          <img src={img.searchBus} />
          <p>尋找您的公車路線</p>
        </div>
      </div>
    );
  }

  if (Object.keys(mainSearchData.data).length === 0) {
    return (
      <div
        className="busSearchList"
        style={
          device === "normal"
            ? { height: `${height - 355}px` }
            : { height: `${height - 315}px` }
        }
      >
        {device === "normal" ? (
          <div className="busSearchList__header">
            <p>搜尋結果</p>
          </div>
        ) : (
          ``
        )}
        <div className="busSearchList__no">
          <img src={img.noBus} />
          <p>很抱歉，找不到符合的路線</p>
        </div>
      </div>
    );
  }

  return (
    <div className="busSearchList">
      {device === "normal" ? (
        <div className="busSearchList__header">
          <p>搜尋結果</p>
        </div>
      ) : (
        ``
      )}
      <div
        className="busSearchList__container"
        style={
          device === "normal"
            ? { height: `${height - 355}px` }
            : { height: `${height - 315}px` }
        }
      >
        {renderMainSearchData(mainSearchData)}
      </div>
    </div>
  );
};

export default BusSearchList;
