export async function pinContentsRequest(placeName, lat, lng) {

    let url =  origin + '/pin' + placeName + '/' + lat + ', ' + lng + '/';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });

    response = response.json();

}