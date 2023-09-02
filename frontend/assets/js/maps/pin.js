import { getPinContentsRequest, pinSimpleSaveRequest } from "../request/content.js";
import { MAP, PIN_INFO_WINDOW, $searchResultList, $searchResultBox, $searchPagination, MARKERS, MARKER_IMG } from "./data.js";
import { displayMarkerDetailInfo, markerInfoClickEvent } from "./event.js";
import { removeAllMarker, displayMarkers, mapRangeSetup, move } from "./map.js";

export async function pinSimpleSave(board, place) {
    let response  = await pinSimpleSaveRequest(board, place);
    
    if (response.status >= 400 && response.status <= 500) {
        return false;
    }

    return true;
}

// 서버로부터 pin 목록 가져옴
export async function getPinContents(placeName, lat, lng) {
    const response = await getPinContentsRequest(placeName, lat, lng);

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

    // MARKERS 값 설정, kakao result -> MARKERS
    getMarkers(data);

    // 검색 결과 표시
    pinListSetUp();
    // 마커 표시
    displayMarkers();
}

// 서버 API pin 표시
export function displayPins(data) {

    removeAllChildNods($searchResultList);
    removeAllMarker();

    getMarkers(data);

    pinListSetUp();
    displayMarkers();
}

// 전역변수 MARKERS 값 설정
export function getMarkers(dataList) {

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

        // 카테고리가 없을 경우 '기타' 처리
        if (data.category_group_name === null || data.category_group_name === undefined || data.category_group_name.length === 0) {
            pin.categoryGroupName = '기타';
        }

        // 지번 주소가 없을 경우 공백 처리
        if (data.address_name === null || data.address_name === undefined || data.address_name.length === 0) {
            pin.addressName = '지번 주소 없음';
        }

        // 도로명 주소가 없을 경우 공백 처리
        if (data.road_address_name === null || data.road_address_name === undefined || data.road_address_name.length === 0) {
            pin.roadAddressName = '도로명 주소 없음';
        }

        pin.marker = new kakao.maps.Marker({
            map: MAP,
            position: pin.position,
            title: pin.title,
            image: MARKER_IMG
        });

        MARKERS.push(pin);
    });
    
}

export function registerMainPin(dataList) {

    dataList.forEach(function(data) {
        MARKERS.push(data);
    });

}

function pinListSetUp() {

    let fragment = document.createDocumentFragment();

    for ( let i=0; i<MARKERS.length; i++ ) {
        let pin = getListItem(i, MARKERS[i]);
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
    // 리스트 요소 클릭시 오버레이 표시
    el.addEventListener('click', ()=>{
        move(places.position);
        displayMarkerDetailInfo(places);
    })

    return el;
}

function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}