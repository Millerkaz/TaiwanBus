import React from "react";
import "./dropdown.scss";

const Dropdown = (props) => {
  return (
    <div className={`dropdown ${props.className || ""}`}>
      <h1>北部地區</h1>
      <ul className="dropdown__north">
        <li
          className="btn btn--dropdown"
          value="臺北市"
          onClick={props.onClick}
        >
          臺北市
        </li>
        <li
          className="btn btn--dropdown"
          value="新北市"
          onClick={props.onClick}
        >
          新北市
        </li>
        <li
          className="btn btn--dropdown"
          value="基隆市"
          onClick={props.onClick}
        >
          基隆市
        </li>
        <li
          className="btn btn--dropdown"
          value="宜蘭縣"
          onClick={props.onClick}
        >
          宜蘭縣
        </li>
        <li
          className="btn btn--dropdown"
          value="桃園市"
          onClick={props.onClick}
        >
          桃園市
        </li>
        <li
          className="btn btn--dropdown"
          value="新竹市"
          onClick={props.onClick}
        >
          新竹市
        </li>
        <li
          className="btn btn--dropdown"
          value="新竹縣"
          onClick={props.onClick}
        >
          新竹縣
        </li>
      </ul>
      <h1>中部地區</h1>
      <ul className="dropdown__west">
        <li
          className="btn btn--dropdown"
          value="苗栗縣"
          onClick={props.onClick}
        >
          苗栗縣
        </li>
        <li
          className="btn btn--dropdown"
          value="臺中市"
          onClick={props.onClick}
        >
          臺中市
        </li>
        <li
          className="btn btn--dropdown"
          value="彰化縣"
          onClick={props.onClick}
        >
          彰化縣
        </li>
        <li
          className="btn btn--dropdown"
          value="南投縣"
          onClick={props.onClick}
        >
          南投縣
        </li>
        <li
          className="btn btn--dropdown"
          value="雲林縣"
          onClick={props.onClick}
        >
          雲林縣
        </li>
      </ul>
      <h1>南部地區</h1>
      <ul className="dropdown__south">
        <li
          className="btn btn--dropdown"
          value="嘉義縣"
          onClick={props.onClick}
        >
          嘉義縣
        </li>
        <li
          className="btn btn--dropdown"
          value="嘉義市"
          onClick={props.onClick}
        >
          嘉義市
        </li>
        <li
          className="btn btn--dropdown"
          value="臺南市"
          onClick={props.onClick}
        >
          臺南市
        </li>
        <li
          className="btn btn--dropdown"
          value="高雄市"
          onClick={props.onClick}
        >
          高雄市
        </li>
        <li
          className="btn btn--dropdown"
          value="屏東縣"
          onClick={props.onClick}
        >
          屏東縣
        </li>
      </ul>
      <h1>東部地區</h1>
      <ul className="dropdown__east">
        <li
          className="btn btn--dropdown"
          value="花蓮縣"
          onClick={props.onClick}
        >
          花蓮縣
        </li>
        <li
          className="btn btn--dropdown"
          value="臺東縣"
          onClick={props.onClick}
        >
          臺東縣
        </li>
      </ul>
      <h1>離島地區</h1>
      <ul className="dropdown__island">
        <li
          className="btn btn--dropdown"
          value="澎湖縣"
          onClick={props.onClick}
        >
          澎湖縣
        </li>
        <li
          className="btn btn--dropdown"
          value="金門縣"
          onClick={props.onClick}
        >
          金門縣
        </li>
        <li
          className="btn btn--dropdown"
          value="連江縣"
          onClick={props.onClick}
        >
          連江縣
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;
