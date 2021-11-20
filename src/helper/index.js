import history from "./history";

export const cityObj = {
  臺北市: "Taipei",
  臺中市: "Taichung",
  基隆市: "Keelung",
  臺南市: "Tainan",
  高雄市: "Kaohsiung",
  新北市: "NewTaipei",
  宜蘭縣: "YilanCounty",
  桃園市: "Taoyuan",
  嘉義市: "Chiayi",
  新竹縣: "HsinchuCounty",
  苗栗縣: "MiaoliCounty",
  南投縣: "NantouCounty",
  彰化縣: "ChanghuaCounty",
  新竹市: "Hsinchu",
  雲林縣: "YunlinCounty",
  嘉義縣: "ChiayiCounty",
  屏東縣: "PingtungCounty",
  花蓮縣: "HualienCounty",
  臺東縣: "TaitungCounty",
  金門縣: "KinmenCounty",
  澎湖縣: "PenghuCounty",
  連江縣: "LienchiangCounty",
};

export const pageCalcHelper = (responseDataArray) => {
  const cardPerPage = 12;
  let page =
    responseDataArray.length % cardPerPage === 0
      ? responseDataArray.length / cardPerPage
      : responseDataArray.length / cardPerPage + 1;

  // console.log(responseDataArray.length % cardPerPage === 0, responseDataArray.length / cardPerPage, page);

  let dataForPageObj = {};
  for (let i = 1; i <= page; i++) {
    //62筆 = 0~19 20~39 40~59 60~62
    dataForPageObj[i] = responseDataArray.slice(
      (i - 1) * cardPerPage,
      i * cardPerPage
    );
  }

  // console.log(dataForPageObj);
  return dataForPageObj;
};

export const historyPush = (path) => {
  window.scroll(0, 0);
  history.push(path);
};

// export const dataFilterHelper = (dataNotFilter, filter) => {
//   // 篩掉重複的 stationID
//   let set = [...new Set(dataNotFilter.map((station) => station[filter]))];

//   console.log(set);
//   let dataArray = [];
//   let stopNameArray = [];

//   // console.log(set);

//   // 每個 stationID 都有一組經過此站位的公車資料，儘管 StopName 相同，不同方向有自己的 stationID
//   // 將同 StopName ，但 stationID 不同的資料合併，的資料合併 [[{},{}],[{}],...]

//   if (filter === "StationID") {
//     set.forEach((id) => {
//       let eachData = dataNotFilter.find((station) => {
//         stopNameArray.push(station.StopName.Zh_tw);
//         return station[filter] === id;
//       });

//       dataArray.push(eachData);
//     });

//     console.log([...new Set(stopNameArray)]);
//     console.log(dataArray);

//     stopNameArray = [...new Set(stopNameArray)].map((StopName) =>
//       dataArray.filter((eachData) => eachData.StopName.Zh_tw === StopName)
//     );

//     return stopNameArray;
//   }

//   // 用公車號碼查尋只需整合同樣 routeUID 的資料
//   if (filter === "RouteUID") {
//     // console.log(set);
//     return set.map((id) => {
//       return dataNotFilter.filter((eachData) => eachData.RouteUID === id);
//     });
//   }
// };

export const dataFilterHelper = (dataNotFilter, filter) => {
  let dataObj = {};

  if (filter === "StopName") {
    //過濾重複站名
    let set = [
      ...new Set(dataNotFilter.map((station) => station.StopName.Zh_tw)),
    ];

    // console.log(set);

    //以站名為key創建obj
    set.forEach((name) => {
      dataObj[name] = [];
    });

    //過濾資料 : 將符合站名且 StationID 沒重複的資料加入
    dataNotFilter.forEach((obj) => {
      if (
        dataObj[obj.StopName.Zh_tw].some(
          (filtered) => filtered.StationID === obj.StationID
        )
      )
        return;

      dataObj[obj.StopName.Zh_tw].push(obj);
    });
  }

  if (filter === "RouteName") {
    let set = [...new Set(dataNotFilter.map((route) => route.RouteName.Zh_tw))];

    set.forEach((name) => {
      dataObj[name] = [];
    });

    dataNotFilter.forEach((obj) => {
      dataObj[obj.RouteName.Zh_tw].push(obj);
    });
  }
  return dataObj;
};
