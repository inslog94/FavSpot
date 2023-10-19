export function createMainPage() {
  // 기존 main-container 요소 가져오기
  const mainContainer = document.getElementById('main-container');

  // Main 요소 생성
  const main = document.createElement('main');
  main.style.display = 'flex';

  // 지도와 검색 결과를 포함하는 map_wrap div 생성
  const mapWrapDiv = document.createElement('div');
  mapWrapDiv.className = 'map_wrap';
  mapWrapDiv.style.height = '98.75%';

  // 지도 div 생성
  const mapDiv = document.createElement('div');
  mapDiv.id = 'map';

  // 검색 결과 상자인 search_result_box div 생성
  const searchResultBoxDiv = document.createElement('div');
  searchResultBoxDiv.id = 'search_result_box';
  searchResultBoxDiv.className = 'bg_white';

  // 검색 옵션을 담은 option div 생성
  const optionDiv = document.createElement('div');

  const keywordInput = document.createElement('input');
  keywordInput.type = 'text';
  keywordInput.value = '';
  keywordInput.id = 'keyword';
  keywordInput.size = '15';

  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.className = 'button';
  searchButton.id = 'keywordSearchBtn';
  searchButton.textContent = '검색';

  optionDiv.appendChild(document.createTextNode('키워드 : '));
  optionDiv.appendChild(keywordInput);
  optionDiv.appendChild(searchButton);

  // 수평선 hr 생성
  const hrElement = document.createElement('hr');

  // 검색 결과 목록을 담은 ul 생성
  const searchResultsUl = document.createElement('ul');
  searchResultsUl.id = 'search_results';

  // 검색 결과 페이지네이션을 담은 div 생성
  const searchPaginationDiv = document.createElement('div');
  searchPaginationDiv.id = 'search_pagination';

  // 전체화면 버튼 생성
  const screenButton = document.createElement('button');
  screenButton.id = 'screen_btn';
  screenButton.className = 'button full_screen_btn';
  screenButton.textContent = '전체화면';

  // 정렬 드롭다운 + 보드 목록
  const mainBoardContainerDiv = document.createElement('div');

  // 정렬 드롭다운 생성
  const sortSelect = document.createElement('div');
  sortSelect.id = 'sortSelect';
  sortSelect.style =
    'display:flex; justify-content: flex-end; margin-right: 10px';
  sortSelect.style.position = 'relative';

  const dropText = document.createElement('span');
  dropText.textContent = 'Sort';
  dropText.style = 'font-size:large';

  const dropIcon = document.createElement('i');
  dropIcon.className = 'fa fa-caret-down';
  dropIcon.style = 'margin-left:8px; font-size:x-large';
  dropIcon.style.cursor = 'pointer';

  // 드롭다운 옵션 박스
  const dropOptionBox = document.createElement('div');
  dropOptionBox.style.display = 'none';
  dropOptionBox.style.flexDirection = 'column';
  dropOptionBox.style.position = 'absolute';
  dropOptionBox.style.right = '0';
  // dropOptionBox.style.top ='112px';
  dropOptionBox.style.zIndex = '2';
  dropOptionBox.style.backgroundColor = 'rgb(247 224 224)';
  dropOptionBox.style.marginRight = '5px';
  dropOptionBox.style.borderRadius = '10px';
  dropOptionBox.style.overflow = 'hidden';
  dropOptionBox.style.boxShadow = '5px 5px 10px rgba(0,0,0,.5)';
  dropOptionBox.style.fontSize = 'medium';

  const dropOption1 = document.createElement('a');
  dropOption1.className = 'drop1';
  dropOption1.textContent = '최신순';

  const dropOption2 = document.createElement('a');
  dropOption2.className = 'drop2';
  dropOption2.textContent = '좋아요순';

  const dropOption3 = document.createElement('a');
  dropOption3.className = 'drop3';
  dropOption3.textContent = '핀개수순';

  dropOptionBox.appendChild(dropOption1);
  dropOptionBox.appendChild(dropOption2);
  dropOptionBox.appendChild(dropOption3);

  sortSelect.appendChild(dropText);
  sortSelect.appendChild(dropIcon);
  sortSelect.appendChild(dropOptionBox);

  // 드롭다운 아이콘에 클릭 이벤트 리스너 추가
  dropIcon.addEventListener('click', function () {
    if (getComputedStyle(dropOptionBox).display === 'none') {
      dropOptionBox.style.display = 'flex'; // 옵션 박스 보이기
    } else {
      dropOptionBox.style.display = 'none'; // 옵션 박스 숨기기
    }
  });

  // 드롭다운 이외의 영역 클릭 시 드롭다운 숨김 처리
  document.addEventListener('click', function (event) {
    const target = event.target;

    // 클릭된 요소가 드롭다운 영역인지 확인
    if (!dropOptionBox.contains(target) && target !== dropIcon) {
      dropOptionBox.style.display = 'none';
    }
  });

  // Main Board를 담은 div 생성
  const mainBoardDiv = document.createElement('div');
  mainBoardDiv.id = 'main_board';
  mainBoardDiv.className = 'main_board_list';

  // Main Board Container에 정렬 드롭다운과 Main Board 추가
  mainBoardContainerDiv.appendChild(sortSelect);
  mainBoardContainerDiv.appendChild(dropOptionBox);
  mainBoardContainerDiv.appendChild(mainBoardDiv);

  // Main Board와 검색 결과 상자를 map_wrap div에 추가
  mapWrapDiv.appendChild(mapDiv);
  mapWrapDiv.appendChild(searchResultBoxDiv);

  // 검색 결과 상자에 검색 옵션, 수평선, 검색 결과, 페이지네이션 추가
  searchResultBoxDiv.appendChild(optionDiv);
  searchResultBoxDiv.appendChild(hrElement);
  searchResultBoxDiv.appendChild(searchResultsUl);
  searchResultBoxDiv.appendChild(searchPaginationDiv);

  // Main에 map_wrap, Main Board 추가
  main.appendChild(mapWrapDiv);
  main.appendChild(mainBoardContainerDiv);

  // Main을 main-container에 추가
  mainContainer.appendChild(main);
}
