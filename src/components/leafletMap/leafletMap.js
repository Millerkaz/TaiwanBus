import React, { useEffect, useRef, useState } from "react";
import Wkt from "wicket";
import { useDispatch, useSelector } from "react-redux";
import { action } from "../../store";
import img from "../../img";
import { historyPush } from "../../helper";
import Header from "../header/header";
import BtnBar from "../btnBar/btnBar";

import "./leafletMap.scss";
import "./icon.scss";

export let map;
export let myself = null;
export let myselfPosition;
let circle = null;

const wkt = new Wkt.Wkt();

const searchZoom = 10;
const pinZoom = 17;

let isFirstLocale = true;

export const listenMyselfPosition = (dispatch) => {
  const myselfMarker = window.L.icon();

  const geoConfirmHandler = (e) => {
    if (isFirstLocale) {
      map.setView(e.latlng, pinZoom);
      dispatch(action.fetchNearStopDataCreator(map.getCenter()));
      // dispatch(action.fetchRestaurantDataCreator(map.getCenter()));
      isFirstLocale = false;
    }
    if (myself) {
      map.removeLayer(myself);
    }
    if (circle) {
      map.removeLayer(circle);
    }

    circle = window.L.circle(e.latlng, {
      color: "#FBD148",
      fillColor: "#FFE652",
      fillOpacity: 0.1,
      radius: 500,
    });
    circle.addTo(map);
    myselfPosition = e.latlng;
    myself = window.L.marker(e.latlng);
    myself.bindPopup(``).addTo(map);
  };

  if (isFirstLocale) {
    map.locate({
      // setView: true,
      watch: true,
      maxZoom: 18,
      enableHighAccuracy: true,
      timeout: 10000,
    });

    map.on("locationfound", geoConfirmHandler);
  }
};

