import { origin } from "../maps/data.js";

export async function getPinContentsRequest(id) {

    let url =  origin + '/pin/' + id + '/';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });

    return response;
}

export async function getBoardRequest(keyword) {
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

export async function findBoardRequest(id) {

    let url = origin + '/board/' + id + '/' ;

    const response = await fetch(url, {
        method: 'GET',
        credentials: "include",
        headers: {
            Accept: 'application/json'
        }
    });

    return response.json();
}

export async function getLoginUserInfoRequest() {

    let url = origin + '/user/me/'

    const response = await fetch(url, {
        method: 'GET',
        credentials: "include",
        headers: {
            Accept: 'application/json'
        }
    });

    return response;
}

export async function pinSimpleSaveRequest(board, place) {

    let url = origin + '/pin/';
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            category: place.categoryGroupName,
            board_id: board.id,
            title: place.title,
            place_id: place.placeId,
            new_address: place.roadAddressName,
            old_address: place.addressName,
            lat_lng: place.lat + ',' + place.lng,
        }),
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    }).catch(error=> {
        alert(error);
    });

    return response;
}

export async function pinDeleteRequest(id) {

    let url = origin + '/pin/content/' + id + '/';

    const response = await fetch(url, {
        method: 'DELETE',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    }).catch(error=>{
        alert(error);
    });

    return response;
}

export async function boardSimpleSaveRequest(title, tags) {
    let url = origin + '/board/';

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            tags: tags
        }),
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    }).catch(error=>{
        alert(error);
    });

    return response;
}