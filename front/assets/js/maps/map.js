import { MAP, CURRENT_POSITION, PIN_INFO_WINDOW, MARKERS, CLUSTERER } from './data.js';
import { markerInfoEventSetup } from './event.js';

function displayMarker(pin) {
    pin.setMap(MAP);
}

function displayMap(position) {
    MAP.setCenter(position);
}

export function zoomIn() {
    let mapLevel = MAP.getLevel();

    MAP.setLevel(mapLevel - 1);
}

export function zoomInLocation(location) {
    let mapLevel = MAP.getLevel();

    MAP.setLevel(mapLevel - 1);
    MAP.panTo(location);
}

// 현재 위치 기반 지도 표시
export function displayGeoLocationMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;

            CURRENT_POSITION.La = lng;
            CURRENT_POSITION.Ma = lat;
            displayMap(CURRENT_POSITION);
        });
        return;
    }
}

// marker 목록 표시
export function displayMarkers(dataList) {
    
    dataList.forEach(function(data) {
        let marker = new kakao.maps.Marker({
            map: MAP,
            position: data.position,
            title: data.title
        })

        markerInfoEventSetup(marker, PIN_INFO_WINDOW);
        displayMarker(marker);
        MARKERS.push(marker);
    });
    mapRangeSetup(MARKERS);
    CLUSTERER.addMarkers(MARKERS);
}

export function removeAllMarker() {
    MARKERS.forEach(function(marker) {
        marker.setMap(null);
        MARKERS.length = 0;
    });

    CLUSTERER.clear();
}

// pin 목록 기반 지도 범위 설정
export function mapRangeSetup(markers) {

    let bounds = new kakao.maps.LatLngBounds();

    markers.forEach(function(marker) {
        bounds.extend(marker.getPosition());
    });

    MAP.setBounds(bounds);
}

