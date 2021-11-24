import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { local } from "../../../helper";
import ListSmallCard from "../../../components/card/listSmallCard/listSmallCard";
import TargetBusDetail from "../../targetBusDetail/targetBusDetail";
import "./favoriteList.scss";
import img from "../../../img";

const renderMainSearchData = (page, data) => {
  // console.log(data);
  if (page === "route") {
    return Object.values(data[page]).map((obj) => {
      return (
        <ListSmallCard
          routeName={obj.routeName}
          routeUID={obj.routeUID}
          key={obj.routeUID}
          start={obj.start}
          end={obj.end}
          data={{ city: obj.city }}
        />
      );
    });
  }

  if (page === "stop") {
    // console.log(Object.entries(data[page]));
    return Object.entries(data[page]).map(([key, value]) => {
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

const FavoriteList = (props) => {
  const [height, setHeight] = useState(window.innerHeight);
  const [init, setInit] = useState(false);

  const localData = useRef();

  useEffect(() => {
    const heighCheck = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", heighCheck);

    return () => {
      window.removeEventListener("resize", heighCheck);
    };
  }, []);

  useEffect(() => {
    // console.log(init);
    let data = { route: local.getLocal("route") };
    localData.current = data;
    setInit(true);
    // console.log(localData.current);
  });

  return (
    <div className="favoriteList" style={{ height: `${height - 200}px` }}>
      {localData.current && renderMainSearchData("route", localData.current)}
    </div>
  );
};

export default FavoriteList;
