import {
  getPinContentsRequest,
  pinSimpleSaveRequest,
} from '/frontend/assets/js/content.js';
import { setMyBoard } from './board.js';
import {
  MAP,
  $searchResultList,
  $searchResultBox,
  $searchPagination,
  MARKERS,
  MARKER_IMG,
  MARKER_OVERLAY_CONTENT_BOX,
  MARKER_OVERLAY_CONTENT,
  MARKER_OVERLAY,
  PIN_DETAIL,
  ACCOUNT,
  PIN_SAVE_OVERLAY,
  PIN_SAVE_OVERLAY_CONTENT,
  MY_BOARDS,
  $staticContainer,
  $boardAddModal,
  $boardAddModalContent,
} from './data.js';
import { displayMarkerDetailInfo } from './event.js';
import { removeAllMarker, displayMarkers, move } from './map.js';
import { pinDetail } from './pinDetail.js';

export async function pinSimpleSave(board, place) {
  let response = await pinSimpleSaveRequest(board, place);

  if (response.status >= 400 && response.status <= 500) {
    return false;
  }

  return true;
}

// 서버로부터 pin 목록 가져옴
export async function getPinContentsFromServer(id) {
  const response = await getPinContentsRequest(id);

  // 해당 장소에 대해 핀이 하나도 없는 경우
  if (response.status >= 400 && response.status < 500) {
    return null;
  }

  return await response.json();
}

// 검색 결과 페이징
export function displayPagination(pagination) {
  let fragment = document.createDocumentFragment();

  // 기존 페이지 번호 삭제
  removeAllChildNods($searchPagination);

  // 페이지 생성 및 클릭 이벤트 등록
  for (let i = 1; i <= pagination.last; i++) {
    let page = document.createElement('a');
    page.href = '#';
    page.innerHTML = i;

    if (i === pagination.current) {
      page.className = 'on';
    } else {
      page.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i);
        };
      })(i);
    }

    fragment.appendChild(page);
  }

  $searchPagination.appendChild(fragment);
}

// 카카오 검색 API pin 표시
export function displaySearchPlace(data) {
  // 마커 지우기, 검색 결과 표시, map 조정

  // 기존 검색 결과 목록 및 마커 제거
  removeAllChildNods($searchResultList);
  removeAllMarker();

  // MARKERS 값 설정, kakao result -> MARKERS
  setMarkersFromAPI(data);

  // 검색 결과 표시
  pinListSetUp();
  // 마커 표시
  displayMarkers();
}

// 서버 API pin 표시
export function displayPins(data) {
  removeAllChildNods($searchResultList);
  removeAllMarker();

  setMarkersFromAPI(data);

  pinListSetUp();
  displayMarkers();
}

// 전역변수 MARKERS 값 설정
export function setMarkersFromAPI(dataList) {
  dataList.forEach(function (data) {
    let pin = {};

    pin.title = data.place_name;
    pin.position = new kakao.maps.LatLng(data.y, data.x);
    pin.lat = data.y;
    pin.lng = data.x;
    pin.addressName = data.address_name;
    pin.categoryGroupCode = data.category_group_code;
    pin.categoryGroupName = data.category_group_name;
    pin.categoryName = data.categoryName;
    pin.place_id = data.id;
    pin.phone = data.phone;
    pin.placeURL = data.place_url;
    pin.roadAddressName = data.road_address_name;

    // 카테고리가 없을 경우 '기타' 처리
    if (
      data.category_group_name === null ||
      data.category_group_name === undefined ||
      data.category_group_name.length === 0
    ) {
      pin.categoryGroupName = '기타';
    }

    // 지번 주소가 없을 경우 공백 처리
    if (
      data.address_name === null ||
      data.address_name === undefined ||
      data.address_name.length === 0
    ) {
      pin.addressName = '지번 주소 없음';
    }

    // 도로명 주소가 없을 경우 공백 처리
    if (
      data.road_address_name === null ||
      data.road_address_name === undefined ||
      data.road_address_name.length === 0
    ) {
      pin.roadAddressName = '도로명 주소 없음';
    }

    pin.marker = new kakao.maps.Marker({
      map: MAP,
      position: pin.position,
      title: pin.title,
      image: MARKER_IMG,
    });

    MARKERS.push(pin);
  });
}

