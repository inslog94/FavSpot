import { getLoginUserInfoRequest } from "../request/content.js";
import {
  boardSimpleSave,
  displayMainBoards,
  getBoards,
  setMyBoard,
} from "./board.js";
import { boardDetail } from "./boardDetail.js";
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
} from "./data.js";
import {
  displayGeoLocationMap,
  closeZoomInLocation,
  fullScreen,
  fullScreenEnd,
  move,
  displayMarkers,
} from "./map.js";
import { displayPinOverlay, setMarkersFromServer } from "./pin.js";
import { searchPlaceAsKeyword } from "./search.js";

// 모든 오버레이 지도에서 제거
export function removeAllOverlay() {
  CLUSTER_OVRELAY.setContent(null);
  CLUSTER_OVRELAY.setMap(null);
  MARKER_OVERLAY.setContent(null);
  MARKER_OVERLAY.setMap(null);
  MARKER_OVERLAY_CONTENT.textContent = "";
  PIN_SAVE_OVERLAY.setContent(null);
  PIN_SAVE_OVERLAY.setMap(null);
  PIN_SAVE_OVERLAY.setVisible(false);
  PIN_SAVE_OVERLAY_CONTENT.textContent = "";
}

export function removePinSaveOverlay() {
  PIN_SAVE_OVERLAY.setContent(null);
  PIN_SAVE_OVERLAY.setMap(null);
  PIN_SAVE_OVERLAY.setVisible(false);
  PIN_SAVE_OVERLAY_CONTENT.textContent = "";
}

