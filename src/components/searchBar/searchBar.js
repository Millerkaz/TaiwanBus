import React from "react";
import { reduxForm, Field } from "redux-form";

import Input from "../form/input/input";
import Select from "../form/select/select";
import Btn from "../btn";

import img from "../../img";

import "./searchBar.scss";

const SearchBar = (props) => {
  return (
    <div className={`searchBar ${props.className || ""}`}>
      <div className="searchBar__container">
        <form
          className="searchBar__form"
          onSubmit={props.handleSubmit((valueObj) => {
            formSubmitHandler(valueObj);
          })}
        >
          <Field
            name="city"
            component={Select}
            className={`select ${props.selectClass || ""}`}
          />
          <Field
            name="term"
            component={Input}
            className={`input ${props.inputClass || ""}`}
            placeholder="請輸入站點名稱"
          />

          <Field component={Btn} type="submit" color="">
            搜尋
            <img src={img.search} alt="search" />
          </Field>
        </form>
      </div>
    </div>
  );
};

const validate = (formValues) => {
  const error = {};

  if (!formValues.term) {
    error.term = "請輸入站點關鍵字";
  }

  return error;
};

export default reduxForm({
  form: "searchBar",
  initialValues: { city: "Taichung" },
  validate: validate,
})(SearchBar);
