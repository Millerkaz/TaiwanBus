import React, { useState, useEffect, useCallback } from "react";
import { change } from "redux-form";
import { useDispatch } from "react-redux";
import Btn from "../btn";
import img from "../../img";
import "./keyboard.scss";

const btnClickHandler = (e) => {};

const Keyboard = (props) => {
  const [value, setValue] = useState([]);
  const [hideKeyboard, setHideKeyboard] = useState(false);
  const dispatch = useDispatch();

  const btnClickHandler = (e) => {
    setValue((pre) => {
      return [...pre, e.target.textContent];
    });
  };

  useEffect(() => {
    dispatch(change("useRouteIDForm", "term", value.join("")));
    console.log(value.join(""));
  }, [value]);

  return (
    <div className={`keyboard`}>
      <div
        className={`keyboard__arrow`}
        onClick={() => {
          setHideKeyboard((pre) => !pre);
        }}
      >
        <img
          className={`${hideKeyboard ? "rotate" : ""}`}
          src={img.i_arrowD}
          alt="arrow"
        />
      </div>
      <ul className={`${hideKeyboard ? "hidden--keyboard" : ""}`}>
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
          幹線
        </li>
        <li
          className="btn btn--keyboard"
          onClick={() => {
            setValue([]);
          }}
        >
          C
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          0
        </li>
        <li
          className="btn btn--keyboard"
          onClick={() => {
            setValue((pre) => {
              return pre.slice(0, pre.length - 1);
            });
          }}
        >
          <img src={img.i_backspace} alt="backSpace" />
        </li>
      </ul>
    </div>
  );
};

export default Keyboard;
