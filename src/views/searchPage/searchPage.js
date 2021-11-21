import React, { useState } from "react";
import Header from "../../components/header/header";
import UseRouteIDForm from "./useRouteIDForm/useRouteIDForm";
import Keyboard from "../../components/keyboard/keyboard";
import BusSearchList from "./busSearchList/busSearchList";
import { useSelector } from "react-redux";

import "./searchPage.scss";

const SearchPage = (props) => {
  return (
    <div className="searchPage">
      <div className="searchPage__header">
        <Header />
        <p>
          <a>首頁</a>
          {"  >  "}
          <a>公車動態</a>
        </p>
        <UseRouteIDForm />
      </div>
      <BusSearchList />
      <div className="searchPage__keyboard">
        <Keyboard />
      </div>
    </div>
  );
};

export default SearchPage;
