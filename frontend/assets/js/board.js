import {
  getBoardRequest,
  boardSimpleSaveRequest,
  getLoginUserInfoRequest,
  findBoardRequest,
  pinDeleteRequest,
} from '/frontend/assets/js/content.js';
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
import { setItemsPerPage } from '/frontend/assets/js/util/responsive.js';
import { createBlogEntry } from '/frontend/assets/js/util/boardSlide.js';

// 타이틀, 태그로 보드 생성
export async function boardSimpleSave(title, tags) {
  let response = await boardSimpleSaveRequest(title, tags);

  if (response.status >= 400 && response.status <= 500) {
    return false;
  }

  return response;
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

  // boards.forEach((board) => {
  //   MY_BOARDS.push(board);
  // });
}

// 카카오 map 검색 결과와 관련된 보드 표시
export async function displayRelatedBoards(keyword) {
  let boards = await getBoards(keyword);
  boards = boards['boards'];
  displayMainBoards(boards);
}

export async function getBoards(keyword) {
  return await getBoardRequest(keyword);
}

// 메인 보드 표시
export function displayMainBoards(boards) {
  // 화면에 추가될 보드 grid 기본값 세팅
  let currentPage = 1;
  let itemsPerPage = 6;
  let totalItems = boards.length;

  // slide resize 이벤트 핸들러 등록
  window.addEventListener('resize', changeItemsPerPage);

  // slide resize 이벤트 핸들러
  function changeItemsPerPage() {
    let browserWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    let browserHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    // 브라우저 크기에 따라 보여지는 보드 개수 조절
    // console.log('Browser size:', browserWidth, browserHeight);
    itemsPerPage = setItemsPerPage(browserWidth, browserHeight, itemsPerPage);

    // 페이지 수 계산
    const maxPage = Math.ceil(totalItems / itemsPerPage);
    currentPage = Math.min(currentPage, maxPage);

    pageSetting(currentPage);

    // 보드 목록 존재에 따른 정렬 기능 표시 여부
    const sortSelectElement= document.getElementById("sortSelect");
    if (boards.length === 0) {
      sortSelectElement.style.display = 'none';
    } else {
      sortSelectElement.style.display = 'flex';
    }
  }

  function pageSetting(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    $mainBoard.textContent = '';
    // console.log(boards);

    // console.log('check', boards);
    if (boards.length === 0) {
      return;
    }
    for (let i = startIndex; i < endIndex && i < boards.length; i++) {
      // console.log(boards[i]);
      const data = createBlogEntry(boards[i]);
      $mainBoard.appendChild(data);
    }
  }

  changeItemsPerPage();
}
