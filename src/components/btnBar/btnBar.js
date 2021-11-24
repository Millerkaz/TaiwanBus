import React from "react";
import Btn from "../btn";
import { useSelector, useDispatch } from "react-redux";
import {
  myselfPosition,
  map,
  listenMyselfPosition,
} from "../leafletMap/leafletMap";
import { action } from "../../store";
import history from "../../helper/history";

import img from "../../img";

const BtnBar = (props) => {
  const dispatch = useDispatch();

  return (
    <div className={props.className}>
      <Btn
        onClick={() => {
          if (!myselfPosition) {
            alert("請開啟定位");
            return;
          }

          map.flyTo(myselfPosition, 16);
        }}
        color="location"
      >
        <img src={img.i_person} />
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
