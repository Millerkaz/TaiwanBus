import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UseDiv100 from "../../hook/useDiv100vh";
import { historyPush } from "../../helper";
import img from "../../img";

import Header from "../../components/header/header";
import ListSmall from "../../components/listSmall/listSmall";
import Footer from "../../components/footer/footer";

import "./routeChoicePage.scss";

const RouteChoicePage = (props) => {
  const stops = useSelector((state) => state.nearBusData);
  const height = UseDiv100();

  if (!stops[0]) {
    return (
      <div className="routeChoicePage" style={{ height: height }}>
        <div className="routeChoicePage__header">
          <Header />
          <p>
            <Link to="/">首頁</Link>
            {"  >  "}
            <Link to="/busMap">附近站點</Link>
            {"  >  "}
            <span>選擇公車路線</span>
          </p>
          <h1>選擇公車路線</h1>
        </div>
        <div className="btn--back">
          <img
            onClick={() => {
              // dispatch(action.clearTargetCreator());
              historyPush("/busMap");
            }}
            src={img.i_leftArrowW}
            alt="back"
          />
        </div>
        <Footer floatB={true} />
      </div>
    );
  }

  return (
    <div className="routeChoicePage" style={{ height: height }}>
      <div className="routeChoicePage__header">
        <Header />
        <p>
          <Link to="/">首頁</Link>
          {"  >  "}
          <Link to="/busMap">附近站點</Link>
          {"  >  "}
          <span>選擇公車路線</span>
        </p>
        <div className="btn--back">
          <img
            onClick={() => {
              // dispatch(action.clearTargetCreator());
              historyPush("/busMap");
            }}
            src={img.i_leftArrowW}
            alt="back"
          />
        </div>
        <h1>選擇公車路線</h1>
      </div>
      <ListSmall
        page="routeChoicePage"
        data={{
          city: props.match.params.city,
          stops: stops.find(
            (stop) => stop.StationUID === props.match.params.stationUID
          ).Stops,
        }}
      />
      <Footer floatB={true} />
    </div>
  );
};

export default RouteChoicePage;
