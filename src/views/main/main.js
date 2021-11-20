import React from "react";
import { useSelector } from "react-redux";
import BusSearchSideBar from "../busSearchSideBar/busSearchSideBar";
import ListSmallCard from "../../components/card/listSmallCard/listSmallCard";
import "./main.scss";

const renderMainSearchData = (data) => {
  if (data.searchBy === "route") {
    return Object.entries(data.data).map(([key, value]) => {
      let filterValue = value.find((route) => route.Direction === 0);

      let startEnd = `${filterValue.Stops[0].StopName.Zh_tw} <–> ${
        filterValue.Stops[filterValue.Stops.length - 1].StopName.Zh_tw
      }`;

      return (
        <ListSmallCard
          value={filterValue.RouteName.Zh_tw}
          searchBy={data.searchBy}
          key={key}
          title={key}
          startEnd={startEnd}
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

const Main = (props) => {
  const mainSearchData = useSelector((state) => state.mainSearchData);
  return (
    <main className="main">
      <BusSearchSideBar />
      <div className="main__searchList">
        {renderMainSearchData(mainSearchData)}
      </div>
    </main>
  );
};

export default Main;
