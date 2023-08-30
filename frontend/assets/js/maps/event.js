import { displayMainBoards, getBoards, setMyBoard } from './board.js';
import { $container, MAP, MAP_OPTIONS, MARKER, CURRENT_POSITION, INIT_MAP_LEVEL, PIN_INFO_WINDOW, $keyword, $keywordSearchBtn, MARKERS, CLUSTERER, CLUSTER_OVRELAY, CLUSTER_OVERLAY_CONTENT, BASE_MAP_LEVEL, MARKER_OVERLAY_CONTENT, MARKER_OVERLAY, MARKER_OVERLAY_CONTENT_BOX, $screenBtn, screenMode, PIN_SAVE_OVERLAY, PIN_SAVE_OVERLAY_CONTENT, MY_BOARDS } from './data.js';
import { displayGeoLocationMap, displayMarkers, closeZoomInLocation, fullScreen, fullScreenEnd } from './map.js';
import { getPinContents, pinSimpleSave } from './pin.js';
import { searchPlaceAsKeyword } from './search.js';

// 지도 초기화
function mapSetup() {
    MAP_OPTIONS.center = CURRENT_POSITION;
    MAP_OPTIONS.level = INIT_MAP_LEVEL;


    // 지도 타입, 확대/축소
    let mapTypeControl = new kakao.maps.MapTypeControl();
    let zoomControl = new kakao.maps.ZoomControl();
    MAP.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    MAP.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    kakao.maps.event.addListener(MAP, 'click', mouseEvent=> {
        CLUSTER_OVRELAY.setContent(null);
        CLUSTER_OVRELAY.setMap(null);
        MARKER_OVERLAY.setContent(null);
        MARKER_OVERLAY.setMap(null);
        PIN_SAVE_OVERLAY.setContent(null);
        PIN_SAVE_OVERLAY.setMap(null);
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
                newOverlayPosition = new kakao.maps.LatLng(overlayPosition.getLat()+0.0003, overlayPosition.getLng());    
            } else { // 지도 확대
                newOverlayPosition = new kakao.maps.LatLng(overlayPosition.getLat()-0.0003, overlayPosition.getLng());    
            }

            CLUSTER_OVRELAY.setPosition(newOverlayPosition);
            CLUSTERER.redraw();
        }
    });
}

function markerCreateEvent() {
    // 마커 드래그 기능
    MARKER.setDraggable(true);

    // 지도 클릭시 마커 생성 이벤트
    kakao.maps.event.addListener(MAP, 'click', function(mouseEvent) {

        let mapLevel = MAP.getLevel();
        let position = mouseEvent.latLng;

        MARKER.setPosition(position);
        MARKER.setMap(MAP);
    });
}

// 마커 mouseover시 상호명 표시
export function markerInfoHoverEvent(marker, infoWindow) {

    let content = marker.getTitle();
    if (content === null || content === undefined || content.length <= 0) {
        return;
    }

    kakao.maps.event.addListener(marker, 'mouseover', function() {
        infoWindow.setContent(content);
        infoWindow.open(MAP, marker);
    });

    kakao.maps.event.addListener(marker, 'mouseout', function() {
        infoWindow.close();
    });

}

// 마커 클릭시 오버레이
export function markerInfoClickEvent(markerInfo) {

    if (markerInfo.title === null || markerInfo.title === undefined || markerInfo.title.length <= 0) {
        return;
    }

    kakao.maps.event.addListener(markerInfo.marker, 'click', function() {
        displayMarkerDetailInfo(markerInfo);
    });
}

