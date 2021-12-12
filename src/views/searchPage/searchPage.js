import React from "react";
import { Link } from "react-router-dom";
import UseDiv100 from "../../hook/useDiv100vh";
import useDeviceCheck from "../../hook/useDeviceCheck";

import Header from "../../components/header/header";
import UseRouteIDForm from "./useRouteIDForm/useRouteIDForm";
import RouteIDForm from "./useRouteIDForm/routeIDForm_noRedux";
import BusSearchList from "./busSearchList/busSearchList";
import Keyboard from "../../components/keyboard/keyboard";

import "./searchPage.scss";

const SearchPage = (props) => {
  const height = UseDiv100();
  const device = useDeviceCheck();

  return (
    <div className="searchPage" style={{ height: height }}>
      <div className="searchPage__header">
        <Header />
        <p>
          <Link to="/">首頁</Link>
          {"  >  "}
          <a>公車動態</a>
        </p>
        <UseRouteIDForm />
      </div>
      <div
        className="searchPage__container"
        style={
          device === "normal"
            ? { height: `${height - 255}px` }
            : { height: `${height - 315}px` }
        }
      >
        <BusSearchList />
        {device === "normal" && (
          <div className="searchPage__keyboard">
            <Keyboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
