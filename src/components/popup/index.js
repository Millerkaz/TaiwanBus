import React from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import history from "../../helper/history";

import { action } from "../../store";

import "./popup.scss";

const Popup = (props) => {
  const dispatch = useDispatch();
  const isWindowShow = useSelector((state) => state.popWindow.show);

  return (
    <React.Fragment>
      <div>close</div>
      <div
        className={`popup__container  ${isWindowShow ? "" : "popup__hidden"}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {props.children}
      </div>
    </React.Fragment>
  );
};

export default Popup;