// 마커 오버레이(메타 데이터 표시)
export function displayMarkerDetailInfo(markerInfo) {
    MARKER_OVERLAY.setMap(null);
    MARKER_OVERLAY.setContent(null);
    MARKER_OVERLAY_CONTENT.textContent = "";
    PIN_INFO_WINDOW.close();

    let titleBox = document.createElement('div'); 
    let infoBox = document.createElement('div');
    let functionBox = document.createElement('div');

    let titleEl = document.createElement('span');
    let categoryEl = document.createElement('span');
    let contentBody = document.createElement('div');        
    let addressNameEl = document.createElement('div');
    let roadAddressNameEl = document.createElement('div');
    let phoneEl = document.createElement('div');
    let contentBtn = document.createElement('div');
    let saveBtn = document.createElement('div');

    titleBox.classList.add('title_box');
    titleEl.classList.add('title');
    categoryEl.classList.add('category');
    contentBody.classList.add('body');
    infoBox.classList.add('desc');
    roadAddressNameEl.classList.add('ellipsis');
    addressNameEl.classList.add('jibun', 'ellipsis');
    phoneEl.classList.add('phone');
    functionBox.classList.add('func');
    contentBtn.classList.add('btn');
    saveBtn.classList.add('btn');

    titleEl.innerText = markerInfo.title;
    addressNameEl.innerText = markerInfo.addressName;
    roadAddressNameEl.innerText = markerInfo.roadAddressName;
    categoryEl.innerText = markerInfo.categoryGroupName;
    phoneEl.innerText = markerInfo.phone;
    contentBtn.innerText = '핀 보기';
    saveBtn.innerText = '핀 생성';

    functionBox.appendChild(contentBtn);
    functionBox.appendChild(saveBtn);
    titleBox.appendChild(titleEl);
    titleBox.appendChild(categoryEl);
    infoBox.appendChild(roadAddressNameEl);
    infoBox.appendChild(addressNameEl);
    infoBox.appendChild(phoneEl);
    infoBox.appendChild(functionBox);

    contentBtn.addEventListener('click', ()=> {

    });

    // 핀 생성 버튼 클릭시 보드 목록 표시
    saveBtn.addEventListener('click', ()=> {
        
        let open = PIN_SAVE_OVERLAY.getVisible();
        if (open) {
            PIN_SAVE_OVERLAY_CONTENT.textContent = "";
            PIN_SAVE_OVERLAY.setContent(null);    
            PIN_SAVE_OVERLAY.setMap(null);
            PIN_SAVE_OVERLAY.setVisible(false);
            return;
        }

        MY_BOARDS.forEach(board=>{
            let boardBox = document.createElement('div');
            let titleBox = document.createElement('div');
            let thumnail = document.createElement('img');
            let title = document.createElement('span');
            let pinSaveBtn = document.createElement('div');

            title.innerText = board.title;
            pinSaveBtn.innerText = '생성';
            if (board.thumnail_imgs === null || board.thumnail_imgs === undefined || board.thumnail_imgs.length === 0) {
                thumnail.src = 'assets/img/favspot.png';
            } else {
                thumnail.src = board.thumnail_imgs[0];
            }
            thumnail.style.width = '50px';
            thumnail.style.height = '40px';
            thumnail.style.marginRight = '7px';

            titleBox.appendChild(thumnail);
            titleBox.append(title);
            boardBox.appendChild(titleBox);
            boardBox.appendChild(pinSaveBtn);
          
            boardBox.classList.add('pin_save_board');
            pinSaveBtn.classList.add('pin_save_btn');

            pinSaveBtn.addEventListener('click', ()=>{
                pinSimpleSave(board, markerInfo)
            });

            PIN_SAVE_OVERLAY_CONTENT.appendChild(boardBox);
        });
                      
        PIN_SAVE_OVERLAY.setContent(PIN_SAVE_OVERLAY_CONTENT);
        PIN_SAVE_OVERLAY.setPosition(markerInfo.position);
        PIN_SAVE_OVERLAY.setMap(MAP);
        PIN_SAVE_OVERLAY.setVisible(true);
    });


    // 이미지 처리
    if(markerInfo.photo !== null && markerInfo.photo !== undefined) {
        let imgBox = document.createElement('div');
        let img = document.createElement('img');
        img.alt = '이미지';
        imgBox.classList.add('img');
        imgBox.appendChild(img);
        contentBody.appendChild(imgBox);
    } else {
        MARKER_OVERLAY_CONTENT_BOX.style.width = '290px';
        MARKER_OVERLAY_CONTENT_BOX.style.marginLeft = '-145px';
        MARKER_OVERLAY_CONTENT.style.width = '290px';
    }
    contentBody.appendChild(infoBox);

    MARKER_OVERLAY_CONTENT.appendChild(titleBox);
    MARKER_OVERLAY_CONTENT.appendChild(contentBody);
    
    MARKER_OVERLAY.setContent(MARKER_OVERLAY_CONTENT_BOX);
    MARKER_OVERLAY.setPosition(markerInfo.position);
    MARKER_OVERLAY.setMap(MAP);
}

