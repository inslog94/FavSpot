import { PIN_DETAIL, origin, CURRENT_PIN, MARKER_IMG } from '../maps/data.js';
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

function createPinData(data, dataPin) {
  const modalPinCountElement = document.getElementById('modalPinCount');
  const modalUpdatedAtElement = document.getElementById('modalUpdatedAt');
  modalPinCountElement.innerHTML = `이 장소의 핀: <strong>${data.pin_content_count}<strong>개`;
  modalUpdatedAtElement.textContent = `업데이트: ${
    dataPin.updated_at.split('T')[0]
  }`;
}

function createAddress(dataPin) {
  const modalNewAddressElement = document.getElementById('modalNewAddress');
  const modalOldAddressElement = document.getElementById('modalOldAddress');
  modalNewAddressElement.innerHTML = `<i class="fa fa-map-marker"></i> <b>도로명주소:</b> ${dataPin.new_address}`;
  modalOldAddressElement.innerHTML = `<i class="fa fa-map-marker"></i> <b>지번주소:</b> ${dataPin.old_address}`;
}

function createMenu(data) {
  const modalMenuElement = document.getElementById('modalMenu');

  // 메뉴가 있을 시 메뉴를 표 형식으로 보여주기
  if (data.menu !== null) {
    const menuItems = data.menu;
    let menuHtml = '<h5 class="mt-10 mb-20">- 메뉴 -</h5>';
    menuItems.forEach((menuItem) => {
      menuHtml += `<li><b>${menuItem.menu}</b> ${menuItem.price}</li>`;
    });
    modalMenuElement.innerHTML = menuHtml;
  } else {
    modalMenuElement.innerHTML = '<p>제공되는 메뉴가 없습니다.</p>';
  }
}

function createThumbnailImg(dataPin) {
  const subscribeIconElement = document.querySelector('.subscribe-icon');
  // thumbnail_img를 보여주기
  if (dataPin.thumbnail_img) {
    subscribeIconElement.src = `${dataPin.thumbnail_img}`; // thumbnail_img 사진과 연결
  } else {
    subscribeIconElement.src =
      'https://everyplacetest.s3.ap-northeast-2.amazonaws.com/dev/default_img.png'; // 기본 사진 지정
  }
}