// 검색 결과 핀 -> 전역 변수 설정
export function setMarkersFromServer(dataList) {
  dataList.forEach(function (data) {
    let positions = data.lat_lng.split(',');

    data.categoryGroupName = data.category;
    data.position = new kakao.maps.LatLng(positions[0], positions[1]);
    data.place_id = data.place_id;
    data.lat = positions[0];
    data.lng = positions[1];
    data.roadAddressName = data.new_address;
    data.addressName = data.old_address;

    data.marker = new kakao.maps.Marker({
      map: MAP,
      position: data.position,
      title: data.title,
      image: MARKER_IMG,
    });
    MARKERS.push(data);
  });
}

// 서버로부터 조회한 보드의 핀 -> 전역 변수 설정
export function setMarkerFromServer(data) {
  let positions = data.lat_lng.split(',');

  data.categoryGroupName = data.category;
  data.position = new kakao.maps.LatLng(positions[0], positions[1]);
  data.place_id = data.place_id;
  data.lat = positions[0];
  data.lng = positions[1];
  data.roadAddressName = data.new_address;
  data.addressName = data.old_address;

  data.marker = new kakao.maps.Marker({
    map: MAP,
    position: data.position,
    title: data.title,
    image: MARKER_IMG,
  });
  MARKERS.push(data);
}

// 검색 결과에 표시될 리스트 설정
function pinListSetUp() {
  let fragment = document.createDocumentFragment();

  for (let i = 0; i < MARKERS.length; i++) {
    let pin = getListItem(i, MARKERS[i]);
    fragment.appendChild(pin);
  }

  $searchResultBox.scrollTop = 0;
  $searchResultList.appendChild(fragment);
}

// 검색 결과 -> html 요소 변환
function getListItem(index, places) {
  let el = document.createElement('li');

  let itemStr =
    '<span class="markerbg marker_' +
    (index + 1) +
    '"></span>' +
    '<div class="info">' +
    '   <h5>' +
    places.title +
    '</h5>';

  if (places.roadAddressName) {
    itemStr +=
      '    <span>' +
      places.roadAddressName +
      '</span>' +
      '   <span class="jibun gray">' +
      places.roadAddressName +
      '</span>';
  } else {
    itemStr += '    <span>' + places.roadAddressName + '</span>';
  }

  itemStr += '  <span class="tel">' + places.phone + '</span>' + '</div>';

  el.innerHTML = itemStr;
  el.className = 'item';
  // 리스트 요소 클릭시 오버레이 표시
  el.addEventListener('click', () => {
    move(places.position);
    displayMarkerDetailInfo(places);
  });

  return el;
}

function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

