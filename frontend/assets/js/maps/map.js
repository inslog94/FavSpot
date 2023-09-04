import {
  MAP,
  CURRENT_POSITION,
  PIN_INFO_WINDOW,
  MARKERS,
  CLUSTERER,
  CLUSTER_OVRELAY,
  CLUSTER_OVERLAY_CONTENT,
  $screenBtn,
  screenMode,
  $container,
} from "./data.js";
import {
  markerInfoHoverEvent,
  markerClickZoomInEvent,
  markerInfoClickEvent,
} from "./event.js";

function displayMap(position) {
  MAP.setCenter(position);
}

export function zoomIn() {
  let mapLevel = MAP.getLevel();

  MAP.setLevel(mapLevel - 1);
}

export function zoomInLocation(location) {
  let mapLevel = MAP.getLevel();

  MAP.setLevel(mapLevel - 1);
  MAP.panTo(location);
}

export function closeZoomInLocation(location) {
  MAP.setLevel(4);
  MAP.panTo(location);
}

export function move(location) {
  MAP.panTo(location);
}

export function fullScreen() {
  let mapBox = document.getElementsByClassName("map_wrap")[0];
  let board = document.getElementById("main_board");

  board.style.display = "none";
  mapBox.style.width = "98%";
  if (window.innerWidth > 1800) {
    $screenBtn.style.left = "177vh";
  } else {
    $screenBtn.style.left = "193vh";
  }
  $screenBtn.innerText = "되돌리기";
  screenMode.fullScreen = true;

  MAP.relayout();
}

export function fullScreenEnd() {
  let mapBox = document.getElementsByClassName("map_wrap")[0];
  let board = document.getElementById("main_board");

  board.style.display = "block";
  mapBox.style.width = "60%";
  if (window.innerWidth > 1800) {
    $screenBtn.style.left = "104vh";
  } else {
    $screenBtn.style.left = "112vh";
  }
  $screenBtn.innerText = "전체화면";
  screenMode.fullScreen = false;

  MAP.relayout();
}

// 현재 위치 기반 지도 표시
export function displayGeoLocationMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;

      CURRENT_POSITION.La = lng;
      CURRENT_POSITION.Ma = lat;
      displayMap(CURRENT_POSITION);
    });
    return;
  }
}

// marker 목록 표시
export function displayMarkers() {
  let markers = [];

  MARKERS.forEach(function (marker) {
    markerInfoHoverEvent(marker.marker, PIN_INFO_WINDOW);
    markerInfoClickEvent(marker);
    markerClickZoomInEvent(marker.marker);
    markers.push(marker.marker);
  });
  mapRangeSetup(markers);

  CLUSTERER.addMarkers(markers);
}

export function removeAllMarker() {
  MARKERS.forEach(function (marker) {
    marker.marker.setMap(null);
  });

  MARKERS.length = 0;
  CLUSTER_OVRELAY.setMap(null);
  CLUSTER_OVRELAY.setContent(null);
  CLUSTER_OVERLAY_CONTENT.textContent = "";
  CLUSTERER.clear();
}

// pin 목록 기반 지도 범위 설정
export function mapRangeSetup(markers) {
  let bounds = new kakao.maps.LatLngBounds();

  markers.forEach(function (marker) {
    bounds.extend(marker.getPosition());
  });

  MAP.setBounds(bounds);
}
