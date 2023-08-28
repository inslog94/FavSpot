import { pinContentsRequest } from "../request/content.js";
import { MAP, PIN_INFO_WINDOW, $searchResultList, $searchResultBox, $searchPagination } from "./data.js";
import { removeAllMarker, displayMarkers, mapRangeSetup } from "./map.js";

// 서버로부터 pin 목록 가져옴
export async function getPinContents(marker) {
    return await pinContentsRequest(marker.getTitle(), marker.getPosition().getLat(), marker.getPosition().getLng());
}

// 검색 결과 페이징
export function displayPagination(pagination) {
    let fragment = document.createDocumentFragment();

    // 기존 페이지 번호 삭제
    removeAllChildNods($searchPagination);

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

    $searchPagination.appendChild(fragment);
}

// 카카오 검색 API pin 표시
export function displaySearchPlace(data) {
    
    // 마커 지우기, 검색 결과 표시, map 조정

    // 기존 검색 결과 목록 및 마커 제거
    removeAllChildNods($searchResultList);
    removeAllMarker();

    let pins = convertKaKaoDataToPins(data);

    // 검색 결과 표시
    pinListSetUp(pins);
    // 마커 표시
    displayMarkers(pins);
}

// 서버 API pin 표시
export function displayPins(data) {

    removeAllChildNods($searchResultList);
    removeAllMarker();

    let pins = convertDataToPins(data);

    pinListSetUp(pins);
    displayMarkers(pins);
}

export function convertKaKaoDataToPins(dataList) {

    let pins = [];

    dataList.forEach(function(data) {
        let pin = {};

        pin.title = data.place_name;
        pin.position = new kakao.maps.LatLng(data.y, data.x);
        pin.lat = data.y;
        pin.lng = data.x;
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

    $searchResultBox.scrollTop = 0;
    $searchResultList.appendChild(fragment);
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