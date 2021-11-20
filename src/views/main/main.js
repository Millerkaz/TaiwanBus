import React from "react";
import { useSelector } from "react-redux";
import BusSearchSideBar from "../busSearchSideBar/busSearchSideBar";
import ListSmallCard from "../../components/card/listSmallCard/listSmallCard";
import "./main.scss";

const renderMainSearchData = (data) => {
  if (data.searchBy === "route") {
    return Object.entries(data.data).map(([key, value]) => {
      value = value.find((route) => route.Direction === 0);

      let startEnd = `${value.Stops[0].StopName.Zh_tw} <–> ${
        value.Stops[value.Stops.length - 1].StopName.Zh_tw
      }`;

      return (
        <ListSmallCard
          searchBy={data.searchBy}
          key={key}
          title={key}
          startEnd={startEnd}
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
