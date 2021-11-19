import React, { useEffect } from "react";
import { Router, Route } from "react-router-dom";
import history from "./helper/history";
import BusRoutePopup from "./views/busRoutePopup/busRoutePopup";
import Main from "./views/main/main";
import LeafletMap from "./components/leafletMap/leafletMap";
import "./sass/index.scss";

const App = (props) => {
  return (
    <Router history={history}>
      <Route path="/" component={Main} />
      <Route path="/:city/:routeUID" exact component={BusRoutePopup} />
      <LeafletMap />
    </Router>
  );
};

export default App;
