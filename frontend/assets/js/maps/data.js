// marker : 지도에 표시되는 장소
// pin : 서버에서 가져온 장소

// lat (latitude) : 위도, y축
// lng (longitude) : 경도, x축

export const origin = 'http://127.0.0.1:8000';

const DEFAULT_LATITUDE = 37.566968;
const DEFAULT_LONGITUDE = 126.978154;
export const CURRENT_POSITION = new kakao.maps.LatLng(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
export const INIT_MAP_LEVEL = 3;
export const PIN_INFO_WINDOW = new kakao.maps.InfoWindow({});

export const $container = document.getElementById('map');
export const MAP_OPTIONS = { center: CURRENT_POSITION, level: INIT_MAP_LEVEL};
export const MAP = new kakao.maps.Map($container, MAP_OPTIONS);
export const BASE_MAP_LEVEL = {value:MAP_OPTIONS.level};

export const $searchResultList = document.getElementById('search_results');
export const $searchResultBox = document.getElementById('search_result_box');
export const $keyword = document.getElementById('keyword');
export const $searchPagination = document.getElementById('search_pagination');
export const $keywordSearchBtn = document.getElementById('keywordSearchBtn');

export const $pinContentBox = document.getElementById('pin_content_box');
export const $pinDetailTitle = document.getElementById('pin_detail_title');
export const $pinDetailCategory = document.getElementById('pin_detail_category');
export const $pinDetailRoadAddressName = document.getElementById('pin_detail_road_address_name');
export const $pinDetailAddressName = document.getElementById('pin_detail_address_name');
export const $pinDetailPhone = document.getElementById('pin_detail_phone');
export const $pinContents = document.getElementById('pin_contents');
export const $pinContentBoxCloseBtn = document.getElementById('pin_detail_close_btn');
export const PIN_CONTENTS_NEXT_ENDPOINT = {value:''};

export const MARKER = new kakao.maps.Marker({
        clickable: true
});
export const MARKERS = [];

export const PLACE = new kakao.maps.services.Places();
export const CLUSTERER = new kakao.maps.MarkerClusterer({
    map:MAP,
    averageCenter: true,
    minLevel: 2,
    minClusterSize: 4,
    disableClickZoom: true
});
export const CLUSTER_OVRELAY = new kakao.maps.CustomOverlay({
    map: MAP,
    clickable: true
});
export const CLUSTER_OVERLAY_CONTENT = document.createElement('div');
CLUSTER_OVERLAY_CONTENT.classList.add('overlaybox');
CLUSTER_OVERLAY_CONTENT.addEventListener('mouseover', (e)=>{
    MAP.setZoomable(false);
}, false);

CLUSTER_OVERLAY_CONTENT.addEventListener('mouseout', (e)=>{
    MAP.setZoomable(true);
}, false);