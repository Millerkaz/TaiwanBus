import React from "react";
import { action } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { historyPush } from "../../../helper";
import { map } from "../../leafletMap/leafletMap";
import img from "../../../img";

import "./listSmallCard.scss";

const ListSmallCard = (props) => {
  const dispatch = useDispatch();
  // const selectRestaurant = useSelector((state) => state.selectRestaurant);

  // ${
  //   selectRestaurant === props.id ? "listSmallCard--active" : ""
  // }

  return (
    <div
      className={`listSmallCard`}
      data-id={`${props.StationID || `${props.routeUID}${props.direction}`}`}
      onClick={(e) => {
        historyPush(`/busMap/${props.data.city}/${props.routeName}`);
      }}
    >
      <div>
        <p className="listSmallCard__title">{props.title}</p>
        {props.startEnd && (
          <p className="listSmallCard__subTitle">
            {props.start}
            <img src={img.i_arrowsAltB} />
            {props.end}
          </p>
        )}
      </div>

      <div className="listSmallCard__favor">
        <img src={img.i_heartLine} />
        <p>{props.data.city}</p>
      </div>

      {/* {props.secondData && (
        <div className={`listSmallCard__subList hidden--subList`}>
          {props.secondData.map((each) => (
            <div>
              {each.StopAddress}
              {each.Bearing ? ` [向${each.Bearing}]` : ""}
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default ListSmallCard;
