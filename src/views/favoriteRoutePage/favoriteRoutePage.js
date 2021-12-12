import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { local, historyPush } from "../../helper";
import UseDiv100 from "../../hook/useDiv100vh";
import img from "../../img";

import Header from "../../components/header/header";
import ListSmall from "../../components/listSmall/listSmall";
import Footer from "../../components/footer/footer";

import "./favoriteRoutePage.scss";

const FavoriteRoutePage = (props) => {
  const height = UseDiv100();
  const [renderArray, setRenderArray] = useState(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (!local.getLocal("route")) {
      local.initLocalData();
    }

    if (!init) {
      setInit(true);
      return;
    }

    setRenderArray({ route: local.getLocal("route") });
  }, [init]);

  return (
    <div className="favoriteRoutePage" style={{ height: height }}>
      <div className="favoriteRoutePage__header">
        <Header />
        <p>
          <Link to="/">首頁</Link>
          {"  >  "}
          <a>我的路段</a>
        </p>
        <div className="btn--back">
          <img
            onClick={() => {
              historyPush("/");
            }}
            src={img.i_leftArrowW}
            alt="back"
          />
        </div>
        <h1>我的路段</h1>
      </div>
      {renderArray && <ListSmall page="favoriteRoutePage" data={renderArray} />}
      <Footer floatB={true} />
    </div>
  );
};

export default FavoriteRoutePage;
