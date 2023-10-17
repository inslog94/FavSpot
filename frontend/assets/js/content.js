import { origin } from '/frontend/assets/js/data.js';
import { sortMouseEvent, sortClickEvent } from './event.js';
import { notification } from './websocket.js';


export async function getPinContentsRequest(id) {
  let url = origin + '/pin/' + id + '/';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
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

  // 정렬 드롭다운
  const dropOptions = [
    document.querySelector('.drop1'),
    document.querySelector('.drop2'),
    document.querySelector('.drop3')
  ];

  // 기존의 모든 클릭 이벤트 리스너 제거
  dropOptions.forEach((dropOption) => {
    const newDropOption = dropOption.cloneNode(true);
    dropOption.parentNode.replaceChild(newDropOption, dropOption);
  });

  // 새로운 드롭다운 옵션들에 대한 참조 업데이트
  const newDropOptions = [
    document.querySelector('.drop1'),
    document.querySelector('.drop2'),
    document.querySelector('.drop3')
  ];

  // 각 드롭다운 메뉴 항목에 대해 새로운 마우스 오버/아웃 및 클릭 이벤트 리스너 추가
  newDropOptions.forEach((newDropOption, index) => {
    sortMouseEvent(newDropOption);
    sortClickEvent(newDropOption, index, "http://127.0.0.1:8000/board", keyword);
  });

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  const resJson = await response.json();
  const requestUser = resJson.request_user.email;
  const requestUserPk = resJson.request_user.requestUserPk;
  const requestUserProfileImg = resJson.request_user.profileImg;

  if (requestUser) {
    const email = document.querySelector('#headerEmail');
    email.textContent = requestUser;
    notification(requestUserPk);
    const profileImg = document.querySelector('.profileImg');

    if (requestUserProfileImg !== 'https://favspot-fin.s3.amazonaws.com/') {
      profileImg.src = requestUserProfileImg;
      profileImg.style.borderRadius = '50%';
    }
  }

  return resJson;
}

export async function findBoardRequest(id) {
  let url = origin + '/board/' + id + '/';

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  return response.json();
}

export async function getLoginUserInfoRequest() {
  let url = origin + '/user/me/';

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  return response;
}

export async function pinSimpleSaveRequest(board, place) {
  let url = origin + '/pin/';
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      category: place.categoryGroupName,
      board_id: typeof board === 'number' ? board : board.id,
      title: place.title,
      place_id: place.place_id,
      new_address: place.roadAddressName,
      old_address: place.addressName,
      lat_lng: place.lat + ',' + place.lng,
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).catch((error) => {
    alert(error);
  });

  return response;
}

export async function pinDeleteRequest(id) {
  let url = origin + '/pin/content/' + id + '/';

  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).catch((error) => {
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
      tags: tags,
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).catch((error) => {
    alert(error);
  });

  const resJson = await response.json();
  return resJson;
}
