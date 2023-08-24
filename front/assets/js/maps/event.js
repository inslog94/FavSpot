import { $container, MAP, MAP_OPTIONS, MARKER, CURRENT_POSITION, INIT_MAP_LEVEL, PIN_INFO_WINDOW, $keyword, $keywordSearchBtn, MARKERS, CLUSTERER, CLUSTER_OVRELAY, CLUSTER_OVERLAY_CONTENT } from './data.js';
import { displayGeoLocationMap, displayMarkers } from './map.js';
import { searchPlaceAsKeyword } from './search.js';
import { TEST_MARKERS } from './test_data.js';

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
    });

    // 지도 확대/축소시 클러스터 오버레이 위치 조정
    kakao.maps.event.addListener(MAP, 'zoom_changed', () => {

        if (CLUSTER_OVRELAY.getContent() !== null) {
            let mapLevel = MAP.getLevel();
            let overlayPosition = CLUSTER_OVRELAY.getPosition();
            let newOverlayPosition;

            if (mapLevel === 3) {
                newOverlayPosition = new kakao.maps.LatLng(overlayPosition.getLat()+0.0003, overlayPosition.getLng());    
            } else if (mapLevel === 2) {
                newOverlayPosition = new kakao.maps.LatLng(overlayPosition.getLat()-0.0003, overlayPosition.getLng());    
            }

            CLUSTER_OVRELAY.setPosition(newOverlayPosition);
            CLUSTERER.redraw();
        }
    });
}

// 마커 드래그 기능
function markerCreateEvent() {
    MARKER.setDraggable(true);

    // 지도 클릭시 마커 생성 이벤트
    kakao.maps.event.addListener(MAP, 'click', function(mouseEvent) {

        let mapLevel = MAP.getLevel();
        let position = mouseEvent.latLng;

        MARKER.setPosition(position);
        MARKER.setMap(MAP);
    });
}

// 마커 정보 표시
export function markerHoverEvent(marker, infoWindow) {

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

// 마커 클릭시 인포 윈도우 표시
export function markerClickEvent(marker, infoWindow) {

    let content = marker.getTitle();
    if (content === null || content === undefined || content.length <= 0) {
        return;
    }

    kakao.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(content);
        infoWindow.open(MAP, marker);
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

// 전체 기능 초기화
window.onload = function init() {
    displayGeoLocationMap();
    mapSetup();
    // markerCreateEvent();
    // markerClickRemoveEvent(MARKER, PIN_INFO_WINDOW);
    keywordSearchSetup();
    displayMarkers(TEST_MARKERS);
    clusterClickEvent();
}