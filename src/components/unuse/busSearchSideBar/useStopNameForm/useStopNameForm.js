import React, { useEffect, useRef } from "react";
import { reduxForm, Field } from "redux-form";
import CustomSelect from "../../../components/form/customSelect/customSelect";
import Input from "../../../components/form/input/input";
import Btn from "../../../components/btn";
import { action } from "../../../store";
import { useDispatch, useSelector } from "react-redux";

import "./useStopNameForm.scss";

const UseStopNameForm = (props) => {
  // const form = useSelector((state) => state.form.useStopNameForm);
  // const timer = useRef(null);
  const dispatch = useDispatch();

  const formSubmitHandler = (valueObj) => {
    dispatch(action.fetchDataByStopNameCreator(valueObj));
  };

  // useEffect(() => {
  //   if (!form.values?.term) return;

  //   timer.current = setTimeout(() => {
  //     formSubmitHandler(form.values);
  //   }, 1500);

  //   return () => {
  //     clearTimeout(timer.current);
  //   };
  // }, [form.values?.term, form.values?.city]);

  return (
    <form
      className="useStopNameForm"
      onSubmit={props.handleSubmit((valueObj) => {
        // console.log(valueObj);
        formSubmitHandler(valueObj);
      })}
    >
      <Field
        name="cityCH"
        component={CustomSelect}
        formName="useStopNameForm"
        label="請選擇城市："
      ></Field>

      <Field
        name="term"
        component={Input}
        className={`useStopNameForm__input`}
        placeholder="請輸入公車站牌名稱"
        label="公車站牌："
      />

      <Btn color="" type="submit">
        搜尋
      </Btn>
    </form>
  );
};

const validate = (formValues) => {
  const error = {};

  //   if (!formValues.term) {
  //     error.term = "請輸入站點關鍵字";
  //   }

  return error;
};

export default reduxForm({
  form: "useStopNameForm",
  initialValues: { cityCH: "臺北市" },
  validate: validate,
})(UseStopNameForm);
