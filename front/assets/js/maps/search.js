
import { PLACE, $keyword, CURRENT_POSITION } from "./data.js";
import { displaySearchPins, displayPagination } from "./pin.js";

export function searchPlaceAsKeyword() {
    let keyword = $keyword.value;
    let options = {};

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    if (keyword.startsWith('근처')) {
        searchPlaceAsKeywordOnAround(keyword);
        return;
    } 

    PLACE.keywordSearch(keyword, searchPlaceAsKeywordCB, options);
    
}

function searchPlaceAsKeywordOnAround(keyword) {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === 'denied') {
            alert('위치 액세스 차단으로 인해 검색할 수 없습니다');
            return false;
        }

        let options = {
            location: CURRENT_POSITION,
            radius: 10000,
            sort: kakao.maps.services.SortBy.DISTANCE
        }

        PLACE.keywordSearch(keyword, searchPlaceAsKeywordCB, options);
    });
}

function searchPlaceAsKeywordCB(data, status, pagination) {

    if (status === kakao.maps.services.Status.OK) {

        displaySearchPins(data);

        displayPagination(pagination);

    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

    }
}