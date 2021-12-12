import React, { useState, useEffect, useCallback } from "react";
import { change } from "redux-form";
import Dropdown from "./dropdown/dropdown";
import img from "../../../img";

import "./customSelect.scss";

const CustomDropDownNoRedux = (props) => {
  const { cityCHState, cityCHChange } = props;

  const [isDropClick, setIsDropClick] = useState(false);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (!e.target.closest(".customSelect")) {
        setIsDropClick(false);
      }
    });
  }, []);

  const dropdownClickHandler = useCallback(
    (e) => {
      setIsDropClick((pre) => !pre);
      cityCHChange(e.target.textContent);
    },
    [setIsDropClick, cityCHChange]
  );

  return (
    <div className={`customSelect ${props.className || ""}`}>
      <span>{props.label}</span>
      <div className="customSelect__value">
        <p
          onClick={() => {
            setIsDropClick((pre) => !pre);
          }}
        >
          {cityCHState.value}
          <img src={img.i_arrowD} />
        </p>
      </div>
      <div
        className={`customSelect__dropContainer ${
          isDropClick ? "" : `hidden--dropdown`
        }`}
      >
        <Dropdown onClick={dropdownClickHandler} />
      </div>
    </div>
  );
};

export default CustomDropDownNoRedux;
