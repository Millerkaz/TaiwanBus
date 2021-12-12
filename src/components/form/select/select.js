import React from "react";

import "./select.scss";

const Select = (props) => {
  return (
    <div className={`select ${props.className || ""}`}>
      <label>{props.label}</label>
      <select className={``} {...props.input}>
        {props.children}
      </select>
    </div>
  );
};
export default Select;
