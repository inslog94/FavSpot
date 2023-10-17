import { PIN_DETAIL, CURRENT_PIN, MARKER_IMG } from '../data.js';

export function createStaticMap(pinData = PIN_DETAIL) {
  const lat_lng = pinData.lat_lng.split(',');
  CURRENT_PIN.value = pinData;

  // 기존에 staticMap 클래스를 가진 div 요소가 있다면 제거
  const existingStaticMapDiv = document.querySelector('.staticMap');
  if (existingStaticMapDiv) {
    existingStaticMapDiv.remove();
  }

  // 새로운 div 요소 생성
  let staticMapDiv = document.createElement('div');

  // div 요소의 id, 클래스, 스타일 설정
  staticMapDiv.id = 'staticMap';
  staticMapDiv.className = 'staticMap'; // 새로 추가하는 요소에 클래스 추가
  staticMapDiv.style.width = '80%';
  staticMapDiv.style.height = '40vh';

  // 부모 요소에 새로 생성한 div 요소 추가
  const parentContainer = document.querySelector('.static-container');
  parentContainer.appendChild(staticMapDiv);

  const staticMapContainer = document.getElementById('staticMap'), // 이미지 지도를 표시할 div
    staticMapOption = {
      center: new kakao.maps.LatLng(lat_lng[0], lat_lng[1]), // 이미지 지도의 중심좌표
      level: 3, // 이미지 지도의 확대 레벨
      marker: MARKER_IMG,
    };

  // 이미지 지도를 표시할 div와 옵션으로 이미지 지도를 생성합니다
  const staticMap = new kakao.maps.StaticMap(staticMapDiv, staticMapOption);

  // staticMap div 요소를 가져옵니다.
  staticMapDiv = document.getElementById('staticMap');

  // staticMap div 요소의 가로 (너비) 크기를 가져옵니다.
  const width = staticMapDiv.offsetWidth;

  // staticMap div 요소의 세로 (높이) 크기를 가져옵니다.
  const height = staticMapDiv.offsetHeight;

  // div 요소를 선택합니다.
  staticMapDiv = document.getElementById('staticMap');

  // div 요소 내부에 있는 a 태그를 선택합니다.
  const aTag = staticMapDiv.querySelector('a');

  // a 태그 내부에 있는 img 태그를 선택합니다.
  const imgTag = aTag.querySelector('img');
  const currentSrc = imgTag.src;

  function updateImgSrc(url, width, height) {
    // URL을 파싱하여 파라미터 객체를 만듭니다.
    const urlObj = new URL(url);

    // width와 height 값을 업데이트합니다.
    urlObj.searchParams.set('IW', width);
    urlObj.searchParams.set('IH', height);

    // 업데이트된 URL을 문자열로 반환합니다.
    return urlObj.toString();
  }

  const newSrc = updateImgSrc(currentSrc, width, height);
  console.log(newSrc);
  imgTag.src = newSrc;
  imgTag.style.width = `${width}px`;
  imgTag.style.height = `${height}px`;
}