const mapBuild = () => {
  map = window.L.map("map", { minZoom: 8 }).setView([23.8, 121], 8);

  window.L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution: `
    &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
  }).addTo(map);

  // window.L.tileLayer(
  //   `https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=${process.env.REACT_APP_LEAFLET_KEY}`,
  //   {}
  // ).addTo(map);

  // map.attributionControl.addAttribution(
  //   '<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors'
  // );

  // listenMyselfPosition(dispatch);

  // const geoDenyHandler = () => {
  //   init = true;
  //   map.setView([25.037850742582183, 121.54882907867433], 18);
  //   myself = window.L.marker([25.037850742582183, 121.54882907867433]);
  //   myself.addTo(map);
  // };

  // map.on("locationerror", geoDenyHandler);
};

// const renderStationDetail = (station) => {
//   return `
//   <div class="detailCard">
//     <h3 class="detailCard__title">${station.name.tw[1]}</h3>
//     <span class="detailCard__address">${station.address.Zh_tw}</span>
//     <span class="detailCard__type">${station.name.tw[0]}</span>
//     <div class="detailCard__bike">
//       <h1>${station.canRentBikes}</h1>
//       <h1>${station.needReturnBikes}</h1>
//       <span>可借</span>
//       <span>可還</span>
//     </div>
//     <button class="btn btn--detailCard" data-lat=${station.coords.lat} data-lng=${station.coords.lng}>搜尋附近美食</button>
//   </div>
//   `;
// };

// const renderRestaurantDetail = (shop) => {
//   return `
//   <div class="detailCard">
//     <div class="detailCard__img">
//       <img src=${shop.url ? shop.url : img.fakeRestaurant} alt=${
//     shop.alt || "NO PICTURE"
//   } onError="()=>{${img.fakeRestaurant}}"/>
//     </div>
//     <h3 class="detailCard__title">${shop.title}</h3>
//     <span class="detailCard__address">${shop.address}</span>
//     <span class="detailCard__type">${shop.open}</span>
//   </div>
//   `;
// };

// const mergeBikeData = (bikeDataFromState) => {
//   return bikeDataFromState.bikeAvailableData.map((station, i) => {
//     if (station.StationUID !== bikeDataFromState.bikeData[i].StationUID) return;

//     return {

// };

/////////////////////////////////////////////////////////////////////////////////////////

const LeafletMap = ({ hideStop }) => {
  const shape = useSelector((state) => state.targetBusRenderData?.routeShape);
  const busPosition = useSelector(
    (state) => state.targetBusRenderData.busPosition
  );
  const routeDirection = useSelector((state) => state.routeDirection);
  const routeStops = useSelector(
    (state) => state.targetBusRenderData.routeStops
  );
  const stopIndex = useSelector((state) => state.stopIndex);

  const busLine = useRef(null);
  const stopMarksArray = useRef(null);
  const stopOnMapGroup = useRef(null);
  const busMarkArray = useRef(null);
  const busOnMapGroup = useRef(null);

  // 初始化 : 建立MAP
  useEffect(() => {
    mapBuild();
    if (myselfPosition) {
      map.setView(myselfPosition, 16);
    }

    return () => {};
  }, []);

  //監聽 rerender : 公車實體線、行徑方向改變
  useEffect(() => {
    if (!shape) {
      return;
    }

    if (busLine.current) {
      map.removeLayer(busLine.current);
    }

    wkt.read(shape[0].Geometry);
    // console.log(wkt.toJson());

    if (routeDirection === "0") {
      busLine.current = window.L.geoJSON(wkt.toJson(), {
        style: function () {
          return {
            color: "#5D9FFF",
          };
        },
      }).addTo(map);
    }

    if (routeDirection === "1") {
      busLine.current = window.L.geoJSON(wkt.toJson(), {
        style: function () {
          return {
            color: "#f43b47",
          };
        },
      }).addTo(map);
    }

    busLine.current.addData(wkt.toJson());

    map.flyToBounds(busLine.current.getBounds());
  }, [shape, routeDirection]);

  //監聽 rerender : 公車站牌位置、行徑方向改變
  useEffect(() => {
    if (!routeStops) return;

    if (stopOnMapGroup.current) {
      map.removeLayer(stopOnMapGroup.current);
    }

    const stopPositionArray = routeStops[Number(routeDirection)].Stops.map(
      (stopObj) => {
        return {
          coords: {
            lat: stopObj.StopPosition.PositionLat,
            lng: stopObj.StopPosition.PositionLon,
          },
          stopName: stopObj.StopName.Zh_tw,
        };
      }
    );

    if (routeDirection === "0") {
      stopMarksArray.current = stopPositionArray.map((stop) => {
        return window.L.marker(stop.coords, {
          icon: window.L.icon({
            iconUrl: img.i_stopIcon0,
            className: "icon--stop",
          }),
        }).bindPopup(stop.stopName, {
          className: "popup--stop",
        });
      });
    }

    if (routeDirection === "1") {
      stopMarksArray.current = stopPositionArray.map((stop) => {
        return window.L.marker(stop.coords, {
          icon: window.L.icon({
            iconUrl: img.i_stopIcon1,
            className: "icon--stop",
          }),
        }).bindPopup(stop.stopName, {
          className: "popup--stop",
        });
      });
    }

    stopOnMapGroup.current = window.L.layerGroup(stopMarksArray.current);

    if (hideStop) return;

    map.addLayer(stopOnMapGroup.current);

    // console.log(StopPosition);
  }, [routeStops, routeDirection]);

  //監聽 rerender : 是否隱藏地圖上站牌圖標
  useEffect(() => {
    if (!stopOnMapGroup.current) return;

    map.removeLayer(stopOnMapGroup.current);

    if (!hideStop) {
      map.addLayer(stopOnMapGroup.current);
    }
  }, [hideStop]);

  //監聽 rerender : 公車位置、行徑方向改變
  useEffect(() => {
    if (!busPosition) return;

    if (busOnMapGroup.current) {
      map.removeLayer(busOnMapGroup.current);
    }

    busMarkArray.current = busPosition[Number(routeDirection)].map((bus) => {
      return window.L.marker(bus.coords, {
        icon: window.L.icon({
          iconUrl: img.i_busPosition,
          className: "icon--bus",
        }),
      });
    });

    busOnMapGroup.current = window.L.layerGroup(busMarkArray.current);
    map.addLayer(busOnMapGroup.current);
  }, [busPosition, routeDirection]);

  //點擊站牌後移動到 MARK 位置
  useEffect(() => {
    if (!stopIndex && stopIndex !== 0) return;

    if (!stopMarksArray.current) return;

    stopMarksArray.current[stopIndex[0]].openPopup();
    map.flyTo(stopMarksArray.current[stopIndex[0]].getLatLng(), 18);
  }, [stopIndex]);

  return <div id="map" className="map"></div>;
};

export default LeafletMap;

// <React.Fragment>
{
  /* <div className="leaflet__header">
        <Header />
        {target && (
          <div className="leaflet__header--title">
            <img
              style={{ cursor: "pointer" }}
              alt="back"
              src={img.i_leftArrowB}
              onClick={() => {
                historyPush("/searchBus");
              }}
            />
            <p>{`${target.routeName} 路線圖`}</p>
          </div>
        )}
        <div className="leaflet__icons">
          <div
            className="leaflet__icons--switch"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setHideStop((pre) => !pre);
            }}
          >
            <p>顯示站點</p>
            {hideStop ? (
              <img src={img.swithBtnOff} alt="closePoint" />
            ) : (
              <img src={img.swithBtnOn} alt="openPoint" />
            )}
          </div>
          {props.location.pathname === "/busMap" && (
            <BtnBar className="leaflet__icons--position" />
          )}
        </div>
      </div> */
}

// <div id="map" className="map"></div>
{
  /* </React.Fragment> */
}
