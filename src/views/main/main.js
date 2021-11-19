import React from "react";
import { useSelector } from "react-redux";
import BusSearchSideBar from "../busSearchSideBar/busSearchSideBar";
import ListSmallCard from "../../components/card/listSmallCard/listSmallCard";
import "./main.scss";

const renderMainSearchData = (data) => {
  if (data.searchBy === "route") {
    return data.data.map((eachRoute, index) => (
      <ListSmallCard
        searchBy={data.searchBy}
        key={`${eachRoute.routeUID}${eachRoute.direction}`}
        index={index}
        {...eachRoute}
      />
    ));
  }

  if (data.searchBy === "stop") {
    console.log(data.data);
    return data.data.map((eachRoute, index) => {
      if (eachRoute.length === 0) {
        return;
      }

      return (
        <ListSmallCard
          searchBy={data.searchBy}
          key={`${eachRoute[0].StationID}`}
          index={index}
          secondData={eachRoute}
          {...eachRoute[0]}
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
