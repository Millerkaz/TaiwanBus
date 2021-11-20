import React from "react";
import { reduxForm, Field } from "redux-form";
import Select from "../../../components/form/select/select";
import Input from "../../../components/form/input/input";
import Btn from "../../../components/btn";
import { action } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../../components/form/customSelect/customSelect";

import "./useRouteIDForm.scss";
import { useEffect } from "react";
import { useRef } from "react";

const UseRouteIDForm = (props) => {
  const form = useSelector((state) => state.form.useRouteIDForm);
  const dispatch = useDispatch();
  const timer = useRef(null);

  const formSubmitHandler = (valueObj) => {
    dispatch(action.fetchDataByRouteCreator(valueObj));
  };

  useEffect(() => {
    if (!form.values?.term) return;

    timer.current = setTimeout(() => {
      formSubmitHandler(form.values);
    }, 1500);

    return () => {
      clearTimeout(timer.current);
    };
  }, [form.values?.term, form.values?.city]);

  return (
    <form className="useRouteIDForm">
      <Field
        name="cityCH"
        component={CustomSelect}
        formName="useRouteIDForm"
        label="請選擇城市："
      ></Field>

      <Field
        name="term"
        component={Input}
        className={`useRouteIDForm__input`}
        placeholder="請輸入公車號碼"
        label="公車號碼："
      />

      {/* <Btn color="" type="submit">
        搜尋
      </Btn> */}
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
  form: "useRouteIDForm",
  initialValues: { cityCH: "臺北市" },
  validate: validate,
})(UseRouteIDForm);

{
  /* <Field
        name="city"
        component={Select}
        className={`useRouteIDForm__select`}
        label="請選擇所在城市："
      >
        <option value="Taipei">臺北市</option>
        <option value="NewTaipei">新北市</option>
        <option value="Taichung">臺中市</option>
        <option value="Keelung">基隆市</option>
        <option value="Tainan">臺南市</option>
        <option value="Kaohsiung">高雄市</option>
        <option value="YilanCounty">宜蘭縣</option>
        <option value="Taoyuan">桃園市</option>
        <option value="Chiayi">嘉義市</option>
        <option value="ChiayiCounty">嘉義縣</option>
        <option value="HsinchuCounty">新竹縣</option>
        <option value="Hsinchu">新竹市</option>
        <option value="MiaoliCounty">苗栗縣</option>
        <option value="NantouCounty">南投縣</option>
        <option value="ChanghuaCounty">彰化縣</option>
        <option value="YunlinCounty">雲林縣</option>
        <option value="PingtungCounty">屏東縣</option>
        <option value="HualienCounty">花蓮縣</option>
        <option value="TaitungCounty">臺東縣</option>
        <option value="KinmenCounty">金門縣</option>
        <option value="PenghuCounty">澎湖縣</option>
        <option value="LienchiangCounty">連江縣</option>
      </Field> */
}
