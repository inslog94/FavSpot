import { getLoginUserInfoRequest } from '../request/content.js';
import { boardSimpleSave, displayBoardsOnOverlay, displayMainBoards, getBoards, setMyBoard } from './board.js';
import { $container, MAP, MAP_OPTIONS, MARKER, CURRENT_POSITION, INIT_MAP_LEVEL, PIN_INFO_WINDOW, $keyword, $keywordSearchBtn, MARKERS, CLUSTERER, CLUSTER_OVRELAY, CLUSTER_OVERLAY_CONTENT, BASE_MAP_LEVEL, MARKER_OVERLAY_CONTENT, MARKER_OVERLAY, MARKER_OVERLAY_CONTENT_BOX, $screenBtn, screenMode, PIN_SAVE_OVERLAY, PIN_SAVE_OVERLAY_CONTENT, MY_BOARDS, $boardAddModal, $boardModalNextBtn, $boardModalSaveBtn, $boardInputBox1, $boardInputBox2, $boardModalTagsInput, $boardModalTitleInput, $boardConfirmModal, $boardConfirmModalBtn, $boardAddResult, $boardAddModalContent, ACCOUNT, $accountBtn } from './data.js';
import { displayGeoLocationMap, displayMarkers, closeZoomInLocation, fullScreen, fullScreenEnd, move } from './map.js';
import { getPinContents, pinSimpleSave } from './pin.js';
import { searchPlaceAsKeyword } from './search.js';

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

    kakao.maps.event.addListener(MAP, 'click', mouseEvent=> {
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
                newOverlayPosition = new kakao.maps.LatLng(overlayPosition.getLat()+0.0003, overlayPosition.getLng());    
            } else { // 지도 확대
                newOverlayPosition = new kakao.maps.LatLng(overlayPosition.getLat()-0.0003, overlayPosition.getLng());    
            }

            CLUSTER_OVRELAY.setPosition(newOverlayPosition);
            CLUSTERER.redraw();
        }
    });

    // 지도 중심좌표 변경시 오버레이 삭제
    kakao.maps.event.addListener(MAP, 'center_changed', function() {
        removePinSaveOverlay();
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
export async function displayMarkerDetailInfo(markerInfo) {
    MARKER_OVERLAY.setMap(null);
    MARKER_OVERLAY.setContent(null);
    MARKER_OVERLAY_CONTENT.textContent = "";
    PIN_INFO_WINDOW.close();

    move(markerInfo.position);
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
        window.localStorage.setItem('CURRENT_PIN', markerInfo.id);
        // location.href = 'test.html'
    });

    // 핀 생성 버튼 클릭시 보드 목록 표시
    saveBtn.addEventListener('click', ()=> {
        
        if (!ACCOUNT.login) {
            alert('로그인이 필요합니다');
            return;
        }

        let open = PIN_SAVE_OVERLAY.getVisible();

        if (open) {
            PIN_SAVE_OVERLAY_CONTENT.textContent = "";
            PIN_SAVE_OVERLAY.setContent(null);    
            PIN_SAVE_OVERLAY.setMap(null);
            PIN_SAVE_OVERLAY.setVisible(false);
            return;
        }

        displayBoardsOnOverlay(markerInfo);
    });


    // 해당 핀의 썸네일 여부 처리
    let pinThumbnail;
    let pinContent = await getPinContents(markerInfo.title, markerInfo.lat, markerInfo.lng);
    let boxHeight = 170;
    let contentHeight = 160;

    if (pinContent !== null) {
        pinThumbnail = pinContent.results.pin.thumbnail_img;
    }
    
    if(pinThumbnail !== null && pinThumbnail !== undefined && pinThumbnail.length > 0) {
        let imgBox = document.createElement('div');
        let img = document.createElement('img');
        img.src = pinThumbnail;
        img.alt = '이미지';
        imgBox.classList.add('img');
        imgBox.appendChild(img);
        contentBody.appendChild(imgBox);

        boxHeight += 60;
        contentHeight += 60;
        MARKER_OVERLAY_CONTENT_BOX.style.minHeight = boxHeight + 'px';
        MARKER_OVERLAY_CONTENT.style.minHeight = contentHeight + 'px';
        MARKER_OVERLAY_CONTENT.style.minWidth = '380px';
        MARKER_OVERLAY_CONTENT_BOX.style.minWidth = '380px';
        MARKER_OVERLAY_CONTENT_BOX.style.marginLeft = '-145px';
        MARKER_OVERLAY_CONTENT_BOX.style.marginLeft = '-188px';
        
    } else {
        MARKER_OVERLAY_CONTENT_BOX.style.minWidth = '290px';
        MARKER_OVERLAY_CONTENT_BOX.style.minHeight = boxHeight + 'px';
        MARKER_OVERLAY_CONTENT_BOX.style.marginLeft = '-145px';
        MARKER_OVERLAY_CONTENT.style.minWidth = '290px';
        MARKER_OVERLAY_CONTENT.style.minHeight = contentHeight + 'px';
        
        if (markerInfo.phone !== undefined && markerInfo.phone !== null && markerInfo.phone.length > 0 ) {
            boxHeight += 15;
            contentHeight += 15;
            MARKER_OVERLAY_CONTENT_BOX.style.minHeight = boxHeight + 'px';
            MARKER_OVERLAY_CONTENT.style.minHeight = contentHeight + 'px';
        }

        if (markerInfo.roadAddressName !== undefined && markerInfo.roadAddressName !== null && markerInfo.roadAddressName.length > 0 ) {
            boxHeight += 10;
            contentHeight += 10;
            MARKER_OVERLAY_CONTENT_BOX.style.minHeight = boxHeight + 'px';
            MARKER_OVERLAY_CONTENT.style.minHeight = contentHeight + 'px';
        }

        if (markerInfo.addressName !== undefined && markerInfo.addressName !== null && markerInfo.addressName.length > 0 ) {
            boxHeight += 10;
            contentHeight += 10;
            MARKER_OVERLAY_CONTENT_BOX.style.minHeight = boxHeight + 'px';
            MARKER_OVERLAY_CONTENT.style.minHeight = contentHeight + 'px';
        }

    }
    contentBody.appendChild(infoBox);

    MARKER_OVERLAY_CONTENT.appendChild(titleBox);
    MARKER_OVERLAY_CONTENT.appendChild(contentBody);
    
    MARKER_OVERLAY.setContent(MARKER_OVERLAY_CONTENT_BOX);
    MARKER_OVERLAY.setPosition(markerInfo.position);
    MARKER_OVERLAY.setMap(MAP);
}

