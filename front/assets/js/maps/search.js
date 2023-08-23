
import { PLACE, $keyword } from "./data.js";
import { displaySearchPins, displayPagination } from "./pin.js";

export function searchPlaceAsKeyword() {
    let keyword = $keyword.value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    PLACE.keywordSearch(keyword, searchPlaceAsKeywordCB);
}

function searchPlaceAsKeywordCB(data, status, pagination) {

    if (status === kakao.maps.services.Status.OK) {

        console.log(data);
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