import React from "react";
import "./input.scss";

/**
 * JSX
 * @param default init state value
 * @param type text (default) , email , checkbox...
 * @param placeholder
 */

const Input = (props) => {
  return (
    <div className={`input`}>
      <label>{props.label}</label>
      <input
        className={` ${props.className || ""}`}
        type={props.type || "text"}
        placeholder={props.placeholder}
        {...props.input}
        required
      ></input>
    </div>
  );
};

export default Input;
