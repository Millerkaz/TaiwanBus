import { PTX } from "../API";
import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { cityObj, dataFilterHelper, stopBusSortHelper } from "../helper";

//*---------------- type ---------------- *//

const FETCH_DATA = "FETCH_DATA";
const REFETCH_NOW_BUS = "REFETCH_NOW_BUS";
const TARGET_BUS_ONCLICK = "TARGET_BUS_ONCLICK";
const CLEAR_TARGET = "CLEAR_TARGET";

const CHANGE_DIRECTION = "CHANGE_DIRECTION";
const CHANGE_DIRECTION_FORCE_0 = "CHANGE_DIRECTION_FORCE_0";

const FETCH_NEAR_DATA = "FETCH_NEAR_DATA";

const SELECT_STOP = "SELECT_STOP";

//*---------------- Action ---------------- *//

export const action = {
  fetchDataByRouteCreator: ({ term, cityCH }) => {
    return async (dispatch) => {
      let response;
      let city = cityObj[cityCH];

      if (!city) {
        city = cityCH;
      }

      //此五縣市戳 顯示用站序 API
      if (
        city === "Taipei" ||
        city === "Tainan" ||
        city === "NewTaipei" ||
        city === "Taoyuan" ||
        city === "Taichung"
      ) {
        response = await PTX.get(
          `/v2/Bus/DisplayStopOfRoute/City/${city}/${term}?$top=50&$format=JSON`
        );
      } else {
        response = await PTX.get(
          `/v2/Bus/StopOfRoute/City/${city}/${term}?$top=50&$format=JSON`
        );
      }

      let routeData = dataFilterHelper(response.data, "RouteName");

      dispatch({
        type: FETCH_DATA,
        payload: {
          searchBy: "route",
          city,
          data: routeData,
        },
      });
    };
  },

  fetchDataByStopNameCreator: ({ term, cityCH }) => {
    return async (dispatch) => {
      let data;
      let city = cityObj[cityCH];

      if (city === "Taipei" || city === "NewTaipei") {
        const taipeiData = PTX.get(
          `/v2/Bus/Stop/City/Taipei?${`$filter=contains(StopName%2FZh_tw%2C'${term}')&`}$top=1000&$format=JSON`
        );
        const newTaipeiData = PTX.get(
          `/v2/Bus/Stop/City/NewTaipei?${`$filter=contains(StopName%2FZh_tw%2C'${term}')&`}$top=1000&$format=JSON`
        );

        let response = await Promise.all([taipeiData, newTaipeiData]);
        response = response.map((res) => res.data).flat();
        // console.log(response);

        //過濾 StationID 重複的資料
        data = dataFilterHelper(response, "StopName");

        // console.log(data);
      } else {
        const response = await PTX.get(
          `/v2/Bus/Stop/City/${city}?${`$filter=contains(StopName%2FZh_tw%2C'${term}')&`}$top=1000&$format=JSON`
        );

        data = dataFilterHelper(response.data, "StopName");
      }

      // 連結 站牌名 + index ， 加快檢索速度

      dispatch({
        type: FETCH_DATA,
        payload: {
          searchBy: "stop",
          city,
          data,
        },
      });
    };
  },

  fetchNearStopDataCreator: ({ lat, lng }) => {
    return async (dispatch) => {
      const response = await PTX.get(
        `/v2/Bus/Station/NearBy?$top=10000&$spatialFilter=nearby(${lat}%2C${lng}%2C500)&$format=JSON`
      );

      // let data = dataFilterHelper(response.data);
      // console.log(response.data);

      dispatch({
        type: FETCH_NEAR_DATA,
        payload: response.data,
      });
    };
  },

  ///////////////////////////////////////////////////////////

  targetBusOnClickCreator: (routeName, routeUID, city, stopsArray) => {
    return async (dispatch) => {
      let busCurrentStop;
      let busPosition;
      let estimateTime;

      //基隆客運、公車資料混在一起...

      busCurrentStop = PTX.get(
        `/v2/Bus/RealTimeNearStop/City/${city}?$filter=contains(RouteUID%2C'${routeUID}')&$top=5000&$format=JSON`
      );
      busPosition = PTX.get(
        `/v2/Bus/RealTimeByFrequency/City/${city}?$filter=contains(RouteUID%2C'${routeUID}')&$top=5000&$format=JSON`
      );

      estimateTime = PTX.get(
        `/v2/Bus/EstimatedTimeOfArrival/City/${city}?$filter=contains(RouteUID%2C'${routeUID}')&$top=5000&$format=JSON`
      );

      const data = await Promise.all([
        busCurrentStop,
        busPosition,
        estimateTime,
      ]);

      //連江縣無提供 SHAPE DATE
      let routeShape;
      if (city !== "LienchiangCounty") {
        routeShape = await PTX.get(
          `/v2/Bus/Shape/City/${city}?$filter=contains(RouteUID%2C'${routeUID}')&$top=5000&$format=JSON`
        );
      }

      busCurrentStop = data[0].data;
      busPosition = data[1].data;
      estimateTime = data[2].data;

      /* 公車種類 API
      const busTypePromises = busPosition.map((bus) => {
        return PTX.get(
          `/v2/Bus/Vehicle/City/${city}?$filter=contains(PlateNumb%2C'${bus.PlateNumb}')&$top=20&$format=JSON`
        );
      });

      let busTypeObj = {};
      let busType = await Promise.all(busTypePromises);
      busType.forEach((bus) => {
        if (bus.data.length === 0) return;
        busTypeObj[bus.data[0]?.PlateNumb] = bus.data[0]?.VehicleType;
      });
      */

      // 分類 去程及返程 公車位置
      const busPositionSort = [];
      busPositionSort[0] = busPosition
        .filter((bus) => bus.Direction === 0)
        .map((bus) => {
          return {
            plateNumb: bus.PlateNumb,
            coords: {
              lat: bus.BusPosition.PositionLat,
              lng: bus.BusPosition.PositionLon,
            },
          };
        });

      busPositionSort[1] = busPosition
        .filter((bus) => bus.Direction === 1)
        .map((bus) => {
          return {
            plateNumb: bus.PlateNumb,
            coords: {
              lat: bus.BusPosition.PositionLat,
              lng: bus.BusPosition.PositionLon,
            },
          };
        });

      // 分類去程及返程公車在哪一站及抵達時間
      const [routeDirection0Name, routeDirection0Bus] = stopBusSortHelper(
        stopsArray,
        busCurrentStop,
        estimateTime,
        0
      );

      const [routeDirection1Name, routeDirection1Bus] = stopBusSortHelper(
        stopsArray,
        busCurrentStop,
        estimateTime,
        1
      );

      dispatch({
        type: TARGET_BUS_ONCLICK,
        payload: {
          target: { routeName, routeUID, city },
          busCurrentStop,
          busPosition: busPositionSort,
          routeShape: routeShape.data,
          estimateTime,
          routeStops: stopsArray,
          routeDirection0Bus,
          routeDirection1Bus,
          // busTypeObj,
        },
      });
    };
  },

  reFetchNowBusCreator: (routeUID, city, stopsArray) => {
    return async (dispatch) => {
      let busCurrentStop = PTX.get(
        `/v2/Bus/RealTimeNearStop/City/${city}?$filter=contains(RouteUID%2C'${routeUID}')&$top=5000&$format=JSON`
      );
      let busPosition = PTX.get(
        `/v2/Bus/RealTimeByFrequency/City/${city}?$filter=contains(RouteUID%2C'${routeUID}')&$top=5000&$format=JSON`
      );

      let estimateTime = PTX.get(
        `/v2/Bus/EstimatedTimeOfArrival/City/${city}?$filter=contains(RouteUID%2C'${routeUID}')&$top=5000&$format=JSON`
      );

      // let busPosition = PTX.get(
      //   `/v2/Bus/RealTimeNearStop/City/${city}/${routeName}?$top=1000&$format=JSON`
      // );
      // let busCurrentStop = PTX.get(
      //   `/v2/Bus/RealTimeByFrequency/City/${city}/${routeName}?$top=1000&$format=JSON`
      // );

      // let estimateTime = PTX.get(
      //   `/v2/Bus/EstimatedTimeOfArrival/City/${city}?$filter=contains(RouteName%20%2FZh_tw%2C'${routeName}')&$top=5000&$format=JSON`
      // );

      const data = await Promise.all([
        busPosition,
        busCurrentStop,
        estimateTime,
      ]);

      busPosition = data[0].data;
      busCurrentStop = data[1].data;
      estimateTime = data[2].data;

      const busPositionSort = [];
      busPositionSort[0] = busPosition
        .filter((bus) => bus.Direction === 0)
        .map((bus) => {
          return {
            plateNumb: bus.PlateNumb,
            coords: {
              lat: bus.BusPosition.PositionLat,
              lng: bus.BusPosition.PositionLon,
            },
          };
        });

      busPositionSort[1] = busPosition
        .filter((bus) => bus.Direction === 1)
        .map((bus) => {
          return {
            plateNumb: bus.PlateNumb,
            coords: {
              lat: bus.BusPosition.PositionLat,
              lng: bus.BusPosition.PositionLon,
            },
          };
        });

      const [routeDirection0Name, routeDirection0Bus] = stopBusSortHelper(
        stopsArray,
        busCurrentStop,
        estimateTime,
        0
      );

      const [routeDirection1Name, routeDirection1Bus] = stopBusSortHelper(
        stopsArray,
        busCurrentStop,
        estimateTime,
        1
      );

      dispatch({
        type: REFETCH_NOW_BUS,
        payload: {
          busPosition: busPositionSort,
          busCurrentStop,
          estimateTime,
          routeDirection0Bus,
          routeDirection1Bus,
        },
      });
    };
  },

  changeDirectionCreator: (force = false) => {
    if (!force) {
      return { type: CHANGE_DIRECTION };
    }

    return { type: CHANGE_DIRECTION_FORCE_0 };
  },

  setStopIndexCreator: (index) => {
    return {
      type: SELECT_STOP,
      payload: index,
    };
  },

  clearTargetCreator: () => {
    return { type: CLEAR_TARGET };
  },
};