export async function displayPinOverlay(markerInfo) {
  let titleBox = document.createElement('div');
  let infoBox = document.createElement('div');
  let placeInfo = document.createElement('div');
  let imgBox = document.createElement('div');
  let functionBox = document.createElement('div');

  let titleEl = document.createElement('span');
  let categoryEl = document.createElement('span');
  let contentBody = document.createElement('div');
  let addressNameEl = document.createElement('div');
  let roadAddressNameEl = document.createElement('div');
  let phoneEl = document.createElement('div');
  let showPinDetailBtn = document.createElement('div');
  let showPinSaveOverlayBtn = document.createElement('div');

  titleBox.classList.add('title_box');
  titleEl.classList.add('title');
  categoryEl.classList.add('category');
  contentBody.classList.add('body');
  contentBody.style.marginTop = '20px';
  contentBody.style.marginBottom = '20px';
  contentBody.style.paddingLeft = '20px';
  contentBody.style.paddingRight = '20px';
  infoBox.classList.add('desc');
  roadAddressNameEl.classList.add('ellipsis');
  addressNameEl.classList.add('jibun', 'ellipsis');
  phoneEl.classList.add('phone');
  functionBox.classList.add('func');
  showPinDetailBtn.classList.add('btn', 'pin-detail');
  showPinDetailBtn.setAttribute('data-bs-toggle', 'modal');
  showPinDetailBtn.setAttribute('data-bs-target', '.bd-example-modal-lg');
  showPinSaveOverlayBtn.classList.add('btn');

  titleEl.innerText = markerInfo.title;
  addressNameEl.innerText = markerInfo.addressName;
  roadAddressNameEl.innerText = markerInfo.roadAddressName;
  categoryEl.innerText = markerInfo.categoryGroupName;
  phoneEl.innerText = markerInfo.phone;
  showPinDetailBtn.innerText = '핀 보기';
  showPinSaveOverlayBtn.innerText = '핀 생성';

  functionBox.appendChild(showPinDetailBtn);
  functionBox.appendChild(showPinSaveOverlayBtn);
  titleBox.appendChild(titleEl);
  titleBox.appendChild(categoryEl);
  placeInfo.appendChild(roadAddressNameEl);
  placeInfo.appendChild(addressNameEl);
  placeInfo.appendChild(phoneEl);
  infoBox.appendChild(placeInfo);
  infoBox.appendChild(functionBox);

  // 해당 핀의 썸네일 여부 처리
  let pinThumbnail;

  let img = document.createElement('img');
  img.alt = '장소 이미지';
  imgBox.classList.add('img');
  imgBox.style.marginLeft = '20px';
  imgBox.appendChild(img);

  fetch(`http://127.0.0.1:8000/pin/no-content/${markerInfo.place_id}/`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((pinData) => {
      if (
        !(
          pinData.thumbnail_img.includes('daumcdn') ||
          pinData.thumbnail_img.includes('kakaocdn')
        )
      ) {
        img.src =
          'https://favspot-fin.s3.amazonaws.com/images/default/main_logo.png';
      } else if (pinData.thumbnail_img) {
        console.error(pinData.thumbnail_img);
        img.src = pinData.thumbnail_img;
      } else {
        img.src =
          'https://favspot-fin.s3.amazonaws.com/images/default/main_logo.png';
      }
    })
    .catch((error) => {
      console.error(error);
    });

  contentBody.appendChild(infoBox);
  contentBody.appendChild(imgBox);

  MARKER_OVERLAY_CONTENT.appendChild(titleBox);
  MARKER_OVERLAY_CONTENT.appendChild(contentBody);

  MARKER_OVERLAY.setContent(MARKER_OVERLAY_CONTENT_BOX);
  MARKER_OVERLAY.setPosition(markerInfo.position);
  MARKER_OVERLAY.setMap(MAP);

  showPinDetailBtn.addEventListener('click', () => {
    delete PIN_DETAIL.category,
      PIN_DETAIL.place_id,
      PIN_DETAIL.title,
      PIN_DETAIL.thumbnail_img,
      PIN_DETAIL.new_address,
      PIN_DETAIL.old_address,
      PIN_DETAIL.lat_lng;
    PIN_DETAIL.category = markerInfo.categoryGroupName;
    PIN_DETAIL.place_id = markerInfo.place_id;
    PIN_DETAIL.title = markerInfo.title;
    PIN_DETAIL.thumbnail_img = pinThumbnail;
    PIN_DETAIL.new_address = markerInfo.roadAddressName;
    PIN_DETAIL.old_address = markerInfo.addressName;
    PIN_DETAIL.lat_lng = markerInfo.lat + ',' + markerInfo.lng;
    PIN_DETAIL.position = markerInfo.position;
    PIN_DETAIL.marker = markerInfo.marker;

    pinDetail();
  });

  // 유저의 보드 목록 가져오기 위한 함수
  function fetchAllBoards(url) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let boards = data.results.Boards;

          boards.forEach((board) => {
            // MY_BOARDS 업데이트
            MY_BOARDS.push(board);
          });

          // 다음 페이지가 있다면 재귀 호출
          if (data.links.next) {
            resolve(fetchAllBoards(data.links.next));
          } else {
            // 다음 페이지가 없다면 현재 Promise 해결
            resolve();
          }
        })
        .catch(reject);
    });
  }

  // 핀 생성 버튼 클릭시 보드 목록 오버레이 표시 이벤트
  showPinSaveOverlayBtn.addEventListener('click', () => {
    let open = PIN_SAVE_OVERLAY.getVisible();

    if (open) {
      PIN_SAVE_OVERLAY_CONTENT.textContent = '';
      PIN_SAVE_OVERLAY.setContent(null);
      PIN_SAVE_OVERLAY.setMap(null);
      PIN_SAVE_OVERLAY.setVisible(false);
      return;
    }

    // 유저의 모든 보드 목록 가져오기 위해 함수 호출
    fetchAllBoards(`http://127.0.0.1:8000/user/me/`)
      .then(() => {
        displayBoardsOnOverlay(markerInfo);
      })
      .catch((error) => console.error('Error:', error));
  });
}

