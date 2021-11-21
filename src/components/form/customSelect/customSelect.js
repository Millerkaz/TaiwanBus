import React, { useState, useEffect } from "react";
import { change } from "redux-form";
import Dropdown from "./dropdown/dropdown";
import img from "../../../img";

import "./customSelect.scss";

const CustomDropDown = (props) => {
  const [value, setValue] = useState("臺北市");
  const [isDropClick, setIsDropClick] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (!e.target.closest(".customSelect")) {
        setIsDropClick(false);
      }
    });
  }, []);

  useEffect(() => {
    props.meta.dispatch(change(props.formName, "cityCH", value));
  }, [value]);

  return (
    <div className={`customSelect ${props.className || ""}`}>
      <span>{props.label}</span>
      <div className="customSelect__value">
        <p
          onClick={() => {
            setIsDropClick((pre) => !pre);
          }}
        >
          {value}
          <img src={img.i_arrowD} />
        </p>
      </div>
      <div
        className={`customSelect__dropContainer ${
          isDropClick ? "" : `hidden--dropdown`
        }`}
      >
        <Dropdown
          onClick={(e) => {
            setIsDropClick((pre) => !pre);
            setValue(e.target.textContent);
          }}
        />
      </div>
    </div>
  );
};

export default CustomDropDown;
