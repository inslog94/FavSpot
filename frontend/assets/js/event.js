import { getLoginUserInfoRequest } from '/frontend/assets/js/content.js';
import {
  boardSimpleSave,
  displayMainBoards,
  getBoards,
  setMyBoard,
} from '/frontend/assets/js/board.js';
import { boardDetail } from '/frontend/assets/js/boardDetail.js';
import {
  MAP,
  MAP_OPTIONS,
  CURRENT_POSITION,
  INIT_MAP_LEVEL,
  PIN_INFO_WINDOW,
  $keyword,
  $keywordSearchBtn,
  CLUSTERER,
  CLUSTER_OVRELAY,
  CLUSTER_OVERLAY_CONTENT,
  BASE_MAP_LEVEL,
  MARKER_OVERLAY_CONTENT,
  MARKER_OVERLAY,
  MARKER_OVERLAY_CONTENT_BOX,
  $screenBtn,
  screenMode,
  PIN_SAVE_OVERLAY,
  PIN_SAVE_OVERLAY_CONTENT,
  MY_BOARDS,
  $boardAddModal,
  $boardModalNextBtn,
  $boardModalSaveBtn,
  $boardInputBox1,
  $boardInputBox2,
  $boardModalTagsInput,
  $boardModalTitleInput,
  $boardConfirmModal,
  $boardConfirmModalBtn,
  $boardAddResult,
  $boardAddModalContent,
  ACCOUNT,
  requestUser,
  CURRENT_PINS,
} from '/frontend/assets/js/data.js';
import {
  displayGeoLocationMap,
  closeZoomInLocation,
  fullScreen,
  fullScreenEnd,
  move,
  displayMarkers,
} from '/frontend/assets/js/map.js';
import {
  displayPinOverlay,
  setMarkersFromServer,
  pinSimpleSave,
} from '/frontend/assets/js/pin.js';
import { pinDetail } from '/frontend/assets/js/pinDetail.js';
import { searchPlaceAsKeyword } from '/frontend/assets/js/search.js';

let currentMarker = null;

// 모든 오버레이 지도에서 제거
export function removeAllOverlay() {
  CLUSTER_OVRELAY.setContent(null);
  CLUSTER_OVRELAY.setMap(null);
  MARKER_OVERLAY.setContent(null);
  MARKER_OVERLAY.setMap(null);
  MARKER_OVERLAY_CONTENT.textContent = '';
  PIN_SAVE_OVERLAY.setContent(null);
  PIN_SAVE_OVERLAY.setMap(null);
  PIN_SAVE_OVERLAY.setVisible(false);
  PIN_SAVE_OVERLAY_CONTENT.textContent = '';
}

export function removePinSaveOverlay() {
  PIN_SAVE_OVERLAY.setContent(null);
  PIN_SAVE_OVERLAY.setMap(null);
  PIN_SAVE_OVERLAY.setVisible(false);
  PIN_SAVE_OVERLAY_CONTENT.textContent = '';
}

// 지도 초기화
export function mapSetup() {
  MAP_OPTIONS.center = CURRENT_POSITION;
  MAP_OPTIONS.level = INIT_MAP_LEVEL;

  // 지도 타입, 확대/축소
  const currentPathname = window.location.pathname;
  if (
    !(
      currentPathname == '/frontend/index.html' ||
      currentPathname == '/frontend/'
    )
  ) {
    let mapTypeControl = new kakao.maps.MapTypeControl();
    let zoomControl = new kakao.maps.ZoomControl();
    MAP.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    MAP.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  }

  kakao.maps.event.addListener(MAP, 'click', (mouseEvent) => {
    removeAllOverlay();
  });

  // 지도 확대/축소 직전, 지도 레벨 저장
  kakao.maps.event.addListener(MAP, 'zoom_start', () => {
    BASE_MAP_LEVEL.value = MAP.getLevel();
  });

  // 지도 확대/축소시 클러스터 오버레이 위치 조정
  kakao.maps.event.addListener(MAP, 'zoom_changed', () => {
    if (CLUSTER_OVRELAY.getContent() !== null) {
      let overlayPosition = CLUSTER_OVRELAY.getPosition();
      let newOverlayPosition;
      let mapLevel = MAP.getLevel();

      if (mapLevel == 1) {
        CLUSTER_OVRELAY.setContent(null);
        CLUSTER_OVRELAY.setMap(null);
      }

      // 지도 축소
      if (mapLevel > BASE_MAP_LEVEL.value) {
        newOverlayPosition = new kakao.maps.LatLng(
          overlayPosition.getLat() + 0.0003,
          overlayPosition.getLng()
        );
      } else {
        // 지도 확대
        newOverlayPosition = new kakao.maps.LatLng(
          overlayPosition.getLat() - 0.0003,
          overlayPosition.getLng()
        );
      }

      CLUSTER_OVRELAY.setPosition(newOverlayPosition);
      CLUSTERER.redraw();
    }
  });

  // 지도 중심좌표 변경시 오버레이 삭제
  kakao.maps.event.addListener(MAP, 'center_changed', function () {
    removePinSaveOverlay();
  });
}

