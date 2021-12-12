import { fetchPTXDataReducer } from "./fetchPTXData-slice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: { PTXData: fetchPTXDataReducer },
});
