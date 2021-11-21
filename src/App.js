import React, { useEffect } from "react";
import { Router, Route } from "react-router-dom";
import history from "./helper/history";
import Home from "./views/home/home";
import SearchPage from "./views/searchPage/searchPage";
import TargetBusDetail from "./views/targetBusDetail/targetBusDetail";
import LeafletMap from "./components/leafletMap/leafletMap";
import "./sass/index.scss";

const App = (props) => {
  return (
    <Router history={history}>
      <Route path="/" exact component={Home} />
      <Route path="/searchBus" exact component={SearchPage} />
      <Route path="/busMap" component={LeafletMap} />
      <Route
        path="/busMap/:city/:routeName"
        exact
        component={TargetBusDetail}
      />
      {/* <Route path="/schedule" exact component={BusRoutePopup} />
      <Route path="/favorite" exact component={BusRoutePopup} /> */}
    </Router>
  );
};

export default App;
