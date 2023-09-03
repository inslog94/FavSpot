import {
  getBoardRequest,
  boardSimpleSaveRequest,
  getLoginUserInfoRequest,
  findBoardRequest,
  pinDeleteRequest,
} from "../request/content.js";
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
} from "./data.js";
import { setMarkersFromServer, pinSimpleSave } from "./pin.js";

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
  $mainBoard.textContent = "";

  if (boards.length <= 0) {
    return;
  }
  let randomBoards = [];

  let oldIndex = 999999;
  for (; randomBoards.length !== 6; ) {
    let newIndex = Math.floor(Math.random() * boards.length);
    if (oldIndex === newIndex) {
      continue;
    }
    randomBoards.push(boards[newIndex]);
    oldIndex = newIndex;
  }

  let boardSet;
  for (let i = 0; i < randomBoards.length; i++) {
    if (i == 0 || i % 2 === 0) {
      boardSet = document.createElement("div");
      boardSet.classList.add("board_set");
    }

    let board = document.createElement("div");
    let thumnailBox = document.createElement("div");
    let thumbnail = document.createElement("img");
    let infoBox = document.createElement("div");
    let info1 = document.createElement("div");
    let title = document.createElement("div");
    let pinBox = document.createElement("div");
    let pinLogo = document.createElement("img");
    let pinCount = document.createElement("span");
    let user = document.createElement("div");

    infoBox.classList.add("info");
    thumnailBox.classList.add("img_box");
    board.classList.add("board");

    pinLogo.style.width = "25px";
    pinLogo.style.height = "25px";
    pinLogo.alt = "like";
    pinLogo.style.verticalAlign = "text-top";
    pinLogo.src = "assets/img/fav.png";

    if (
      randomBoards[i].thumbnail_imgs !== null &&
      randomBoards[i].thumbnail_imgs !== undefined &&
      randomBoards[i].thumbnail_imgs.length > 0
    ) {
      for (let j = 0; j < randomBoards[i].thumbnail_imgs.length; j++) {
        if (
          randomBoards[i].thumbnail_imgs[j] !== null &&
          randomBoards[i].thumbnail_imgs[j] !== undefined &&
          randomBoards[i].thumbnail_imgs[j].length > 0
        ) {
          thumbnail.src = randomBoards[i].thumbnail_imgs[j];
          break;
        }
      }
    } else {
      thumbnail.src = "assets/img/favspot.png";
    }
    thumbnail.alt = "";
    thumbnail.addEventListener("click", async () => {
      // let response = await findBoardRequest(randomBoards[i].id);
      // if (response.status >= 400 && response.status < 600) {
      //     return;
      // }
      window.localStorage.setItem("selectedPk", randomBoards[i].id);
      location.href = "./../html/board_detail.html";
    });

    title.innerText = randomBoards[i].title;
    user.innerText = randomBoards[i].user_id;
    pinCount.innerText = randomBoards[i].tags;

    pinBox.appendChild(pinLogo);
    pinBox.appendChild(pinCount);

    info1.appendChild(title);
    info1.appendChild(pinBox);

    infoBox.appendChild(info1);
    infoBox.appendChild(user);

    thumnailBox.appendChild(thumbnail);

    board.appendChild(thumnailBox);
    board.appendChild(infoBox);

    boardSet.appendChild(board);

    $mainBoard.appendChild(boardSet);
  }
}
