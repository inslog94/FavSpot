import { origin } from "../maps/data.js";

export async function pinContentsReadRequest(placeName, lat, lng) {

    let url =  origin + '/pin/' + placeName + '/' + lat + ',' + lng + '/';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });

    return response.json();
}

export async function boardReadRequest(keyword) {
    let url;

    if (keyword !== null && keyword !== undefined && keyword.length > 0) {
        url = origin + '/board/search?search_field=all&search=' + keyword;
    } else {
        url = origin + '/board/';
    }
    
    const response = await fetch(url, {
        method: 'GET',
        credentials: "include",
        headers: {
            Accept: 'application/json'
        }
    });

    return response.json();
}

export async function loginUserBoardReadRequest() {

    let url = origin + '/user/me/'

    const response = await fetch(url, {
        method: 'GET',
        credentials: "include",
        headers: {
            Accept: 'application/json'
        }
    });

    return response.json();
}

export async function pinSimpleCreateRequest(boardId, palceId) {

    let url = origin + '/pin/'

    const response = await fetch(url, {
        method: 'POST',
        body: {
            board_id: boardId,
            place_id: palceId
        },
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });

    return response.json();
}