import React from "react";
import { Link } from "react-router-dom";
import Nav from "../nav/nav";
import img from "../../img";
import useDeviceCheck from "../../hook/useDeviceCheck";
import { historyPush } from "../../helper";
import "./header.scss";

/**
 *Header
 * props:
 * @className 哪個頁面的小卡 ("string" : stop,route,near,choice)
 * @color ("black" 為黑底header)
 */

const Header = (props) => {
  const device = useDeviceCheck();

  if (device === "normal") {
    return (
      <header className={`header ${props.className || ""}`}>
        <img
          className={
            props.color === "black" ? `header-B__logo ` : `header__logo`
          }
          src={props.color === "black" ? img.logoB : img.logo}
          alt="logo"
          onClick={() => {
            historyPush("/");
          }}
        />
        <ul
          className={
            props.color === "black" ? `header-B__navBar ` : `header__navBar`
          }
        >
          <Link to="/searchBus">公車動態</Link>
          <Link to="/busMap">附近站點</Link>
          <Link to="/favorite/route">我的路段</Link>
          <Link to="/favorite/stop">我的站牌</Link>
        </ul>
      </header>
    );
  }

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
export default React.memo(Header);