// 보드 생성 모달 닫기 이벤트
function boardModalCloseEvent() {
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

function boardModalNextBtnClickEvent() {
    
    // 보드 생성 모달 '다음' 클릭 이벤트
    $boardModalNextBtn.addEventListener('click', ()=>{
        $boardModalNextBtn.style.display = 'none';
        $boardModalSaveBtn.style.display = 'block';
        $boardInputBox1.style.display = 'none';
        $boardInputBox2.style.display = 'flex';
    });

    // 보드 생성 모달 '생성' 클릭 이벤트
    $boardModalSaveBtn.addEventListener('click', async ()=>{
        let title = $boardModalTitleInput.value;
        let tags = $boardModalTagsInput.value.split(',');
        let created = await boardSimpleSave(title, tags);
        
        if (created) {
            setMyBoard();
        } else {
            $boardAddResult.innerText = '보드를 생성하는데 문제가 발생했습니다 다시 시도해주세요';
        }

        $boardModalTitleInput.value = '';
        $boardModalTagsInput.value = '';
        $boardAddModalContent.style.display = 'none';
        $boardConfirmModal.style.display = 'flex';

    });

    // 보드 생성 모달 '확인' 클릭 이벤트
    $boardConfirmModalBtn.addEventListener('click', ()=>{
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

// KAKAO API 키워드 검색 이벤트 처리
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

        if(mapLevel > 2) {
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
export async function mainSetup() {

    let boards = await getBoards();
    window.localStorage.removeItem('CURRENT_PIN');
    window.localStorage.removeItem('pins');
    displayMainBoards(boards);

    document.getElementById('account_login_btn').addEventListener('click', ()=>{
        if(document.getElementById('account_login_option').style.display === 'flex') {
            document.getElementById('account_login_option').style.display = 'none';
            return;    
        }
        document.getElementById('account_login_option').style.display = 'flex';
    });
}

// 로그인 여부에 따라 화면 출력
export async function loginProcess() {

    let response = await getLoginUserInfoRequest();
    response = await response.json();
    const loginEmail = response.User.email;

    if (loginEmail === undefined || loginEmail === null || loginEmail === 0) {
        document.getElementById('account_login').style.display = 'none';
        document.getElementById('account_anonymous').style.display = 'flex';
        ACCOUNT.login = false;
        return;
    }

    document.getElementById('account_login').style.display = 'flex';
    document.getElementById('account_anonymous').style.display = 'none';
    setMyBoard();
    ACCOUNT.login = true;
}

// 전체 기능 초기화
window.onload = function init() {
    loginProcess();
    displayGeoLocationMap();
    mapSetup();
    // markerInfoWindowEvent();
    // markerClickRemoveEvent(MARKER, PIN_INFO_WINDOW);
    markerClickZoomInEvent(MARKER);
    keywordSearchSetup();
    clusterClickEvent();
    mapFullScreenClickEvent();
    boardModalCloseEvent();
    boardModalNextBtnClickEvent();
    mainSetup();
}