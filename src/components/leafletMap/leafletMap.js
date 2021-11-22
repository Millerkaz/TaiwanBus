import React, { useEffect, useRef, useState } from "react";
import Wkt from "wicket";

import { PTX } from "../../API";
import { useDispatch, useSelector } from "react-redux";
import { action } from "../../store";
import img from "../../img";

import Header from "../header/header";
import Btn from "../btn";
// import img from "../../img";
import "./leafletMap.scss";
import "./icon.scss";

export let map;
export let myself = null;
export let myselfPosition;

const wkt = new Wkt.Wkt();

const searchZoom = 10;
const pinZoom = 17;

let isFirstLocale = true;

// export const listenMyselfPosition = (dispatch) => {
//   const myselfMarker = window.L.icon({
//     iconUrl: myself_img,
//     className: "icon--myself",
//   });

//   const geoConfirmHandler = (e) => {
//     if (isFirstLocale) {
//       map.setView(e.latlng, pinZoom);
//       dispatch(action.fetchNearBikeDataCreator(map.getCenter()));
//       dispatch(action.fetchRestaurantDataCreator(map.getCenter()));
//       isFirstLocale = false;
//     }
//     if (myself) {
//       map.removeLayer(myself);
//       // console.log("remove");
//     }

//     myselfPosition = e.latlng;
//     myself = window.L.marker(e.latlng, { icon: myselfMarker });
//     myself
//       .bindPopup(
//         `
//     <div class="detailCard">
//       <button class="btn btn--detailCard" data-lat=${e.latlng.lat} data-lng=${e.latlng.lng}>搜尋附近美食</button>
//     </div>
//     `
//       )
//       .addTo(map);
//   };

//   map.locate({
//     // setView: true, // 是否讓地圖跟著移動中心點
//     watch: true, // 是否要一直監測使用者位置
//     maxZoom: 18, // 最大的縮放值
//     enableHighAccuracy: true, // 是否要高精準度的抓位置
//     timeout: 10000, // 觸發locationerror事件之前等待的毫秒數
//   });

//   map.on("locationfound", geoConfirmHandler);
// };

const mapBuild = () => {
  map = window.L.map("map").setView([24, 121], 8);

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
//       UID: station.StationUID,
//       canRentBikes: station.AvailableRentBikes,
//       needReturnBikes: station.AvailableReturnBikes,
//       coords: {
//         lat: bikeDataFromState.bikeData[i].StationPosition.PositionLat,
//         lng: bikeDataFromState.bikeData[i].StationPosition.PositionLon,
//       },
//       name: {
//         tw: bikeDataFromState.bikeData[i].StationName.Zh_tw.split("_"),
//         en: bikeDataFromState.bikeData[i].StationName.En.split("_"),
//       },
//       address: bikeDataFromState.bikeData[i].StationAddress,
//     };
//   });
// };

/////////////////////////////////////////////////////////////////////////////////////////

const LeafletMap = (props) => {
  const [hideStop, setHideStop] = useState(false);

  const target = useSelector((state) => state.targetBusRenderData.target);
  const shape = useSelector((state) => state.targetBusRenderData?.routeShape);
  const routeDirection = useSelector((state) => state.routeDirection);
  const routeStops = useSelector(
    (state) => state.targetBusRenderData.routeStops
  );

  const busLine = useRef(null);
  const positionPointGroup = useRef(null);
  const positionLayer = useRef(null);
  const searchBikeMarksGroup = useRef(null);

  useEffect(() => {
    mapBuild();

    // const detailCardClickHandler = (e) => {
    //   if (e.target.closest(".btn--detailCard")) {
    //     const coords = {
    //       lat: +e.target.dataset.lat,
    //       lng: +e.target.dataset.lng,
    //     };

    //     map.setView(coords, 16);

    //     dispatch(action.fetchRestaurantDataCreator(coords));
    //   }
    // };

    // document
    //   .querySelector(".map")
    //   .addEventListener("click", detailCardClickHandler);

    return () => {
      // console.log("remove");
      // document
      //   .querySelector(".map")
      //   .removeEventListener("click", detailCardClickHandler);
    };
  }, []);

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
            color: "#FFBAC3",
          };
        },
      }).addTo(map);
    }

    busLine.current.addData(wkt.toJson());

    map.flyToBounds(busLine.current.getBounds());
  }, [shape, routeDirection]);

  useEffect(() => {
    if (!routeStops) return;

    if (positionLayer.current) {
      map.removeLayer(positionLayer.current);
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
      positionPointGroup.current = stopPositionArray.map((stop) => {
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
      positionPointGroup.current = stopPositionArray.map((stop) => {
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

    positionLayer.current = window.L.layerGroup(positionPointGroup.current);
    map.addLayer(positionLayer.current);

    // console.log(StopPosition);
  }, [routeStops, routeDirection]);

  useEffect(() => {
    if (!hideStop && positionLayer.current) {
      map.removeLayer(positionLayer.current);
      return;
    }

    if (hideStop && positionLayer.current) {
      map.addLayer(positionLayer.current);
      return;
    }
  }, [hideStop, routeDirection]);

  return (
    <React.Fragment>
      <div className="leaflet__header">
        <Header />
        {target && <div>{`${target.routeName} 路線圖`}</div>}
        <button
          onClick={() => {
            setHideStop((pre) => !pre);
          }}
        >
          123
        </button>
      </div>

      <div id="map" class="map"></div>
    </React.Fragment>
  );
};

export default LeafletMap;
