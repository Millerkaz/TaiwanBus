import React from "react";
import "./footer.scss";

const Footer = (props) => {
  return (
    <div className={`footer ${props.floatB && "footer--floatB"}`}>
      <p>HelloBus © </p>
      <br />
      <p>2021 Designer Vum. Engineer Kaz Miller. All rights reserved.</p>
    </div>
  );
};

export default Footer;
