import { createSlice } from "@reduxjs/toolkit";
import { dataFilterHelper, cityObj } from "../helper";
import { PTX } from "../API";

const fetchPTXDataSlice = createSlice({
  name: `PTXData`,
  initialState: { response: null, status: null, message: null },
  reducers: {
    fetchPending(state) {
      state.status = "pending";
    },

    fetchSuccess(state, action) {
      state.response = action.payload;
      state.status = "success";
    },

    fetchError(state, action) {
      const { message } = action.payload;
      state.message = message;
      state.status = "error";
    },
  },
});

export const fetchPTXDataActions = fetchPTXDataSlice.actions;
export const fetchPTXDataReducer = fetchPTXDataSlice.reducer;

export const fetchListByRouteCreator = ({ term, cityCH }) => {
  const fetchListByRoute = async () => {
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

    return dataFilterHelper(response.data, "RouteName");
  };

  return async (dispatch) => {
    dispatch(fetchPTXDataActions.fetchPending());

    try {
      const busDataList = await fetchListByRoute();
      dispatch(
        fetchPTXDataActions.fetchSuccess({
          data: busDataList,
          searchBy: "route",
        })
      );
    } catch (error) {
      dispatch(fetchPTXDataActions.fetchError(error.message));
    }
  };
};
