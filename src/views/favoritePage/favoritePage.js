import React from "react";
import Header from "../../components/header/header";
import FavoriteList from "./favoriteList/favoriteList";
import Footer from "../../components/footer/footer";
import { Link } from "react-router-dom";
import "./favoritePage.scss";

const FavoritePage = (props) => {
  return (
    <div className="favoritePage">
      <div className="favoritePage__header">
        <Header />
        <p>
          <Link to="/">首頁</Link>
          {"  >  "}
          <a>我的收藏</a>
        </p>
        <h1>我的收藏</h1>
      </div>
      <FavoriteList />
      <Footer floatB={true} />
    </div>
  );
};

export default FavoritePage;
