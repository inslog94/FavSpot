import { getBoardRequest, boardSimpleSaveRequest, getLoginUserInfoRequest, findBoardRequest, pinDeleteRequest } from "../request/content.js";
import { $boardAddModal, $boardAddModalContent, $mainBoard, MARKERS, MAP, MY_BOARDS, PIN_SAVE_OVERLAY, PIN_SAVE_OVERLAY_CONTENT, ACCOUNT } from "./data.js";
import { registerMainPin, pinSimpleSave } from "./pin.js";

// 타이틀, 태그로 보드 생성
export async function boardSimpleSave(title, tags) {
    let response = await boardSimpleSaveRequest(title, tags);
    
    if (response.status >= 400 && response.status <= 500) {
        return false;
    }

    return true;
}

// 해당 계정의 보드 세팅
export async function setMyBoard() {
    MY_BOARDS.length = 0;

    let response = await getLoginUserInfoRequest();

    if (response.status >= 400 && response.status <= 500) {
        return null;
    }

    response = await response.json();

    const boards = response.Boards;

    boards.forEach(board=>{
        MY_BOARDS.push(board);
    });
}

// 핀 생성 추가 오버레이
export function displayBoardsOnOverlay(markerInfo) {

    if (MY_BOARDS === null || MY_BOARDS.length === 0) {
        return;
    }

    MY_BOARDS.forEach(board=>{
        let boardBox = document.createElement('div');
        let titleBox = document.createElement('div');
        let thumbnail = document.createElement('img');
        let title = document.createElement('span');
        let pinSaveBtn = document.createElement('div');

        pinSaveBtn.innerText = '생성';
        pinSaveBtn.classList.add('pin_save_btn');
        let pinsaved = false;

        // 해당 핀이 보드에 생성된 경우 '생성됨' 처리
        for (let i=0; i<board.pins.length; i++) {
            if (board.pins[i] == markerInfo.id) {
                pinSaveBtn.innerText = '생성됨';
                pinSaveBtn.classList.remove('pin_save_btn');
                pinSaveBtn.classList.add('pin_saved_btn');
                pinsaved = true;
                break;
            }
        }

        if (board.thumbnail_imgs === null || board.thumbnail_imgs === undefined || board.thumbnail_imgs.length === 0) {
            thumbnail.src = 'assets/img/favspot.png';
        } else {
            for (let i=0; i<board.thumbnail_imgs.length; i++) {
                if(board.thumbnail_imgs[i] === null || board.thumbnail_imgs[i] === undefined || board.thumbnail_imgs[i].length > 0) {
                    thumbnail.src =  board.thumbnail_imgs[i];
                    break;
                }
            }
        }

        title.innerText = board.title;
        thumbnail.style.width = '50px';
        thumbnail.style.height = '40px';
        thumbnail.style.marginRight = '7px';
        thumbnail.style.borderRadius = '10px';

        titleBox.appendChild(thumbnail);
        titleBox.append(title);
        boardBox.appendChild(titleBox);
        boardBox.appendChild(pinSaveBtn);
      
        boardBox.classList.add('pin_save_board');

        // 생성 버튼 클릭 이벤트
        pinSimpleSaveEvent(pinSaveBtn, board, markerInfo, pinsaved);

        PIN_SAVE_OVERLAY_CONTENT.appendChild(boardBox);
    });

    // 보드 만들기 버튼/이벤트 추가
    let boardAddBtnBox = document.createElement('div');
    let boardAddBtn = document.createElement('div');
    
    boardAddBtn.innerText = '보드 만들기';
    boardAddBtnBox.classList.add('board_add_box');

    boardAddBtnBox.addEventListener('click', ()=>{

        if (!ACCOUNT.login) {
            alert('로그인이 필요합니다')
            return;
        }

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
function pinSimpleSaveEvent(element, board, place, pinsaved) {

    element.addEventListener('click', async ()=>{
        if (!pinsaved) {
            let saveSucceess = pinSimpleSave(board, place);
            if (saveSucceess) {
                setMyBoard();
                element.innerText = '생성됨';
                element.classList.remove('pin_save_btn');
                element.classList.add('pin_saved_btn');
                pinsaved = true;
                return;
            }
        } else {
            if (confirm('핀을 삭제하시겠습니까?')) {
                // let response = await pinDeleteRequest(place.id);

                element.innerText = '생성';
                element.classList.remove('pin_saved_btn');
                element.classList.add('pin_save_btn');
                pinsaved = false;
            }
        }
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
        let thumbnail = document.createElement('img');
        let infoBox = document.createElement('div');
        let info1 = document.createElement('div');
        let title = document.createElement('div');
        let pinBox = document.createElement('div');
        let pinLogo = document.createElement('img');
        let pinCount = document.createElement('span');
        let user = document.createElement('div');

        infoBox.classList.add('info');
        thumnailBox.classList.add('img_box');
        board.classList.add('board');

        pinLogo.style.width = '25px';
        pinLogo.style.height = '25px';
        pinLogo.alt = 'like';
        pinLogo.style.verticalAlign = 'text-top';
        pinLogo.src = 'assets/img/fav.png';

        thumbnail.src = 'assets/img/favspot.png';
        thumbnail.alt = 'assets/img/favspot.png';
        thumbnail.addEventListener('click', async ()=>{
            let response = await findBoardRequest(boards[i].id);
            if (response.status >= 400 && response.status < 600) {
                return;
            }
            let pins = JSON.stringify(response.pins);
            window.localStorage.setItem('pins', pins);
            // location.href = '';
        });
        
        title.innerText = boards[i].title;
        user.innerText = boards[i].user_id;
        pinCount.innerText = boards[i].tags;

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