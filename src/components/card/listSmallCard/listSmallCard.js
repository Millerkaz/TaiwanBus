import React from "react";
import { action } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { map } from "../../leafletMap/leafletMap";

import "./listSmallCard.scss";

const listClickHandler = (props, dispatch, searchBy) => {
  if (searchBy === "route") {
  }
  map.setView(props.coords, 18);
  // layer.openPopup(props.coords);
  document
    .querySelectorAll(".pin--restaurant")
    .forEach((ele) => ele.classList.remove("icon--active"));
  document
    .querySelector(`.pin--restaurant--${props.id}`)
    .classList.add("icon--active");
  dispatch(action.selectRestaurantCreator(props.id));
};

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
        listClickHandler(props, dispatch, props.searchBy);
      }}
    >
      <p className="listSmallCard__title">
        {props.routeName || props.StopName?.Zh_tw}
      </p>
      {/* <p className="listSmallCard__address">{props.address}</p> */}
      {/* <p className="listSmallCard__open">{props.open}</p> */}
      {props.startEnd && (
        <a className="listSmallCard__subTitle">{props.startEnd}</a>
      )}

      {props.secondData && (
        <div className={`listSmallCard__subList hidden--subList`}>
          {props.secondData.map((each) => (
            <div>
              {each.StopAddress}
              {each.Bearing ? ` [向${each.Bearing}]` : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListSmallCard;
