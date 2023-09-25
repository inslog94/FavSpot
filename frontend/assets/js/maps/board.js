import {
  getBoardRequest,
  boardSimpleSaveRequest,
  getLoginUserInfoRequest,
  findBoardRequest,
  pinDeleteRequest,
} from '../request/content.js';
import {
  $boardAddModal,
  $boardAddModalContent,
  $mainBoard,
  MARKERS,
  MAP,
  MY_BOARDS,
  PIN_SAVE_OVERLAY,
  PIN_SAVE_OVERLAY_CONTENT,
  ACCOUNT,
} from './data.js';
import { setMarkersFromServer, pinSimpleSave } from './pin.js';

// 타이틀, 태그로 보드 생성
export async function boardSimpleSave(title, tags) {
  let response = await boardSimpleSaveRequest(title, tags);

  if (response.status >= 400 && response.status <= 500) {
    return false;
  }

  return true;
}

// 해당 계정의 보드 세팅
export async function setMyBoard(boards) {
  MY_BOARDS.length = 0;
  let response;

  if (boards === null || boards === undefined || boards.length === 0) {
    response = await getLoginUserInfoRequest();

    if (response.status >= 400 && response.status <= 500) {
      return null;
    }

    response = await response.json();

    boards = response.results.Boards;
  }

  boards.forEach((board) => {
    MY_BOARDS.push(board);
  });
}

// 카카오 map 검색 결과와 관련된 보드 표시
export async function displayRelatedBoards(keyword) {
  let boards = await getBoards(keyword);
  displayMainBoards(boards);
}

export async function getBoards(keyword) {
  return await getBoardRequest(keyword);
}

