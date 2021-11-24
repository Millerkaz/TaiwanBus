import React from "react";
import Footer from "../../components/footer/footer";
import { map, myselfPosition } from "../../components/leafletMap/leafletMap";
import img from "../../img";
import { historyPush } from "../../helper";

import "./home.scss";
const Home = (props) => {
  return (
    <div className="home">
      <img src={img.bgMobile} />
      <div className="home__title">
        <img src={img.logo} className="home__title--main" />
        <h3 className="home__title--sub">全台公車動態時刻查詢網</h3>
      </div>
      <div>
        <ul className="home__nav">
          <li
            onClick={() => {
              historyPush("/searchBus");
            }}
          >
            <div className="btn btn--icon">
              <img src={img.i_busW} alt="bus" />
            </div>
            <p>公車動態</p>
          </li>
          <li
            onClick={() => {
              historyPush("/busMap");
              if (myselfPosition) {
                map.setView(myselfPosition, 16);
              }
            }}
          >
            <div className="btn btn--icon">
              <img src={img.i_locate} alt="locate" />
            </div>
            <p>附近站點</p>
          </li>
          <li>
            <div className="btn btn--icon">
              <img src={img.i_time} alt="time" />
            </div>

            <p>班表查詢</p>
          </li>
          <li
            onClick={() => {
              historyPush("/favorite");
            }}
          >
            <div className="btn btn--icon">
              <img src={img.i_heartW} alt="favor" />
            </div>

            <p>我的最愛</p>
          </li>
        </ul>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
