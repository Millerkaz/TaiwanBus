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

export const getStopStartAndEndNameHelper = (routeStop, direction = 0) => {
  if (!routeStop) return;

  let filterValue = routeStop.find((route) => route.Direction === direction);
  let start = `${filterValue.Stops[0].StopName.Zh_tw} `;
  let end = ` ${
    filterValue.Stops[filterValue.Stops.length - 1].StopName.Zh_tw
  }`;

  return [start, end];
};

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

export function stopBusSortHelper(
  stopsArray,
  busCurrentStop,
  estimateTime,
  Direction
) {
  const stops = {};
  let stopDirectionArray = stopsArray[Direction]?.Stops;

  console.log(stopsArray[Direction]);
  console.log(stopsArray);

  // 新竹縣 62 -> 只有單向
  if (!stopDirectionArray) {
    stopDirectionArray = stopsArray[0].Stops;
  }

  if (
    stopDirectionArray[0].StopName.Zh_tw ===
      stopDirectionArray[stopDirectionArray.length - 1].StopName.Zh_tw &&
    stopDirectionArray[0].StopBoarding === 1 &&
    stopDirectionArray[stopDirectionArray.length - 1].StopBoarding === -1
  ) {
    stopDirectionArray[0].StopName.Zh_tw =
      stopDirectionArray[0].StopName.Zh_tw + "(起點)";
    stopDirectionArray[stopDirectionArray.length - 1].StopName.Zh_tw =
      stopDirectionArray[stopDirectionArray.length - 1].StopName.Zh_tw +
      "(終點)";
  }

  // obj 的 key 加上 index值 避免有些路段會同站多次進出導致重複 key name
  // value 為兩項的 array，第一項表示在此站的車牌號碼，第二項表示預估到到站時間
  stopDirectionArray.forEach((v, i) => {
    stops[v.StopName.Zh_tw + `(${i + 1})`] = [
      busCurrentStop.filter(
        (busObj) =>
          busObj.StopUID === v.StopUID && busObj.Direction === Direction
      ),
      estimateTime.filter(
        (stopObj) =>
          stopObj.StopUID === v.StopUID && stopObj.Direction === Direction
      ),
    ];
  });

  console.log(stops);
  return [Object.keys(stops), Object.values(stops)];
}
