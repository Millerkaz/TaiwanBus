import { PTX } from "../API";
import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { cityObj, dataFilterHelper } from "../helper";

//*---------------- type ---------------- *//

const FETCH_DATA = "FETCH_DATA";
const REFETCH_NOW_BUS = "REFETCH_NOW_BUS";
const TARGET_BUS_ONCLICK = "TARGET_BUS_ONCLICK";
const CLEAR_NEAR_DATA = "CLEAR_NEAR_DATA";

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

      // routeData = routeData.map((route) => {
      //   return {
      //     routeUID: route[0].RouteUID,
      //     routeName: route[0].RouteName.Zh_tw,
      //     direction: route[0].Direction,
      //     stops: route[0].Stops,
      //     startEnd: `${route[0].Stops[0].StopName.Zh_tw} <–> ${
      //       route[0].Stops[route[0].Stops.length - 1].StopName.Zh_tw
      //     }`,
      //   };
      // });

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

  targetBusOnClickCreator: (routeName, city, stopsArray) => {
    return async (dispatch) => {
      const busPosition = PTX.get(
        `/v2/Bus/RealTimeNearStop/City/${city}/${routeName}?$top=1000&$format=JSON`
      );
      const busCurrentStop = PTX.get(
        `/v2/Bus/RealTimeByFrequency/City/${city}/${routeName}?$top=1000&$format=JSON`
      );
      const routeShape = PTX.get(
        `/v2/Bus/Shape/City/${city}?$filter=RouteName%2FZh_tw%20eq%20'${routeName}'&$top=1000&$format=JSON`
      );

      const data = await Promise.all([busPosition, busCurrentStop, routeShape]);

      console.log(data);

      dispatch({
        type: TARGET_BUS_ONCLICK,
        payload: {
          target: { routeName, city },
          busPosition: data[0].data,
          busCurrentStop: data[1].data,
          routeShape: data[2].data,
          routeStops: stopsArray,
        },
      });
    };
  },

  reFetchNowBus: (routeName, city) => {
    return async (dispatch) => {
      const busPosition = PTX.get(
        `/v2/Bus/RealTimeNearStop/City/${city}/${routeName}?$top=1000&$format=JSON`
      );
      const busCurrentStop = PTX.get(
        `/v2/Bus/RealTimeByFrequency/City/${city}/${routeName}?$top=1000&$format=JSON`
      );

      const data = await Promise.all([busPosition, busCurrentStop]);

      dispatch({
        type: REFETCH_NOW_BUS,
        payload: {
          busPosition: data[0].data,
          busCurrentStop: data[1].data,
        },
      });
    };
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

export const reducers = combineReducers({
  //維持資料一致性， data為 [ [ {...},{...} ] , [ {...} ] ,...] ，顯示時站牌時抓每一項[0]的 StopName.Zh_tw
  mainSearchData: mainSearchDataReducer,

  targetBusRenderData: targetBusDataOnClickReducer,

  // choseBusPopupData: selectRoadReducer,

  popWindow: popWindowReducer,

  form: formReducer,
});
