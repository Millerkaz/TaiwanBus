import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./mobileToolBar.scss";

// 有動畫關閉按鈕的懸浮工具列

const FloatToolBar = () => {
  const [closeClick, setCloseClick] = useState(false);

  //close--active in floatToolBar.css

  return ReactDOM.createPortal(
    <div className="floatToolBar">
      <span
        className={`btn floatToolBar__close ${
          !closeClick ? "" : "close--active"
        }`}
        onClick={() => setCloseClick((pre) => !pre)}
      ></span>
      <div
        className={`floatToolBar__container ${
          !closeClick ? "mobile--hidden" : ""
        }`}
      >
        {/* content */}
      </div>
    </div>,
    document.querySelector("#root")
  );
};

export default FloatToolBar;
