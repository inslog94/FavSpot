export function createPinData(data, dataPin) {
  const modalPinCountElement = document.getElementById('modalPinCount');
  const modalUpdatedAtElement = document.getElementById('modalUpdatedAt');
  modalPinCountElement.innerHTML = `이 장소의 핀: <strong>${data.pin_content_count}<strong>개`;
  modalUpdatedAtElement.textContent = `업데이트: ${
    dataPin.updated_at.split('T')[0]
  }`;
}

export function createAddress(dataPin) {
  const modalNewAddressElement = document.getElementById('modalNewAddress');
  const modalOldAddressElement = document.getElementById('modalOldAddress');
  modalNewAddressElement.innerHTML = `<i class="fa fa-map-marker"></i> <b>도로명주소:</b> ${dataPin.new_address}`;
  modalOldAddressElement.innerHTML = `<i class="fa fa-map-marker"></i> <b>지번주소:</b> ${dataPin.old_address}`;
}

export function createMenu(data) {
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

export function createThumbnailImg(dataPin) {
  const subscribeIconElement = document.querySelector('.subscribe-icon');
  // thumbnail_img를 보여주기
  if (
    !(
      dataPin.thumbnail_img.includes('daumcdn') ||
      dataPin.thumbnail_img.includes('kakaocdn')
    )
  ) {
    subscribeIconElement.src =
      'https://favspot-fin.s3.amazonaws.com/images/default/main_logo.png';
    subscribeIconElement.style = 'width: 100%;';
  } else if (dataPin.thumbnail_img) {
    subscribeIconElement.src = `${dataPin.thumbnail_img}`; // thumbnail_img 사진과 연결
  } else {
    subscribeIconElement.src =
      'https://favspot-fin.s3.amazonaws.com/images/default/main_logo.png'; // 기본 사진 지정
  }
}
