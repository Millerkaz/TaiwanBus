import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import useInput from "../../../hook/use-input";
import CustomDropDownNoRedux from "../../../components/form/customSelect/customSelect_noRedux";
import Input from "../../../components/form/input/input";
import { fetchListByRouteCreator } from "../../../store/fetchPTXData-slice";

import "./useRouteIDForm.scss";

const waitTime = 1500;

const RouteIDForm = ({ routeNameState, routeNameChange }) => {
  const dispatch = useDispatch();
  const { valueState: cityCHState, inputOnChange: cityCHChange } =
    useInput("臺北市");

  const timer = useRef(null);

  useEffect(() => {
    if (!routeNameState.isFocus) return;
    // console.log(1);

    if (!routeNameState.isValueValid) {
      console.log("input invalid");
      return;
    }

    timer.current = setTimeout(() => {
      dispatch(
        fetchListByRouteCreator({
          term: routeNameState.value,
          cityCH: cityCHState.value,
        })
      );
      console.log(cityCHState.value, routeNameState.value);
    }, waitTime);

    return () => {
      clearTimeout(timer.current);
    };
  }, [routeNameState.value, cityCHState.value]);

  return (
    <form
      className="useRouteIDForm"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <CustomDropDownNoRedux
        cityCHState={cityCHState}
        cityCHChange={cityCHChange}
      />
      <Input
        value={routeNameState.value}
        onChange={(e) => {
          routeNameChange(e.target.value);
        }}
        className={`useRouteIDForm__input`}
        placeholder="請輸入公車路線"
      />
    </form>
  );
};

export default RouteIDForm;
