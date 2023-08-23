// marker : 지도에 표시되는 장소
// pin : 서버에서 가져온 장소

// lat (latitude) : 위도, y축
// lng (longitude) : 경도, x축

const DEFAULT_LATITUDE = 37.566968;
const DEFAULT_LONGITUDE = 126.978154;
export const CURRENT_POSITION = new kakao.maps.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
export const INIT_MAP_LEVEL = 3;
export const PIN_INFO_WINDOW = new kakao.maps.InfoWindow({});

export const $container = document.getElementById('map');
export const MAP_OPTIONS = { center: CURRENT_POSITION, level: INIT_MAP_LEVEL};
export const MAP = new kakao.maps.Map($container, MAP_OPTIONS);

export const $pinList = document.getElementById('pinList');
export const $menuBox = document.getElementById('menu_wrap');
export const $keyword = document.getElementById('keyword');
export const $pagination = document.getElementById('pagination');
export const $keywordSearchBtn = document.getElementById('keywordSearchBtn');

export const MARKER = new kakao.maps.Marker({
        clickable: true
});
export const MARKERS = [];

export const PLACE = new kakao.maps.services.Places();
export const CLUSTERER = new kakao.maps.MarkerClusterer({
    map:MAP,
    averageCenter: true,
    minLevel: 3
});