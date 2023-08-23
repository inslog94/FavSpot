import { MAP, CURRENT_POSITION, PIN_INFO_WINDOW, MARKERS, TEST_MARKERS } from './data.js';
import { markerInfoEventSetup } from './event.js';

function displayMarker(pin) {
    pin.setMap(MAP);
}

function displayMap(position) {
    MAP.setCenter(position);
}

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

export function displayMarkers(markers) {
    
    markers.forEach(function(_marker) {
        let marker = new kakao.maps.Marker({
            map: MAP,
            position: _marker.location,
            title: _marker.title
        })

        markerInfoEventSetup(marker, PIN_INFO_WINDOW);
        displayMarker(marker);
        MARKERS.push(marker);
    });
}

export function removeAllMarker() {
    MARKERS.forEach(function(marker) {
        marker.setMap(null);
        MARKERS.length = 0;
    });
}

export function mapRangeSetup(pins) {

    let bounds = new kakao.maps.LatLngBounds();

    pins.forEach(function(pin) {
        bounds.extend(pin.location);
    });

    MAP.setBounds(bounds);
}

