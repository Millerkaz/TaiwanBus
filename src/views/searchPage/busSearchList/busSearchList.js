import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import BusSearchSideBar from "../busSearchSideBar/busSearchSideBar";
import ListSmallCard from "../../../components/card/listSmallCard/listSmallCard";
import TargetBusDetail from "../../targetBusDetail/targetBusDetail";
import "./busSearchList.scss";
import img from "../../../img";

const renderMainSearchData = (data) => {
  if (data.searchBy === "route") {
    return Object.entries(data.data).map(([key, value]) => {
      let filterValue = value.find((route) => route.Direction === 0);

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
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const heighCheck = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", heighCheck);

    return () => {
      window.removeEventListener("resize", heighCheck);
    };
  }, []);

  if (!mainSearchData.data) {
    return (
      <div className="busSearchList">
        <div className="busSearchList__first">
          <img src={img.searchBus} />
          <p>尋找您的公車路線</p>
        </div>
      </div>
    );
  }

  if (Object.keys(mainSearchData.data).length === 0) {
    return (
      <div className="busSearchList">
        <div className="busSearchList__no">
          <img src={img.noBus} />
          <p>很抱歉，找不到符合的路線</p>
        </div>
      </div>
    );
  }

  return (
    <div className="busSearchList" style={{ height: `${height - 300}px` }}>
      {renderMainSearchData(mainSearchData)}
    </div>
  );
};

export default BusSearchList;