export function markerDetailContentClickEvent(marker) {

}

export function markerClickZoomInEvent(marker) {
    kakao.maps.event.addListener(marker, 'click', mouseEvent=> {

        let mapLevel = MAP.getLevel();
        
        if(mapLevel > 5) {
            let position = marker.getPosition();
            closeZoomInLocation(position);
        }
    });
}

// 마커 클릭시 숨김 처리
export function markerClickRemoveEvent(marker, infoWindow) {
    kakao.maps.event.addListener(marker, 'click', function() {
        infoWindow.close();
        marker.setMap(null);
    });
}

// KAKAO AIP 키워드 검색 이벤트 처리
function keywordSearchSetup() {
    $keywordSearchBtn.addEventListener('click', searchPlaceAsKeyword);
    $keyword.addEventListener('keydown', (e)=>{
        if (e.key === 'Enter') {
            searchPlaceAsKeyword();
        }
    })
}

// 클러스터 클릭시 클러스터 오버레이 표시
function clusterClickEvent() {
    kakao.maps.event.addListener(CLUSTERER, 'clusterclick', cluster=>{
        let mapLevel = MAP.getLevel();

        if(mapLevel > 3) {
            MAP.setLevel(mapLevel-1, {anchor: cluster.getCenter()});
            return;
        }

        CLUSTER_OVRELAY.setContent(null);
        CLUSTER_OVRELAY.setMap(null);
        CLUSTER_OVERLAY_CONTENT.textContent = "";

        let clusterMarkers = cluster.getMarkers();

        clusterMarkers.forEach(marker => {
            let info = document.createElement('div');
            info.innerHTML = marker.getTitle();
            info.classList.add('overlayinfo');
            CLUSTER_OVERLAY_CONTENT.appendChild(info);
        });
        
        
        let position = cluster.getCenter();
        let overlayPosition

        if (mapLevel == 3) {
            overlayPosition = new kakao.maps.LatLng(position.getLat()+0.00075, position.getLng()-0.00023);
        } else {
            overlayPosition = new kakao.maps.LatLng(position.getLat()+0.00045, position.getLng()-0.00023);
        }
        
        CLUSTERER.redraw(); // 클러스터 클릭 이벤트 발생시 해당 클러스가 사라지므로 redraw
        CLUSTER_OVRELAY.setContent(CLUSTER_OVERLAY_CONTENT);
        CLUSTER_OVRELAY.setPosition(overlayPosition);
        CLUSTER_OVRELAY.setMap(MAP);
    });
}

// 메인 페이지 화면 버튼 이벤트
function mapFullScreenClickEvent() {
    $screenBtn.addEventListener('click', ()=> {
        
        if (screenMode.fullScreen) {
            fullScreenEnd();
        } else {
            fullScreen();
        }
        
    });
}

// 메인 페이지 보드 채우기
export async function mainBoardSetup() {
    let boards = await getBoards();
    displayMainBoards(boards);
}

// 전체 기능 초기화
window.onload = function init() {
    displayGeoLocationMap();
    mapSetup();
    // markerInfoWindowEvent();
    // markerClickRemoveEvent(MARKER, PIN_INFO_WINDOW);
    markerClickZoomInEvent(MARKER);
    keywordSearchSetup();
    clusterClickEvent();
    mapFullScreenClickEvent();
    mainBoardSetup();
    setMyBoard();
}