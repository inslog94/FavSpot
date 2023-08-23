import { MAP, PIN_INFO_WINDOW, $pinList, $menuBox, $pagination } from "./data.js";
import { removeAllMarker, displayMarkers } from "./map.js";

// 서버 API pin 표시
export function displayPins(data) {

    removeAllChildNods($pinList);
    removeAllMarker();

    let pins = convertDataToPins(data);

    pinListSetUp(pins);
    boundsSetup(pins);
    displayMarkers(pins);
}

function convertDataToPins(dataList) {
    let pins = [];

    dataList.forEach(function(data) {
        let pin = {};

        pins.push(pin);
    });

    return pins;
}

function pinListSetUp(pins) {

    let fragment = document.createDocumentFragment();

    for ( let i=0; i<pins.length; i++ ) {
        let pin = getListItem(i, pins[i]);
        fragment.appendChild(pin);
    }

    $menuBox.scrollTop = 0;
    $pinList.appendChild(fragment);
}

function boundsSetup(pins) {

    let bounds = new kakao.maps.LatLngBounds();

    pins.forEach(function(pin) {
        bounds.extend(pin.location);
    });

    MAP.setBounds(bounds);
}

function getListItem(index, places) {

    let el = document.createElement('li');

    let itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
        '<div class="info">' +
        '   <h5>' + places.title + '</h5>';

    if (places.roadAddressName) {
        itemStr += '    <span>' + places.roadAddressName + '</span>' +
            '   <span class="jibun gray">' + places.roadAddressName + '</span>';
    } else {
        itemStr += '    <span>' + places.roadAddressName + '</span>';
    }

    itemStr += '  <span class="tel">' + places.phone + '</span>' +
        '</div>';

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}