// 마커 mouseover시 상호명 표시
export function markerInfoHoverEvent(marker, infoWindow) {
  let content = marker.getTitle();
  if (content === null || content === undefined || content.length <= 0) {
    return;
  }

  kakao.maps.event.addListener(marker, 'mouseover', function () {
    infoWindow.setContent(content);
    infoWindow.open(MAP, marker);
  });

  kakao.maps.event.addListener(marker, 'mouseout', function () {
    infoWindow.close();
  });
}

// 마커 클릭시 오버레이 표시 이벤트
export function markerInfoClickEvent(markerInfo) {
  if (
    markerInfo.title === null ||
    markerInfo.title === undefined ||
    markerInfo.title.length <= 0
  ) {
    return;
  }

  kakao.maps.event.addListener(markerInfo.marker, 'click', function () {
    displayMarkerDetailInfo(markerInfo);
  });
}

// 마커 오버레이 표시
export async function displayMarkerDetailInfo(markerInfo) {
  MARKER_OVERLAY.setMap(null);
  MARKER_OVERLAY.setContent(null);
  MARKER_OVERLAY_CONTENT.textContent = '';
  PIN_INFO_WINDOW.close();

  move(markerInfo.position);
  currentMarker = markerInfo;

  displayPinOverlay(markerInfo);
}

// 보드 생성 모달 닫기 이벤트
function boardCreateModalCloseEvent() {
  window.addEventListener('click', (event) => {
    if (event.target === $boardAddModal) {
      $boardModalTitleInput.value = '';
      $boardModalTagsInput.value = '';
      $boardModalNextBtn.style.display = 'block';
      $boardModalSaveBtn.style.display = 'none';
      $boardInputBox1.style.display = 'flex';
      $boardInputBox2.style.display = 'none';
      $boardAddModal.style.display = 'none';
      $boardAddModalContent.style.display = 'none';
      $boardConfirmModal.style.display = 'none';
    }
  });
}

function boardCloseModalBtnEvent() {
  // 보드 생성 모달 '다음' 클릭 이벤트
  $boardModalNextBtn.addEventListener('click', () => {
    $boardModalNextBtn.style.display = 'none';
    $boardModalSaveBtn.style.display = 'block';
    $boardInputBox1.style.display = 'none';
    $boardInputBox2.style.display = 'flex';
  });

  // 보드 생성 모달 '생성' 클릭 이벤트
  $boardModalSaveBtn.addEventListener('click', async () => {
    let title = $boardModalTitleInput.value;
    let tagsInput  = $boardModalTagsInput.value

    // 태그 입력값이 비어 있지 않은 경우에만 split 실행
    let tags = tagsInput ? tagsInput.split(',') : [];

    let board = await boardSimpleSave(title, tags);

    if (board) {
      if (window.confirm('생성한 보드에 핀을 바로 등록하시겠습니까?')) {
        // 여기에 "예"를 처리하는 코드를 추가하세요.
        pinSimpleSave(board.id, currentMarker);
      }
      setMyBoard();
      // displayBoardsOnOverlay(markerInfo);
    } else {
      $boardAddResult.innerText =
        '보드를 생성하는데 문제가 발생했습니다 다시 시도해주세요';
    }

    $boardModalTitleInput.value = '';
    $boardModalTagsInput.value = '';
    $boardAddModalContent.style.display = 'none';
    $boardConfirmModal.style.display = 'flex';
  });

  // 보드 생성 모달 '확인' 클릭 이벤트
  $boardConfirmModalBtn.addEventListener('click', () => {
    $boardModalTitleInput.value = '';
    $boardModalTagsInput.value = '';
    $boardModalNextBtn.style.display = 'block';
    $boardModalSaveBtn.style.display = 'none';
    $boardInputBox1.style.display = 'flex';
    $boardInputBox2.style.display = 'none';
    $boardAddModal.style.display = 'none';
    $boardAddModalContent.style.display = 'none';
    $boardConfirmModal.style.display = 'none';
    removePinSaveOverlay();
  });
}

export function markerClickZoomInEvent(marker) {
  kakao.maps.event.addListener(marker, 'click', (mouseEvent) => {
    let mapLevel = MAP.getLevel();

    if (mapLevel > 5) {
      let position = marker.getPosition();
      closeZoomInLocation(position);
    }
  });
}

// KAKAO API 검색창 엔터, 버튼 클릭 감지 이벤트
function placeSearchClickEvent() {
  $keywordSearchBtn.addEventListener('click', searchPlaceAsKeyword);
  $keyword.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      searchPlaceAsKeyword();
    }
  });
}

