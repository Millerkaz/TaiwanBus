import React, { useEffect, useRef } from "react";
import { reduxForm, Field } from "redux-form";
import { action } from "../../../store";
import { useDispatch, useSelector } from "react-redux";

import CustomSelect from "../../../components/form/customSelect/customSelect";
import Input from "../../../components/form/input/input";

import "./useRouteIDForm.scss";

const waitTime = 1500;

const UseRouteIDForm = (props) => {
  const form = useSelector((state) => state.form.useRouteIDForm);
  const dispatch = useDispatch();
  const timer = useRef(null);

  const formSubmitHandler = (valueObj) => {
    dispatch(action.fetchDataByRouteCreator(valueObj));
  };

  useEffect(() => {
    if (!form.values?.term) return;
    // console.log(1);

    timer.current = setTimeout(() => {
      formSubmitHandler(form.values);
    }, waitTime);

    return () => {
      clearTimeout(timer.current);
    };
  }, [form.values?.term, form.values?.cityCH]);

  return (
    <form
      className="useRouteIDForm"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Field
        name="cityCH"
        component={CustomSelect}
        formName="useRouteIDForm"
        className={"customSelect--searchPage"}
      ></Field>

      <Field
        name="term"
        component={Input}
        className={`useRouteIDForm__input`}
        placeholder="請輸入公車路線"
      />
    </form>
  );
};

const validate = (formValues) => {
  const error = {};
  return error;
};

export default reduxForm({
  form: "useRouteIDForm",
  initialValues: { cityCH: "臺北市" },
  validate: validate,
})(UseRouteIDForm);
