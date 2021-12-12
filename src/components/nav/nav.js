import React from "react";
import ReactDOM from "react-dom";
import { map, myselfPosition } from "../leafletMap/leafletMap";
import { Link } from "react-router-dom";
import "./nav.scss";

// 手機板專用浮動navigation

const Nav = (props) => {
  return ReactDOM.createPortal(
    <nav className={`${!props.hide ? "" : "header--hidden"}`}>
      <div className="nav__container">
        <input type="checkbox" className="nav__hack" id="hack" />
        <label htmlFor="hack" className={`nav__click`}>
          <span
            className={`nav__hamburger ${
              props.color === "black" && !props.hide ? `hamburger--B` : ``
            }`}
          ></span>
        </label>
        <div className={`nav__bg`}></div>
        <ul className="nav__list">
          <li className="nav__item">
            <Link to="/searchBus" className="nav__link">
              公車動態
            </Link>
          </li>
          <li className="nav__item">
            <Link
              to="/busMap"
              className="nav__link"
              onClick={() => {
                if (myselfPosition) {
                  map.setView(myselfPosition, 16);
                }
              }}
            >
              附近站點
            </Link>
          </li>
          <li className="nav__item">
            <Link to="/favorite/route" className="nav__link">
              我的路段
            </Link>
          </li>
          <li className="nav__item">
            <Link to="/favorite/stop" className="nav__link">
              我的站牌
            </Link>
          </li>
        </ul>
      </div>
    </nav>,
    document.querySelector("#root")
  );
};

export default Nav;
