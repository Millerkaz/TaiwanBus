import React from "react";
import img from "../../img";
import { historyPush } from "../../helper";
import "./header.scss";

const Header = (props) => {
  return (
    <header className="header">
      <img className="header__menu" src={img.i_menuW} alt="menu" />
      <img
        className="header__logo"
        src={img.logo}
        alt="logo"
        onClick={() => {
          historyPush("/");
        }}
      />
    </header>
  );
};
export default Header;