// 지도 초기화
function mapSetup() {
  MAP_OPTIONS.center = CURRENT_POSITION;
  MAP_OPTIONS.level = INIT_MAP_LEVEL;

  // 지도 타입, 확대/축소
  let mapTypeControl = new kakao.maps.MapTypeControl();
  let zoomControl = new kakao.maps.ZoomControl();
  MAP.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
  MAP.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

  kakao.maps.event.addListener(MAP, "click", (mouseEvent) => {
    removeAllOverlay();
  });

  // 지도 확대/축소 직전, 지도 레벨 저장
  kakao.maps.event.addListener(MAP, "zoom_start", () => {
    BASE_MAP_LEVEL.value = MAP.getLevel();
  });

  // 지도 확대/축소시 클러스터 오버레이 위치 조정
  kakao.maps.event.addListener(MAP, "zoom_changed", () => {
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
  kakao.maps.event.addListener(MAP, "center_changed", function () {
    removePinSaveOverlay();
  });
}

// 마커 mouseover시 상호명 표시
export function markerInfoHoverEvent(marker, infoWindow) {
  let content = marker.getTitle();
  if (content === null || content === undefined || content.length <= 0) {
    return;
  }

  kakao.maps.event.addListener(marker, "mouseover", function () {
    infoWindow.setContent(content);
    infoWindow.open(MAP, marker);
  });

  kakao.maps.event.addListener(marker, "mouseout", function () {
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

  kakao.maps.event.addListener(markerInfo.marker, "click", function () {
    displayMarkerDetailInfo(markerInfo);
  });
}

// 마커 오버레이 표시
export async function displayMarkerDetailInfo(markerInfo) {
  MARKER_OVERLAY.setMap(null);
  MARKER_OVERLAY.setContent(null);
  MARKER_OVERLAY_CONTENT.textContent = "";
  PIN_INFO_WINDOW.close();

  move(markerInfo.position);

  displayPinOverlay(markerInfo);
}

// 보드 생성 모달 닫기 이벤트
function boardCreateModalCloseEvent() {
  window.addEventListener("click", (event) => {
    if (event.target === $boardAddModal) {
      $boardModalTitleInput.value = "";
      $boardModalTagsInput.value = "";
      $boardModalNextBtn.style.display = "block";
      $boardModalSaveBtn.style.display = "none";
      $boardInputBox1.style.display = "flex";
      $boardInputBox2.style.display = "none";
      $boardAddModal.style.display = "none";
      $boardAddModalContent.style.display = "none";
      $boardConfirmModal.style.display = "none";
    }
  });
}

function boardCloseModalBtnEvent() {
  // 보드 생성 모달 '다음' 클릭 이벤트
  $boardModalNextBtn.addEventListener("click", () => {
    $boardModalNextBtn.style.display = "none";
    $boardModalSaveBtn.style.display = "block";
    $boardInputBox1.style.display = "none";
    $boardInputBox2.style.display = "flex";
  });

  // 보드 생성 모달 '생성' 클릭 이벤트
  $boardModalSaveBtn.addEventListener("click", async () => {
    let title = $boardModalTitleInput.value;
    let tags = $boardModalTagsInput.value.split(",");
    let created = await boardSimpleSave(title, tags);

    if (created) {
      setMyBoard();
    } else {
      $boardAddResult.innerText =
        "보드를 생성하는데 문제가 발생했습니다 다시 시도해주세요";
    }

    $boardModalTitleInput.value = "";
    $boardModalTagsInput.value = "";
    $boardAddModalContent.style.display = "none";
    $boardConfirmModal.style.display = "flex";
  });

  // 보드 생성 모달 '확인' 클릭 이벤트
  $boardConfirmModalBtn.addEventListener("click", () => {
    $boardModalTitleInput.value = "";
    $boardModalTagsInput.value = "";
    $boardModalNextBtn.style.display = "block";
    $boardModalSaveBtn.style.display = "none";
    $boardInputBox1.style.display = "flex";
    $boardInputBox2.style.display = "none";
    $boardAddModal.style.display = "none";
    $boardAddModalContent.style.display = "none";
    $boardConfirmModal.style.display = "none";
    removePinSaveOverlay();
  });
}

export function markerClickZoomInEvent(marker) {
  kakao.maps.event.addListener(marker, "click", (mouseEvent) => {
    let mapLevel = MAP.getLevel();

    if (mapLevel > 5) {
      let position = marker.getPosition();
      closeZoomInLocation(position);
    }
  });
}

// KAKAO API 검색창 엔터, 버튼 클릭 감지 이벤트
function placeSearchClickEvent() {
  $keywordSearchBtn.addEventListener("click", searchPlaceAsKeyword);
  $keyword.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchPlaceAsKeyword();
    }
  });
}

// 클러스터 클릭시 클러스터 오버레이 표시
function clusterClickEvent() {
  kakao.maps.event.addListener(CLUSTERER, "clusterclick", (cluster) => {
    let mapLevel = MAP.getLevel();

    if (mapLevel > 2) {
      MAP.setLevel(mapLevel - 1, { anchor: cluster.getCenter() });
      return;
    }

    CLUSTER_OVRELAY.setContent(null);
    CLUSTER_OVRELAY.setMap(null);
    CLUSTER_OVERLAY_CONTENT.textContent = "";

    let clusterMarkers = cluster.getMarkers();

    clusterMarkers.forEach((marker) => {
      let info = document.createElement("div");
      info.innerHTML = marker.getTitle();
      info.classList.add("overlayinfo");
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

// 메인 페이지 화면 버튼 이벤트
function mapSizeEvent() {
  $screenBtn.addEventListener("click", () => {
    if (screenMode.fullScreen) {
      fullScreenEnd();
    } else {
      fullScreen();
    }
  });
}

// 메인 페이지 보드 채우기
async function mainBoardSetup() {
  let boards = await getBoards();
  displayMainBoards(boards);
}

// 로그인 여부에 따라 화면 출력
export async function loginProcess() {
  fetch(`http://127.0.0.1:8000/user/me/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let boards = data.results.Boards;
      setMyBoard(boards);
      ACCOUNT.login = true;
      requestUser.email = data.results.User.email;
      requestUser.id = data.results.User.id;
      requestUser.profileImg = data.results.User.profile_img;
      requestUser.followingList = data.results.User.following_list;

      if (requestUser) {
        const email = document.querySelector("#email");
        email.textContent = requestUser.email;
        const profileImg = document.querySelector(".profileImg");
        profileImg.src = requestUser.profileImg;
        profileImg.style.borderRadius = "50%";
      }

      const logout = document.querySelector("#logout");
      logout.addEventListener("click", (event) => {
        fetch(`http://127.0.0.1:8000/user/logout/`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.status === 200) {
              location.reload(); // 페이지 새로고침
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      const authUser = document.querySelector(".shpping-cart");
      authUser.remove();
      // div 요소 생성
      const div = document.createElement("div");
      div.className = "position-absolute top-0 end-0 mt-3";

      // 로그인 링크 생성
      const loginLink = document.createElement("a");
      loginLink.href = "login.html";
      loginLink.appendChild(document.createTextNode("Login"));

      // 가입 링크 생성
      const signupLink = document.createElement("a");
      signupLink.href = "signup.html";
      signupLink.className = "ms-3";
      signupLink.appendChild(document.createTextNode("Signup"));

      // 로그인 및 가입 링크를 div에 추가
      div.appendChild(loginLink);
      div.appendChild(signupLink);

      // 생성한 요소를 기존 요소에 추가
      const headerContent = document.getElementById("headerContent");
      headerContent.appendChild(div);
    });
}

async function boardDetailSetUp() {
  await boardDetail();
  setMarkersFromServer(CURRENT_PINS.value);
  displayMarkers();
}

// 전체 기능 초기화
window.onload = function init() {
  let path = window.location.pathname;
  let page = path.split("/").pop();

  if (
    page === "" ||
    page === "index.html" ||
    page === undefined ||
    page === null
  ) {
    loginProcess();
    displayGeoLocationMap();
    mapSetup();
    placeSearchClickEvent();
    clusterClickEvent();
    mapSizeEvent();
    boardCreateModalCloseEvent();
    boardCloseModalBtnEvent();
    mainBoardSetup();
  } else if (page === "board_detail.html") {
    displayGeoLocationMap();
    mapSetup();
    clusterClickEvent();
    boardDetailSetUp();
  } else {
    loginProcess();
  }
};
