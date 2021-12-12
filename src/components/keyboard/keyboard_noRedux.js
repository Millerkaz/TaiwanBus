import React, { useState, useEffect, useRef } from "react";
import { change } from "redux-form";
import { useDispatch, useSelector } from "react-redux";
import img from "../../img";
import "./keyboard.scss";

const KeyboardNoRedux = ({ routeNameState, routeNameChange }) => {
  const btnClickHandler = (e) => {
    let currentValueArray = routeNameState.value.split("");
    currentValueArray.push(e.target.textContent);
    routeNameChange(currentValueArray.join(""));
  };

  const clickClearHandler = () => {
    routeNameChange("");
  };

  const clickBackSpaceHandler = () => {
    let currentValueArray = routeNameState.value.split("");
    currentValueArray = currentValueArray.slice(
      0,
      currentValueArray.length - 1
    );

    routeNameChange(currentValueArray.join(""));
  };

  return (
    <div className={`keyboard`}>
      <ul className={``}>
        <li
          className="btn btn--keyboard"
          style={{ backgroundColor: `#DE6868`, color: "white" }}
          onClick={btnClickHandler}
        >
          紅
        </li>
        <li
          className="btn btn--keyboard"
          style={{ backgroundColor: `#5274CD`, color: "white" }}
          onClick={btnClickHandler}
        >
          藍
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          1
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          2
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          3
        </li>
        <li
          className="btn btn--keyboard"
          style={{ backgroundColor: `#B29076`, color: "white" }}
          onClick={btnClickHandler}
        >
          棕
        </li>
        <li
          className="btn btn--keyboard"
          style={{ backgroundColor: `#83C986`, color: "white" }}
          onClick={btnClickHandler}
        >
          綠
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          4
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          5
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          6
        </li>
        <li
          className="btn btn--keyboard"
          style={{ backgroundColor: `#EDBE62`, color: "white" }}
          onClick={btnClickHandler}
        >
          黃
        </li>
        <li
          className="btn btn--keyboard"
          style={{ backgroundColor: `#E88C59`, color: "white" }}
          onClick={btnClickHandler}
        >
          橘
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          7
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          8
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          9
        </li>
        <li
          className="btn btn--keyboard"
          style={{
            backgroundColor: `#FFFFFF`,
            border: "1px solid #8B94B2",
            color: "#4C546A",
          }}
          onClick={btnClickHandler}
        >
          F
        </li>
        <li
          style={{ backgroundColor: `#B1B4BE`, color: "white" }}
          className="btn btn--keyboard"
          onClick={btnClickHandler}
        >
          L
        </li>
        <li className="btn btn--keyboard" onClick={clickClearHandler}>
          C
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          0
        </li>
        <li className="btn btn--keyboard" onClick={clickBackSpaceHandler}>
          <img src={img.i_backspace} alt="backSpace" />
        </li>
      </ul>
    </div>
  );
};

export default KeyboardNoRedux;
