import { PTX } from "../API";
import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { cityObj, dataFilterHelper, stopBusSortHelper } from "../helper";

//*---------------- type ---------------- *//

const FETCH_DATA = "FETCH_DATA";
const REFETCH_NOW_BUS = "REFETCH_NOW_BUS";
const TARGET_BUS_ONCLICK = "TARGET_BUS_ONCLICK";

const CHANGE_DIRECTION = "CHANGE_DIRECTION";
const CHANGE_DIRECTION_FORCE_0 = "CHANGE_DIRECTION_FORCE_0";

const SELECT_ROAD = "SELECT_ROAD";

const CLOSE_ERROR_SCREEN = "CLOSE_ERROR_SCREEN";

const POP_SHOW = "POP_SHOW";
const POP_HIDE = "POP_HIDE";

//*---------------- Action ---------------- *//
// const filterString = !coords
//         ? ""
//         : `$spatialFilter=nearby(${coords.lat}%2C${coords.lon}%2C10000)&$`;

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

      let data = dataFilterHelper(response.data);
      // console.log(data);

      dispatch({
        type: FETCH_DATA,
        payload: data,
      });
    };
  },

  ///////////////////////////////////////////////////////////

  popWindowShowCreator: (component) => {
    return {
      type: POP_SHOW,
      payload: component,
    };
  },

  popWindowHideCreator: () => {
    return {
      type: POP_HIDE,
      payload: null,
    };
  },

  ///////////////////////////////////////////////////////////

  targetBusOnClickCreator: (routeName, routeUID, city, stopsArray) => {
    return async (dispatch) => {
      let busCurrentStop = PTX.get(
        `/v2/Bus/RealTimeNearStop/City/${city}?$filter=contains(RouteUID%2C'${routeUID}')&$top=5000&$format=JSON`
      );
      let busPosition = PTX.get(
        `/v2/Bus/RealTimeByFrequency/City/${city}?$filter=contains(RouteUID%2C'${routeUID}')&$top=5000&$format=JSON`
      );
      const routeShape = PTX.get(
        `/v2/Bus/Shape/City/${city}?$filter=contains(RouteUID%2C'${routeUID}')&$top=5000&$format=JSON`
      );

      let estimateTime = PTX.get(
        `/v2/Bus/EstimatedTimeOfArrival/City/${city}?$filter=contains(RouteUID%2C'${routeUID}')&$top=5000&$format=JSON`
      );

      const data = await Promise.all([
        busCurrentStop,
        busPosition,
        routeShape,
        estimateTime,
      ]);

      busCurrentStop = data[0].data;
      busPosition = data[1].data;
      estimateTime = data[3].data;

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
      console.log(busTypeObj);

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
          busPosition,
          routeShape: data[2].data,
          estimateTime,
          routeStops: stopsArray,
          routeDirection0Bus,
          routeDirection1Bus,
          busTypeObj,
        },
      });
    };
  },

  reFetchNowBusCreator: (routeName, city) => {
    return async (dispatch) => {
      const busPosition = PTX.get(
        `/v2/Bus/RealTimeNearStop/City/${city}/${routeName}?$top=1000&$format=JSON`
      );
      const busCurrentStop = PTX.get(
        `/v2/Bus/RealTimeByFrequency/City/${city}/${routeName}?$top=1000&$format=JSON`
      );

      const estimateTime = PTX.get(
        `/v2/Bus/EstimatedTimeOfArrival/City/${city}?$filter=contains(RouteName%20%2FZh_tw%2C'${routeName}')&$top=5000&$format=JSON`
      );

      const data = await Promise.all([
        busPosition,
        busCurrentStop,
        estimateTime,
      ]);

      dispatch({
        type: REFETCH_NOW_BUS,
        payload: {
          busPosition: data[0].data,
          busCurrentStop: data[1].data,
          estimateTime: data[2].data,
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

  return preState;
};

const popWindowReducer = (preState = {}, action) => {
  switch (action.type) {
    case POP_SHOW:
      return { ...preState, show: true, component: action.payload };

    case POP_HIDE:
      return { ...preState, show: false, component: null };

    default:
      return preState;
  }
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

export const reducers = combineReducers({
  //維持資料一致性， data為 [ [ {...},{...} ] , [ {...} ] ,...] ，顯示時站牌時抓每一項[0]的 StopName.Zh_tw
  mainSearchData: mainSearchDataReducer,

  targetBusRenderData: targetBusDataOnClickReducer,

  popWindow: popWindowReducer,

  routeDirection: changeDirectionReducer,

  form: formReducer,
});
