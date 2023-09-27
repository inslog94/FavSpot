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

  // Main Board를 담은 div 생성
  const mainBoardDiv = document.createElement('div');
  mainBoardDiv.id = 'main_board';
  mainBoardDiv.className = 'main_board_list';

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
  main.appendChild(mainBoardDiv);

  // Main을 main-container에 추가
  mainContainer.appendChild(main);
}
