import { $container, MAP, MAP_OPTIONS, MARKER, CURRENT_POSITION, INIT_MAP_LEVEL, PIN_INFO_WINDOW, $keyword, $keywordSearchBtn, MARKERS } from './data.js';
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

}

// 마커 드래그 기능
function markerSetup() {
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
export function markerHideEventSetup(marker, infoWindow) {
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

// 전체 기능 초기화
window.onload = function init() {
    displayGeoLocationMap();
    mapSetup();
    // markerSetup();
    // markerHideEventSetup(MARKER, PIN_INFO_WINDOW);
    keywordSearchSetup();
    displayMarkers(TEST_MARKERS);
}