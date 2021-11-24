import React, { useState } from "react";
import { Link } from "react-router-dom";
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
          <Link to="/">首頁</Link>
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