// 메인 보드 표시
export function displayMainBoards(boards) {
  $mainBoard.textContent = '';
  const randomSet = new Set();
  let randomBoards = [];

  if (boards.length <= 0) {
    return;
  } else if (boards.length <= 6) {
    randomBoards = boards;
  }

  if (boards.length > 6) {
    for (; randomSet.size !== 6; ) {
      randomSet.add(boards[Math.floor(Math.random() * boards.length)]);
    }
    randomBoards = Array.from(randomSet);
  }

  let boardSet;
  for (let i = 0; i < randomBoards.length; i++) {
    if (i == 0 || i % 2 === 0) {
      boardSet = document.createElement('div');
      boardSet.classList.add('board_set');
    }
    const data = createBlogEntry(randomBoards[i]);
    $mainBoard.appendChild(data);
  }

  // 함수로 동적 생성
  function createBlogEntry(board) {

    const masonryItem = document.createElement('div');
    masonryItem.classList.add('masonry-item');

    const blogEntry = document.createElement('div');
    blogEntry.classList.add('blog-entry', 'mb-10');

    // Swiper 컨테이너를 포함하는 div를 생성합니다.
    const entryImage = document.createElement('div');
    entryImage.classList.add('entry-image', 'clearfix');

    const swiperContainer = document.createElement('div');
    swiperContainer.classList.add('swiper-container');

    // Swiper 슬라이드들을 감싸는 div를 생성합니다.
    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    console.log(board);
    if (board.thumbnail_imgs.length === 0) {
      const swiperSlide = document.createElement('div');
      swiperSlide.classList.add('swiper-slide');

      const img = new Image(); // 이미지 엘리먼트 생성
      img.classList.add('img-fluid');
      // img.style.maxWidth = '100%'; // 이미지가 슬라이드를 넘어가지 않도록 설정
      img.style = 'width: 250px; height: 250px; border: 3px solid #fffafa';
      img.src =
        'https://everyplacetest.s3.ap-northeast-2.amazonaws.com/images/19/profile/d1f9219a-ba25-474c-86b8-886bc612c91e';
      img.alt = '';

      swiperSlide.appendChild(img);
      swiperWrapper.appendChild(swiperSlide);
    } else {
      // 이미지 슬라이드를 위한 반복문
      board.thumbnail_imgs.forEach((imageSrc) => {
        const swiperSlide = document.createElement('div');
        swiperSlide.classList.add('swiper-slide');

        const img = new Image(); // 이미지 엘리먼트 생성
        img.classList.add('img-fluid');
        // img.style.maxWidth = '100%'; // 이미지가 슬라이드를 넘어가지 않도록 설정
        img.style = 'width: 250px; height: 250px; border: 3px solid #fffafa';
        img.src = imageSrc;
        img.alt = '';

        swiperSlide.appendChild(img);
        swiperWrapper.appendChild(swiperSlide);
      });
    }

    swiperContainer.appendChild(swiperWrapper);
    entryImage.appendChild(swiperContainer);
    blogEntry.appendChild(entryImage);

    // Swiper 초기화
    initializeSwiper(swiperContainer); // Swiper 초기화 함수 호출

    const blogDetail = document.createElement('div');
    blogDetail.classList.add('blog-detail');

    const entryTitle = document.createElement('div');
    entryTitle.classList.add('entry-title', 'mb-1');
    const titleLink = document.createElement('a');
    titleLink.setAttribute('href', '#');
    titleLink.textContent = board.title;

    // 본인의 비공개 보드 표기
    const entryLock = document.createElement('span');
    if (board.is_public === false) {
      const lock = document.createElement('i');
      lock.className = 'fa fa-solid fa-lock mr-10';
      lock.style.color = '#bf6447';
      entryLock.appendChild(lock);
      entryTitle.appendChild(entryLock);
    }

    entryTitle.appendChild(titleLink);
    blogDetail.appendChild(entryTitle);

    const entryMeta = document.createElement('div');
    entryMeta.classList.add('entry-meta', 'mb-10');
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    const hashTag = document.createElement('i');
    hashTag.className = 'fa fa-solid fa-hashtag';
    li.appendChild(hashTag);
    const item = document.createElement('span');
    if (board.tags.length === 0) {
      item.textContent = 'None';
    } else {
      item.textContent = board.tags.slice(0, 2).join(', ');
    }
    li.appendChild(item);

    const li2 = document.createElement('li');
    const pins = document.createElement('i');
    pins.className = 'fa fa-solid fa-map-marker';
    li2.appendChild(pins);
    const item2 = document.createElement('span');
    item2.textContent = board.pins.length;
    li2.appendChild(item2);

    const li3 = document.createElement('li');
    const star = document.createElement('i');
    star.className = 'fa fa-solid fa-star';
    li3.appendChild(star);
    const item3 = document.createElement('span');
    item3.textContent = board.likes;
    li3.appendChild(item3);

    ul.appendChild(li);
    ul.appendChild(li2);
    ul.appendChild(li3);
    entryMeta.appendChild(ul);
    blogDetail.appendChild(entryMeta);

    const entryShare = document.createElement('div');
    entryShare.classList.add('entry-share', 'clearfix', 'mt-0');
    const entryButton = document.createElement('div');
    entryButton.classList.add('entry-button');
    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('button', 'arrow');
    readMoreLink.id = board.id;
    readMoreLink.setAttribute('href', '#');
    readMoreLink.textContent = 'Board Detail';

    readMoreLink.addEventListener('click', (event) => {
      localStorage.setItem('selectedPk', board.id);
      window.location.href = 'assets/html/board_detail.html';
    });

    const arrowIcon = document.createElement('i');
    arrowIcon.classList.add('fa', 'fa-angle-right');
    readMoreLink.appendChild(arrowIcon);
    entryButton.appendChild(readMoreLink);
    entryShare.appendChild(entryButton);
    blogDetail.appendChild(entryShare);

    blogEntry.appendChild(blogDetail);
    masonryItem.appendChild(blogEntry);

    return masonryItem;
  }

  // Swiper 초기화 함수
  function initializeSwiper(container) {
    new Swiper(container, {
      loop: true,
      autoplay: {
        delay: 3000, // 각 슬라이드 간의 자동 슬라이딩 간격 (3초)
      },
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
}
