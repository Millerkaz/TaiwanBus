import React from "react";
import Btn from "../btn";
import { useDispatch } from "react-redux";
import {
  myselfPosition,
  map,
  listenMyselfPosition,
} from "../leafletMap/leafletMap";
import { action } from "../../store";
import img from "../../img";

//主要用在地圖上的功能按鈕
const BtnBar = (props) => {
  const dispatch = useDispatch();

  return (
    <div className={props.className}>
      <Btn
        onClick={() => {
          if (!myselfPosition) {
            alert("「我的位置」功能需先啟用定位。");
            return;
          }

          map.flyTo(myselfPosition, 16);
        }}
        color="location"
      >
        <img src={img.i_person} alt="me" />
      </Btn>
      <Btn
        color="location"
        onClick={() => {
          if (myselfPosition) {
            map.setView(myselfPosition, 16);
            dispatch(action.fetchNearStopDataCreator(myselfPosition));
          }

          listenMyselfPosition(dispatch);
        }}
      >
        <img src={img.i_gps} alt="search" />
      </Btn>
    </div>
  );
};

export default BtnBar;
