import React, { useEffect } from "react";
import UseDiv100 from "../../hook/useDiv100vh";
import useDeviceCheck from "../../hook/useDeviceCheck";
import { historyPush } from "../../helper";
import { map, myselfPosition } from "../../components/leafletMap/leafletMap";
import img from "../../img";

import Footer from "../../components/footer/footer";

import "./home.scss";

const Home = (props) => {
  const device = useDeviceCheck();
  const height = UseDiv100();

  useEffect(() => {
    if (device === "normal") {
      document.querySelector("#bg").src = img.bg;
    }

    if (device !== "normal") {
      document.querySelector("#bg").src = img.bgMobile;
    }
  }, [device]);

  return (
    <div className="home" style={{ height: height }}>
      <div className="home__title">
        <img src={img.logo} className="home__title--main" />
        <h3 className="home__title--sub bb">全台公車動態時刻查詢網</h3>
        <div class="wrapper">
          <div class="border"></div>
          <div class="main-element"></div>
        </div>
      </div>
      <div className="home__bottom">
        <ul className="home__nav">
          <li
            onClick={() => {
              historyPush("/searchBus");
            }}
          >
            <div className="cc">
              <img src={img.i_busW} alt="bus" />
              <div class="circle five" id="five"></div>
              <div class="circle four" id="four"></div>
              <div class="circle three" id="three"></div>
              <div class="circle two" id="two"></div>
              <div class="circle one" id="one"></div>
            </div>
            <p>動態查詢</p>
          </li>
          <li
            onClick={() => {
              historyPush("/busMap");
              if (myselfPosition) {
                map.setView(myselfPosition, 16);
              }
            }}
          >
            <div className="cc">
              <img src={img.i_locate} alt="bus" />
              <div class="circle five" id="five"></div>
              <div class="circle four" id="four"></div>
              <div class="circle three" id="three"></div>
              <div class="circle two" id="two"></div>
              <div class="circle one" id="one"></div>
            </div>
            <p>附近站點</p>
          </li>
          <li
            onClick={() => {
              historyPush("/favorite/route");
            }}
          >
            <div className="cc">
              <img src={img.i_ticket} alt="bus" />
              <div class="circle five" id="five"></div>
              <div class="circle four" id="four"></div>
              <div class="circle three" id="three"></div>
              <div class="circle two" id="two"></div>
              <div class="circle one" id="one"></div>
            </div>
            <p>我的路段</p>
          </li>
          <li
            onClick={() => {
              historyPush("/favorite/stop");
            }}
          >
            <div className="cc">
              <img src={img.i_direction} alt="bus" />
              <div class="circle five" id="five"></div>
              <div class="circle four" id="four"></div>
              <div class="circle three" id="three"></div>
              <div class="circle two" id="two"></div>
              <div class="circle one" id="one"></div>
            </div>

            <p>我的站牌</p>
          </li>
        </ul>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
