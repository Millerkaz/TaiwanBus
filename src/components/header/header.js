import React from "react";
import Nav from "../nav/nav";
import img from "../../img";
import { historyPush } from "../../helper";
import "./header.scss";

const Header = (props) => {
  return (
    <header className={`header ${props.className || ""}`}>
      <Nav color={props.color === "black" ? `black` : ``} hide={props.hide} />
      <div></div>
      <img
        className={props.color === "black" ? `header-B__logo ` : `header__logo`}
        src={props.color === "black" ? img.logoB : img.logo}
        alt="logo"
        onClick={() => {
          historyPush("/");
        }}
      />
    </header>
  );
};
export default Header;
