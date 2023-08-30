import { boardReadRequest, loginUserBoardReadRequest } from "../request/content.js";
import { $mainBoard, MY_BOARDS } from "./data.js";

// 해당 계정의 보드 세팅
export async function setMyBoard() {
    MY_BOARDS.length = 0;

    const response = await loginUserBoardReadRequest();
    const boards = response.Boards;

    boards.forEach(board=>{
        MY_BOARDS.push(board);
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