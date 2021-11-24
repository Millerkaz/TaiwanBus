import React from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import history from "../../helper/history";

import { action } from "../../store";

import "./popup.scss";

const Popup = (props) => {
  return ReactDOM.createPortal(
    <div
      className={`popup__overlay ${props.isPopupOpen ? "" : "hidden--popup"}`}
      onClick={props.popUpOpenHandler}
    >
      <div
        className={`popup__container--${
          props.isPopupOpen === "add" ? "bottom" : "middle"
        }`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {props.children}
      </div>
    </div>,
    document.querySelector("#root")
  );
};

export default Popup;
