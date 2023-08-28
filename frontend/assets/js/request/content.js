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