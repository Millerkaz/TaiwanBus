import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import UseDiv100 from "../../hook/useDiv100vh";
import useDeviceCheck from "../../hook/useDeviceCheck";
import useInput from "../../hook/use-input";

import Header from "../../components/header/header";
import RouteIDForm from "./useRouteIDForm/routeIDForm_noRedux";
import BusSearchList from "./busSearchList/busSearchList";
import KeyboardNoRedux from "../../components/keyboard/keyboard_noRedux";

import "./searchPage.scss";

const routeNameValidation = (value) => {
  if (value.trim() === "") {
    return false;
  }

  return true;
};

const SearchPageNoRedux = (props) => {
  const { valueState: routeNameState, inputOnChange: routeNameChange } =
    useInput("", routeNameValidation);

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
        <RouteIDForm
          routeNameState={routeNameState}
          routeNameChange={routeNameChange}
        />
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
            <KeyboardNoRedux
              routeNameState={routeNameState}
              routeNameChange={routeNameChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPageNoRedux;
