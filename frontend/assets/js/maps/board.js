import { boardReadRequest, boardSimpleCreateRequest, loginUserBoardReadRequest } from "../request/content.js";
import { $boardAddModal, $boardAddModalContent, $mainBoard, MAP, MY_BOARDS, PIN_SAVE_OVERLAY, PIN_SAVE_OVERLAY_CONTENT } from "./data.js";

// 타이틀, 태그로 보드 생성
export async function boardSimpleSave(title, tags) {
    let result = await boardSimpleCreateRequest(title, tags);
    // result status code에 따른 return 처리 필요
    if (result.id > 0) {
        return true;
    }
    return false;
}

// 해당 계정의 보드 세팅
export async function setMyBoard() {
    MY_BOARDS.length = 0;

    const response = await loginUserBoardReadRequest();
    const boards = response.Boards;

    boards.forEach(board=>{
        MY_BOARDS.push(board);
    });
}

export function displayBoardsOnOverlay(markerInfo) {

    MY_BOARDS.forEach(board=>{
        let boardBox = document.createElement('div');
        let titleBox = document.createElement('div');
        let thumnail = document.createElement('img');
        let title = document.createElement('span');
        let pinSaveBtn = document.createElement('div');

        title.innerText = board.title;
        pinSaveBtn.innerText = '생성';
        if (board.thumnail_imgs === null || board.thumnail_imgs === undefined || board.thumnail_imgs.length === 0) {
            thumnail.src = 'assets/img/favspot.png';
        } else {
            thumnail.src = board.thumnail_imgs[0];
        }
        thumnail.style.width = '50px';
        thumnail.style.height = '40px';
        thumnail.style.marginRight = '7px';

        titleBox.appendChild(thumnail);
        titleBox.append(title);
        boardBox.appendChild(titleBox);
        boardBox.appendChild(pinSaveBtn);
      
        boardBox.classList.add('pin_save_board');
        pinSaveBtn.classList.add('pin_save_btn');

        // 생성 버튼 클릭 이벤트
        pinSimpleSaveEvent(pinSaveBtn, board, markerInfo);

        PIN_SAVE_OVERLAY_CONTENT.appendChild(boardBox);
    });

    // 보드 만들기 버튼/이벤트 추가
    let boardAddBtnBox = document.createElement('div');
    let boardAddBtn = document.createElement('div');
    
    boardAddBtn.innerText = '보드 만들기';
    boardAddBtnBox.classList.add('board_add_box');

    boardAddBtnBox.addEventListener('click', ()=>{
        $boardAddModal.style.display = 'flex';
        $boardAddModalContent.style.display = 'flex';
    });

    boardAddBtnBox.appendChild(boardAddBtn);
    PIN_SAVE_OVERLAY_CONTENT.appendChild(boardAddBtnBox);
                  
    PIN_SAVE_OVERLAY.setContent(PIN_SAVE_OVERLAY_CONTENT);
    PIN_SAVE_OVERLAY.setPosition(markerInfo.position);
    PIN_SAVE_OVERLAY.setMap(MAP);
    PIN_SAVE_OVERLAY.setVisible(true);
}

// 생성 버튼 클릭 이벤트
function pinSimpleSaveEvent(element, board, place) {
    let saved = false;
    element.addEventListener('click', ()=>{
        if (!saved) {
            let saveSucceess = pinSimpleSave(board, place);
            if (saveSucceess) {
                element.innerText = '생성됨';
                saved = true;
                return;
            }
        } else {
            confirm('핀을 삭제하시겠습니까?');
        }
    });
}

// 카카오 map 검색 결과와 관련된 보드 표시
export async function displayRelatedBoards(keyword) {
    let boards = await getBoards(keyword);
    displayMainBoards(boards);
}

export async function getBoards(keyword) {
    return await boardReadRequest(keyword);
}

// 메인 보드 표시
export function displayMainBoards(boards) {
    $mainBoard.textContent = '';

    let boardSet;
    for(let i=0; i<boards.length; i++) {

        if (i===6) {
            return;
        }

        if (i==0 || i%2 === 0) {
            boardSet = document.createElement('div');
            boardSet.classList.add('board_set');
        }

        let board = document.createElement('div');
        let thumnailBox = document.createElement('div');
        let thumnail = document.createElement('img');
        let infoBox = document.createElement('div');
        let info1 = document.createElement('div');
        let title = document.createElement('div');
        let pinBox = document.createElement('div');
        let pinLogo = document.createElement('img');
        let pinCount = document.createElement('span');
        let info2 = document.createElement('div');

        infoBox.classList.add('info');
        thumnailBox.classList.add('img_box');
        board.classList.add('board');

        pinLogo.style.width = '25px';
        pinLogo.style.height = '25px';
        pinLogo.alt = 'like';
        pinLogo.style.verticalAlign = 'text-top';
        pinLogo.src = 'assets/img/fav.png';

        thumnail.src = 'assets/img/favspot.png';
        thumnail.alt = 'assets/img/favspot.png';

        title.innerText = boards[i].title;
        info2.innerText = boards[i].user_id;
        pinCount.innerText = boards[i].tags;

        pinBox.appendChild(pinLogo);
        pinBox.appendChild(pinCount);

        info1.appendChild(title);
        info1.appendChild(pinBox);

        infoBox.appendChild(info1);
        infoBox.appendChild(info2);

        thumnailBox.appendChild(thumnail);

        board.appendChild(thumnailBox);
        board.appendChild(infoBox);

        boardSet.appendChild(board);

        $mainBoard.appendChild(boardSet);
    }
}