// 클러스터 클릭시 클러스터 오버레이 표시
function clusterClickEvent() {
  kakao.maps.event.addListener(CLUSTERER, 'clusterclick', (cluster) => {
    let mapLevel = MAP.getLevel();

    if (mapLevel > 2) {
      MAP.setLevel(mapLevel - 1, { anchor: cluster.getCenter() });
      return;
    }

    CLUSTER_OVRELAY.setContent(null);
    CLUSTER_OVRELAY.setMap(null);
    CLUSTER_OVERLAY_CONTENT.textContent = '';

    let clusterMarkers = cluster.getMarkers();

    clusterMarkers.forEach((marker) => {
      let info = document.createElement('div');
      info.innerHTML = marker.getTitle();
      info.classList.add('overlayinfo');
      CLUSTER_OVERLAY_CONTENT.appendChild(info);
    });

    let position = cluster.getCenter();
    let overlayPosition;

    if (mapLevel == 3) {
      overlayPosition = new kakao.maps.LatLng(
        position.getLat() + 0.00075,
        position.getLng() - 0.00023
      );
    } else {
      overlayPosition = new kakao.maps.LatLng(
        position.getLat() + 0.00045,
        position.getLng() - 0.00023
      );
    }

    CLUSTERER.redraw(); // 클러스터 클릭 이벤트 발생시 해당 클러스가 사라지므로 redraw
    CLUSTER_OVRELAY.setContent(CLUSTER_OVERLAY_CONTENT);
    CLUSTER_OVRELAY.setPosition(overlayPosition);
    CLUSTER_OVRELAY.setMap(MAP);
  });
}

// 메인 페이지 보드 채우기
async function mainBoardSetup() {
  let boards = await getBoards();
  displayMainBoards(boards['boards']);
}

export async function boardDetailSetUp() {
  const selectedPk = window.localStorage.getItem('selectedPk');
  console.log(selectedPk);

  await fetch(`http://127.0.0.1:8000/board/${selectedPk}/`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      // 핀이 존재하지 않는 보드의 경우 지도 미표시
      if (data.pins.length === 0) {
        document.querySelector(".entry-image.clearfix.map").style.display = 'none';
      }
      await boardDetail(data);
      setMarkersFromServer(CURRENT_PINS.value);
      displayMarkers();
    });
}

export async function pinDetailSetUp() {
  await pinDetail();
}

// 전체 기능 초기화
window.onload = function init() {
  let path = window.location.pathname;
  let page = path.split('/').pop();

  if (
    page === '' ||
    page === 'index.html' ||
    page === undefined ||
    page === null
  ) {
    displayGeoLocationMap();
    mapSetup();
    placeSearchClickEvent();
    clusterClickEvent();
    boardCreateModalCloseEvent();
    boardCloseModalBtnEvent();
    mainBoardSetup();
  } else if (page === 'board_detail.html' || page === 'board_detail.html#') {
    displayGeoLocationMap();
    mapSetup();
    clusterClickEvent();
    boardDetailSetUp();
  } else if (myModal && myModal.style.display === 'block') {
    displayGeoLocationMap();
    mapSetup();
  }
};

// 메인페이지 보드 목록 정렬
// 마우스 오버/아웃 이벤트 핸들러
export function sortMouseEvent(dropOption) {
  dropOption.addEventListener('mouseover', function() {
    this.style.backgroundColor = '#FFFFFF';
    this.style.color = '#000000';
    this.style.cursor = 'pointer';
  });

  dropOption.addEventListener('mouseout', function() {
    this.style.backgroundColor = 'rgb(247 224 224)';
  });
}

// 클릭 이벤트 핸들러
export function sortClickEvent(dropOption, index, base_url, keyword = null) {
  dropOption.addEventListener('click', function() {
    let sort;
    let url;

    if (index === 0) { 
      sort = 'created';
    } else if (index === 1) { 
      sort = 'like';
    } else if (index ===2) { 
      sort = 'pin';
    }

    // 검색어가 있는 경우와 없는 경우에 따라 다른 URL 생성
    if (keyword !== null && keyword.length > 0) {
      url = `${base_url}/search?search_field=all&search=${keyword}&sort=${sort}`;
    } else {
      url = `${base_url}?sort=${sort}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => displayMainBoards(data.boards))
      .catch(error => console.error('Error:', error));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const dropOptions = [
    document.querySelector('.drop1'),
    document.querySelector('.drop2'),
    document.querySelector('.drop3')
  ];

  const currentPathname = window.location.pathname;
  if (
    currentPathname == '/frontend/assets/html/index.html#' ||
    currentPathname == '/frontend/assets/html/index.html'
  ) {
    // 각 드롭다운 메뉴 항목에 대해 이벤트 리스너 추가
    dropOptions.forEach((dropOption, index) => {
      sortMouseEvent(dropOption);
      sortClickEvent(dropOption, index, 'http://127.0.0.1:8000/board');
    });
  }
});