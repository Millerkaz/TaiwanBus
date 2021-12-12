import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UseDiv100 from "../../hook/useDiv100vh";
import { local, historyPush } from "../../helper";
import { PTX } from "../../API";
import img from "../../img";

import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import ListSmall from "../../components/listSmall/listSmall";

import "./favoriteStopPage.scss";
const FavoriteStopPage = (props) => {
  const height = UseDiv100();
  const [renderArray, setRenderArray] = useState(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    const fetchFavorStopEstimateTime = async (stopsArray) => {
      if (stopsArray.length === 0) return;

      const fetchPromises = stopsArray.map(({ stopUID, city }) =>
        PTX.get(
          `/v2/Bus/EstimatedTimeOfArrival/City/${city}?$filter=StopUID%20eq%20'${stopUID}'&$top=30&$format=JSON`
        )
      );

      const response = await Promise.all(fetchPromises);
      setRenderArray(
        response.map((each, i) => {
          return { ...each.data[0], city: stopsArray[i].city };
        })
      );
    };

    if (!local.getLocal("stop")) {
      local.initLocalData();
    }

    if (!init) {
      setInit(true);
      return;
    }

    fetchFavorStopEstimateTime(Object.values(local.getLocal("stop")));
  }, [init]);

  return (
    <div className="favoriteStopPage" style={{ height: height }}>
      <div className="favoriteStopPage__header">
        <Header />
        <p>
          <Link to="/">首頁</Link>
          {"  >  "}
          <a>我的站牌</a>
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
        <h1>我的站牌</h1>
      </div>
      {renderArray && <ListSmall page="favoriteStopPage" data={renderArray} />}
      <Footer floatB={true} />
    </div>
  );
};

export default FavoriteStopPage;
