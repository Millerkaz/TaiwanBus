import React, { useState, useEffect, useCallback } from "react";
import { change } from "redux-form";
import { useDispatch } from "react-redux";
import Btn from "../btn";
import "./keyboard.scss";

const btnClickHandler = (e) => {};

const Keyboard = (props) => {
  const [value, setValue] = useState([]);

  const btnClickHandler = (e) => {
    setValue((pre) => {
      return [...pre, e.target.textContent];
    });
  };

  useEffect(() => {
    console.log(value.join(""));
  }, [value]);

  return (
    <div className="keyboard">
      <ul>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          紅
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
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
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          棕
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
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
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          黃
        </li>
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
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
        <li className="btn btn--keyboard" onClick={btnClickHandler}>
          幹線
        </li>
        <li
          className="btn btn--keyboard"
          onClick={() => {
            console.log("more");
          }}
        >
          更多
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
          {"<"}
        </li>
      </ul>
    </div>
  );
};

export default Keyboard;