// 핀 생성 버튼 클릭시 보드 목록 오버레이 표시
function displayBoardsOnOverlay(markerInfo) {
  MY_BOARDS.forEach((board) => {
    let boardBox = document.createElement('div');
    let titleBox = document.createElement('div');
    let thumbnail = document.createElement('img');
    let title = document.createElement('span');
    let pinSaveBtn = document.createElement('div');

    pinSaveBtn.innerText = '생성';
    pinSaveBtn.classList.add('pin_save_btn');
    let pinsaved = false;

    // 해당 핀이 보드에 생성된 경우 '생성됨' 처리
    for (let i = 0; i < board.pins.length; i++) {
      if (board.pins[i] == markerInfo.place_id) {
        pinSaveBtn.innerText = '생성됨';
        pinSaveBtn.classList.remove('pin_save_btn');
        pinSaveBtn.classList.add('pin_saved_btn');
        pinsaved = true;
        break;
      }
    }

    // 해당 보드 썸네일 처리
    if (
      board.thumbnail_imgs === null ||
      board.thumbnail_imgs === undefined ||
      board.thumbnail_imgs.length === 0
    ) {
      thumbnail.src = 'assets/img/favspot.png';
    } else {
      for (let i = 0; i < board.thumbnail_imgs.length; i++) {
        if (
          board.thumbnail_imgs[i] === null ||
          board.thumbnail_imgs[i] === undefined ||
          board.thumbnail_imgs[i].length > 0
        ) {
          thumbnail.src = board.thumbnail_imgs[i];
          break;
        }
      }
    }

    title.innerText = board.title;
    thumbnail.style.width = '50px';
    thumbnail.style.height = '40px';
    thumbnail.style.marginRight = '7px';
    thumbnail.style.borderRadius = '10px';

    titleBox.appendChild(thumbnail);
    titleBox.append(title);
    boardBox.appendChild(titleBox);
    boardBox.appendChild(pinSaveBtn);

    boardBox.classList.add('pin_save_board');

    // 핀 생성 클릭 이벤트
    pinSimpleSaveEvent(pinSaveBtn, board, markerInfo, pinsaved);

    PIN_SAVE_OVERLAY_CONTENT.appendChild(boardBox);
  });

  // 보드 만들기 버튼/이벤트 추가
  let boardAddBtnBox = document.createElement('div');
  let boardAddBtn = document.createElement('div');

  boardAddBtn.innerText = '보드 만들기';
  boardAddBtnBox.classList.add('board_add_box');

  boardAddBtnBox.addEventListener('click', () => {
    $boardAddModal.style.display = 'flex';
    $boardAddModalContent.style.display = 'flex';
  });

  boardAddBtnBox.appendChild(boardAddBtn);
  PIN_SAVE_OVERLAY_CONTENT.appendChild(boardAddBtnBox);

  PIN_SAVE_OVERLAY.setContent(PIN_SAVE_OVERLAY_CONTENT);
  PIN_SAVE_OVERLAY.setPosition(markerInfo.position);
  PIN_SAVE_OVERLAY.setMap(MAP);
  PIN_SAVE_OVERLAY.setVisible(true);
}

// 핀 생성 클릭시 핀 생성 이벤트
function pinSimpleSaveEvent(element, board, place, pinsaved) {
  element.addEventListener('click', async () => {
    if (!pinsaved) {
      let saveSucceess = pinSimpleSave(board, place);
      if (saveSucceess) {
        setMyBoard();
        element.innerText = '생성됨';
        element.classList.remove('pin_save_btn');
        element.classList.add('pin_saved_btn');
        pinsaved = true;
        return;
      }
    } else {
      if (confirm('핀을 삭제하시겠습니까?')) {
        // let response = await pinDeleteRequest(place.id);

        element.innerText = '생성';
        element.classList.remove('pin_saved_btn');
        element.classList.add('pin_save_btn');
        pinsaved = false;
      }
    }
  });
}
