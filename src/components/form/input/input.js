import React, { useState } from "react";
import "./input.scss";

/**
 * JSX
 * @param default init state value
 * @param type text (default) , email , checkbox...
 * @param placeholder
 */

const Input = (props) => {
  return (
    <div className={`input ${props.className || ""}`}>
      <label>{props.label}</label>
      <input
        type={props.type || "text"}
        placeholder={props.placeholder}
        {...props.input}
        required
      ></input>
    </div>
  );
};

export default Input;
