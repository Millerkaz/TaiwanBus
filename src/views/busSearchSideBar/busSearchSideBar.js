import React, { useState, useMemo } from "react";
import Btn from "../../components/btn";
import { useDispatch, useSelector } from "react-redux";
import { city } from "../../helper";
import UseRouteIDForm from "./useRouteIDForm/useRouteIDForm";
import UseStopNameForm from "./useStopNameForm/useStopNameForm";

import "./busSearchSideBar.scss";
import { action } from "../../store";

const BusSearchSideBar = (props) => {
  const dispatch = useDispatch();

  return (
    <div className="busSearchSideBar">
      <UseRouteIDForm />
      <UseStopNameForm />
    </div>
  );
};

export default BusSearchSideBar;
