import { PIN_DETAIL, origin, CURRENT_PIN, MARKER_IMG } from '../data.js';
import { createAddress, createMenu, createPinData, createThumbnailImg } from './getPlaceInfo.js';
import { createStaticMap } from './staticMap.js';

export function createPlaceInfo(data = PIN_DETAIL) {
  // 가져온 데이터로 상세보기 정보 표시하기
  const modalTitleElement = document.getElementById('myModalLabel');
  const modalCategoryElement = document.getElementById('modalCategory');
  const updatedAt = document.querySelector('.updated-at');
  const pinCount = document.querySelector('.pin-count');
  const pagination = document.getElementById('pagination');

  if (data.pin) {
    const dataPin = data.pin;
    modalTitleElement.textContent = dataPin.title;
    modalCategoryElement.textContent = dataPin.category;
    pagination.style.display = 'flex';
    updatedAt.style.display = 'inline-block';
    pinCount.style.display = 'inline-block';

    createPinData(data, dataPin);
    createAddress(dataPin);
    createMenu(data);
    createThumbnailImg(dataPin);
    createStaticMap(dataPin);
  } else {
    modalTitleElement.textContent = data.title;
    modalCategoryElement.textContent = data.category;
    pagination.style.display = 'none';
    updatedAt.style.display = 'none';
    pinCount.style.display = 'none';
    createAddress(data);
    fetch(`${origin}/pin/no-content/${PIN_DETAIL.place_id}/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((pinData) => {
        createMenu(pinData);
        createThumbnailImg(pinData);
        createStaticMap();
      });
  }
}
