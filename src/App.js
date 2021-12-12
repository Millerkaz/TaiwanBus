import React, { useEffect } from "react";
import { Router, Route } from "react-router-dom";
import history from "./helper/history";
import { local } from "./helper";
import useDeviceCheck from "./hook/useDeviceCheck";
import Home from "./views/home/home";
import SearchPage from "./views/searchPage/searchPage";
import TargetBusDetail from "./views/targetBusDetail/targetBusDetail";
import NearSearchPage from "./views/nearSearchPage/nearSearchPage";
import RouteChoicePage from "./views/routeChoicePage/routeChoicePage";
import FavoriteRoutePage from "./views/favoriteRoutePage/favoriteRoutePage";
import FavoriteStopPage from "./views/favoriteStopPage/favoriteStopPage";

import "./sass/index.scss";

const App = () => {
  const device = useDeviceCheck();

  useEffect(() => {
    local.initLocalData();
  }, []);

  return (
    <Router history={history}>
      <Route path="/" exact component={Home} />
      <Route path="/searchBus" exact component={SearchPage} />
      {device === "normal" ? (
        <Route exact path="/busMap" component={NearSearchPage} />
      ) : (
        <Route path="/busMap" component={NearSearchPage} />
      )}
      <Route
        path="/busMap/:city/:routeName"
        exact
        component={TargetBusDetail}
      />
      <Route
        path="/routeChoice/:city/:stationUID"
        exact
        component={RouteChoicePage}
      />
      <Route path="/favorite/route" exact component={FavoriteRoutePage} />
      <Route path="/favorite/stop" exact component={FavoriteStopPage} />
    </Router>
  );
};

export default App;
