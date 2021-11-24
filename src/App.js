import React, { useEffect } from "react";
import { Router, Route } from "react-router-dom";
import history from "./helper/history";
import { local } from "./helper";
import Home from "./views/home/home";
import SearchPage from "./views/searchPage/searchPage";
import TargetBusDetail from "./views/targetBusDetail/targetBusDetail";
import NearSearchPage from "./views/nearSearchPage/nearSearchPage";
import FavoritePage from "./views/favoritePage/favoritePage";
import "./sass/index.scss";

const App = (props) => {
  useEffect(() => {
    local.initLocalData();
  }, []);

  return (
    <Router history={history}>
      <Route path="/" exact component={Home} />
      <Route path="/searchBus" exact component={SearchPage} />
      <Route path="/busMap" component={NearSearchPage} />
      <Route
        path="/busMap/:city/:routeName"
        exact
        component={TargetBusDetail}
      />
      {/* <Route path="/schedule" exact component={BusRoutePopup} /> */}
      <Route path="/favorite" exact component={FavoritePage} />
    </Router>
  );
};

export default App;
