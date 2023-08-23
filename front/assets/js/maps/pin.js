import { MAP, PIN_INFO_WINDOW, $pinList, $menuBox, $pagination } from "./data.js";
import { removeAllMarker, displayMarkers } from "./map.js";

// 검색 결과 페이징
export function displayPagination(pagination) {
    let fragment = document.createDocumentFragment();

    // 기존 페이지 번호 삭제
    removeAllChildNods($pagination);

    // 페이지 생성 및 클릭 이벤트 등록
    for (let i=1; i<=pagination.last; i++) {
        let page = document.createElement('a');
        page.href = "#";
        page.innerHTML = i;

        if (i===pagination.current) {
            page.className = 'on';
        } else {
            page.onclick = (function(i) {
                return function() {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(page);
    }

    $pagination.appendChild(fragment);
}

// 카카오 검색 API pin 표시
export function displaySearchPins(data) {
    
    // 마커 지우기, 검색 결과 표시, map 조정

    // 기존 검색 결과 목록 및 마커 제거
    removeAllChildNods($pinList);
    removeAllMarker();

    let pins = convertKaKaoDataToPins(data);

    // 검색 결과 표시
    pinListSetUp(pins);
    // map 위치 조정
    boundsSetup(pins);
    // 마커 표시
    displayMarkers(pins);
}

// 서버 API pin 표시
export function displayPins(data) {

    removeAllChildNods($pinList);
    removeAllMarker();

    let pins = convertDataToPins(data);

    pinListSetUp(pins);
    boundsSetup(pins);
    displayMarkers(pins);
}

export function convertKaKaoDataToPins(dataList) {

    let pins = [];

    dataList.forEach(function(data) {
        let pin = {};

        pin.title = data.place_name;
        pin.location = new kakao.maps.LatLng(data.y, data.x);
        pin.addressName = data.address_name;
        pin.categoryGroupCode = data.category_group_code;
        pin.categoryGroupName = data.category_group_name;
        pin.categoryName = data.categoryName;
        pin.id = data.id;
        pin.phone = data.phone;
        pin.placeURL = data.place_url;
        pin.roadAddressName = data.road_address_name;

        pins.push(pin);
    });
    
    return pins;
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