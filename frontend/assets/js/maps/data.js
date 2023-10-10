// marker : 지도에 표시되는 장소
// pin : 서버에서 가져온 장소

// lat (latitude) : 위도, y축
// lng (longitude) : 경도, x축

export const origin = 'http://127.0.0.1:8000';

const DEFAULT_LATITUDE = 37.566968;
const DEFAULT_LONGITUDE = 126.978154;
export const CURRENT_POSITION = new kakao.maps.LatLng(
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE
);
export const INIT_MAP_LEVEL = 3;
export const PIN_INFO_WINDOW = new kakao.maps.InfoWindow({});

export const $container = document.getElementById('map');
export const $staticContainer = document.getElementById('staticMap');
export const MAP_OPTIONS = { center: CURRENT_POSITION, level: INIT_MAP_LEVEL };
export const MAP = new kakao.maps.Map($container, MAP_OPTIONS);
export const BASE_MAP_LEVEL = { value: MAP_OPTIONS.level };
let imageSrc =
  'https://favspot-fin.s3.amazonaws.com/images/default/favicon.png';
let imageSize = new kakao.maps.Size(41, 45);
export const MARKER_IMG = new kakao.maps.MarkerImage(imageSrc, imageSize);

export const $searchResultList = document.getElementById('search_results');
export const $searchResultBox = document.getElementById('search_result_box');
export const $keyword = document.getElementById('keyword');
export const $searchPagination = document.getElementById('search_pagination');
export const $keywordSearchBtn = document.getElementById('keywordSearchBtn');
export const $screenBtn = document.getElementById('screen_btn');
export const screenMode = { fullScreen: false };
export const $boardAddModal = document.getElementById('board_add_modal');
export const $boardAddModalContent = document.getElementById(
  'board_content_modal'
);
export const $boardInputBox1 = document.getElementById('board_input_box1');
export const $boardInputBox2 = document.getElementById('board_input_box2');
export const $boardModalTitleInput = document.getElementById('board_add_title');
export const $boardModalTagsInput = document.getElementById('board_add_tags');
export const $boardModalNextBtn = document.getElementById('board_add_next_btn');
export const $boardModalSaveBtn = document.getElementById('board_add_c_btn');
export const $boardConfirmModal = document.getElementById(
  'board_confirm_modal'
);
export const $boardConfirmModalBtn = document.getElementById(
  'board_add_confirm_btn'
);
export const $boardAddResult = document.getElementById('board_add_result');
export const ACCOUNT = { login: false };
export const $mainBoard = document.getElementById('main_board');
export const $accountBtn = document.getElementById('account_btn');

export const MARKER = new kakao.maps.Marker({
  clickable: true,
});
export const MARKERS = [];

export const PLACE = new kakao.maps.services.Places();
export const CLUSTERER = new kakao.maps.MarkerClusterer({
  map: MAP,
  averageCenter: true,
  minLevel: 2,
  minClusterSize: 4,
  disableClickZoom: true,
});
export const CLUSTER_OVRELAY = new kakao.maps.CustomOverlay({
  map: MAP,
  clickable: true,
});
export const CLUSTER_OVERLAY_CONTENT = document.createElement('div');
CLUSTER_OVERLAY_CONTENT.classList.add('overlaybox');
CLUSTER_OVERLAY_CONTENT.addEventListener(
  'mouseover',
  (e) => {
    MAP.setZoomable(false);
  },
  false
);

CLUSTER_OVERLAY_CONTENT.addEventListener(
  'mouseout',
  (e) => {
    MAP.setZoomable(true);
  },
  false
);

export const MARKER_OVERLAY = new kakao.maps.CustomOverlay({
  map: MAP,
  clickable: true,
});

export const MARKER_OVERLAY_CONTENT_BOX = document.createElement('div');
export const MARKER_OVERLAY_CONTENT = document.createElement('div');

MARKER_OVERLAY_CONTENT_BOX.appendChild(MARKER_OVERLAY_CONTENT);
MARKER_OVERLAY_CONTENT_BOX.classList.add('marker_overlay_box');
MARKER_OVERLAY_CONTENT.classList.add('marker_overlay_content');

MARKER_OVERLAY_CONTENT.addEventListener(
  'mouseover',
  (e) => {
    MAP.setZoomable(false);
  },
  false
);

MARKER_OVERLAY_CONTENT.addEventListener(
  'mouseout',
  (e) => {
    MAP.setZoomable(true);
  },
  false
);

export const PIN_SAVE_OVERLAY = new kakao.maps.CustomOverlay({
  map: MAP,
  clickable: true,
  xAnchor: -0.05,
  yAnchor: 0.2,
  zIndex: 1,
});
export const PIN_SAVE_OVERLAY_CONTENT = document.createElement('div');
PIN_SAVE_OVERLAY_CONTENT.classList.add('pin_save_overlay');
PIN_SAVE_OVERLAY_CONTENT.addEventListener(
  'mouseover',
  (e) => {
    MAP.setZoomable(false);
  },
  false
);

PIN_SAVE_OVERLAY_CONTENT.addEventListener(
  'mouseout',
  (e) => {
    MAP.setZoomable(true);
  },
  false
);
PIN_SAVE_OVERLAY.setVisible(false);

export const MY_BOARDS = [];

export const CURRENT_PINS = { value: '' };

export const CURRENT_PIN = { value: '' };

export const PIN_DETAIL = {};

export const requestUser = {
  email: '',
  id: '',
  followingList: '',
  profileImg: '',
};
