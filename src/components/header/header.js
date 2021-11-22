import React from "react";
import img from "../../img";
import { historyPush } from "../../helper";
import "./header.scss";

const Header = (props) => {
  if (props.color === "black") {
    return (
      <header className={`header header-B ${props.className || ""}`}>
        <img className="header-B__menu" src={img.i_menuB} alt="menu" />
        <img
          className="header-B__logo"
          src={img.logoB}
          alt="logo"
          onClick={() => {
            historyPush("/");
          }}
        />
      </header>
    );
  }

  return (
    <header className={`header ${props.className || ""}`}>
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
