import React, { useEffect, useRef, useState } from "react";
import Wkt from "wicket";
import { useSelector } from "react-redux";
import { action } from "../../store";
import img from "../../img";
import UseDiv100 from "../../hook/useDiv100vh";
import useDeviceCheck from "../../hook/useDeviceCheck";

import "./leafletMap.scss";
import "./icon.scss";

export let map;
export let myself = null;
export let myselfPosition;

const pinZoom = 17;
let circle = null;
let isFirstLocale = true;

const wkt = new Wkt.Wkt();

export const listenMyselfPosition = (dispatch) => {
  let yourPosition;
  const geoConfirmHandler = (e) => {
    if (isFirstLocale) {
      yourPosition = e.latlng;

      //fake
      // yourPosition = { lat: 25.1343511299213, lng: 121.80457448585939 };

      map.setView(yourPosition, pinZoom);
      dispatch(action.fetchNearStopDataCreator(yourPosition));
      // dispatch(action.fetchRestaurantDataCreator(map.getCenter()));
      isFirstLocale = false;
    }
    if (myself) {
      map.removeLayer(myself);
    }
    if (circle) {
      map.removeLayer(circle);
    }

    circle = window.L.circle(yourPosition, {
      color: "#FBD148",
      fillColor: "#FFE652",
      fillOpacity: 0.1,
      radius: 500,
    });
    circle.addTo(map);
    myselfPosition = yourPosition;
    myself = window.L.marker(yourPosition);
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

  // window.L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
  //   attribution: `
  //   &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
  // }).addTo(map);

  window.L.tileLayer(
    "https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=uxxK2Njo5PhdCpIFpwaHi3GWRrmfdyVpO79pXPbalf2clkVLsFTXk7AUPgsif0ys",
    {}
  ).addTo(map);

  map.attributionControl.addAttribution(
    '<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors'
  );
};

/////////////////////////////////////////////////////////////////////////////////////////

const LeafletMap = (props) => {
  const [hideStop, setHideStop] = useState(false);
  const shape = useSelector((state) => state.targetBusRenderData?.routeShape);
  const busPosition = useSelector(
    (state) => state.targetBusRenderData.busPosition
  );
  const routeDirection = useSelector((state) => state.routeDirection);
  const routeStops = useSelector(
    (state) => state.targetBusRenderData.routeStops
  );
  const stopIndex = useSelector((state) => state.stopIndex);
  const height = UseDiv100();
  const device = useDeviceCheck();
  const busLine = useRef(null);
  const stopMarksArray = useRef(null);
  const stopOnMapGroup = useRef(null);
  const busMarkArray = useRef(null);
  const busOnMapGroup = useRef(null);
  const nearMarksArray = useRef(null);
  const nearMarksOnMapGroup = useRef(null);

  const decideHeight = () => {
    if (device === "normal" && props.page === "near") {
      return { height: height - 53 + "px" };
    }

    if (device === "normal") {
      {
        return { height: height - 305 + "px" };
      }
    }

    return { height: height + "px" };
  };

  /////////////////////////////////////////////////////////////////////////////////////////

  // 初始化 : 建立MAP
  useEffect(() => {
    mapBuild();
    if (myselfPosition) {
      map.setView(myselfPosition, 16);
    }

    // const heighCheck = () => {
    //   setHeight(window.innerHeight);
    // };
    // window.addEventListener("resize", heighCheck);

    return () => {
      // window.removeEventListener("resize", heighCheck);
      // console.log("clear");
    };
  }, []);

  //監聽 rerender : 公車實體線、行徑方向改變
  useEffect(() => {
    if (!shape || shape.length === 0) {
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

    if (props.hideStop && device !== "normal") return;

    if (hideStop && device === "normal") return;

    map.addLayer(stopOnMapGroup.current);

    // console.log(StopPosition);
  }, [routeStops, routeDirection]);

  //監聽 rerender : 是否隱藏地圖上站牌圖標
  useEffect(() => {
    if (!stopOnMapGroup.current) return;

    map.removeLayer(stopOnMapGroup.current);

    if (!props.hideStop && device !== "normal") {
      map.addLayer(stopOnMapGroup.current);
    }

    if (!hideStop && device === "normal") {
      map.addLayer(stopOnMapGroup.current);
    }
  }, [props.hideStop, hideStop]);

  //監聽 rerender : 公車位置、行徑方向改變
  useEffect(() => {
    if (!busPosition || !busPosition[Number(routeDirection)]) return;

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

  //監聽附近站點顯示
  useEffect(() => {
    if (!props.stopsPosition) return;

    if (nearMarksOnMapGroup.current) {
      map.removeLayer(nearMarksOnMapGroup.current);
    }

    nearMarksArray.current = props.stopsPosition.map((station) => {
      return window.L.marker(station.coords, {
        icon: window.L.icon({
          iconUrl: img.i_streetsign,
          className: "icon--nearStop",
        }),
      }).bindPopup(`${station.stationName} (${station.bearing})`);
    });

    nearMarksOnMapGroup.current = window.L.layerGroup(nearMarksArray.current);
    map.addLayer(nearMarksOnMapGroup.current);
  }, [props.stopsPosition]);

  /////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="leaflet">
      {device === "normal" && props.page !== "near" && (
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
        </div>
      )}
      <div id="map" className="map" style={decideHeight()}></div>
    </div>
  );
};

export default LeafletMap;
