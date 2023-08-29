import { origin } from "../maps/data.js";

export async function pinContentsRequest(placeName, lat, lng) {

    let url =  origin + '/pin/' + placeName + '/' + lat + ',' + lng + '/';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });

    return response.json();
}

export async function boardRequest(keyword) {
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