//*---------------- Reducer ---------------- *//

const mainSearchDataReducer = (preState = {}, action) => {
  if (action.type === FETCH_DATA) {
    return { ...action.payload };
  }

  // if (action.type === FETCH_DATA_BY_STOP_NAME) {
  //   return [...action.payload];
  // }
  return preState;
};

const targetBusDataOnClickReducer = (preState = {}, action) => {
  if (action.type === TARGET_BUS_ONCLICK) {
    return { ...action.payload };
  }

  if (action.type === REFETCH_NOW_BUS) {
    return { ...preState, ...action.payload };
  }

  if (action.type === CLEAR_TARGET) {
    return {};
  }

  return preState;
};

const fetchNearDataReducer = (preState = [], action) => {
  if (action.type === FETCH_NEAR_DATA) {
    return [...action.payload];
  }

  return preState;
};

const changeDirectionReducer = (preState = "0", action) => {
  if (action.type === CHANGE_DIRECTION) {
    if (preState === "0") {
      return "1";
    }

    if (preState === "1") {
      return "0";
    }
  }

  if (action.type === CHANGE_DIRECTION_FORCE_0) {
    return "0";
  }

  return preState;
};

const setStopIndexReducer = (preState = null, action) => {
  if (action.type === SELECT_STOP) {
    return [...action.payload];
  }

  return preState;
};

export const reducers = combineReducers({
  mainSearchData: mainSearchDataReducer,

  targetBusRenderData: targetBusDataOnClickReducer,

  nearBusData: fetchNearDataReducer,

  routeDirection: changeDirectionReducer,

  stopIndex: setStopIndexReducer,

  form: formReducer,
});
