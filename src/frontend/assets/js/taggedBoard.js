import { createBlogEntry } from '/assets/js/util/boardSlide.js';

export function createTaggedBoard() {
  const params = new URLSearchParams(window.location.search);
  let pk = params.get('pk');
  if (!pk) {
    pk = 'me';
  }
  const tagList = document.getElementById('tagList');
  fetch(`http://favspot.site:8000/user/${pk}/`, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      const parentElement = document.querySelector('.masonry.columns-2');
      const previousButton = document.getElementById('previousButton');
      const nextButton = document.getElementById('nextButton');

      previousButton.addEventListener('click', loadPrevPage);
      nextButton.addEventListener('click', loadNextPage);

      // 초기 페이지 번호
      let currentPage = 1;

      // 특정 태그가 등록된 유저의 보드 목록 가져오기위한 통신
      // URL의 쿼리 스트링 가져오기
      let queryString = window.location.search;

      // URLSearchParams 객체 생성
      let urlParams = new URLSearchParams(queryString);

      // 'tag' 파라미터 값 얻기
      let tag = urlParams.get('tag');

      // 페이지 상단 안내 문구에 선택된 태그 값 표기
      document.querySelector('.tag-name').textContent = tag;

      fetch(
        `http://favspot.site:8000/board/search/?search_field=tag&search=${tag}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => response.json())
        .then((data2) => {
          // 데이터를 보여주는 함수에 가져온 데이터 전달
          showBoards(data2['boards']);
        })
        .catch((error) => console.error('Error:', error))
        .finally(() => {
          const boards = document.getElementsByClassName('masonry-item');
          const dividend = boards.length;
          const divisor = 3;
          const quotient = Math.ceil(dividend / divisor);
          const boardList = document.querySelector('#boardlist');
          boardList.style.height = `${410 * quotient}px`;
        });

      // 데이터를 보여주는 함수
      function showBoards(boards) {
        // 기존 데이터를 모두 제거
        while (parentElement.firstChild) {
          parentElement.removeChild(parentElement.firstChild);
        }

        // 모든 보드 데이터 표시
        boards.forEach((board) => {
          const dynamicBlogEntry = createBlogEntry(board);
          parentElement.appendChild(dynamicBlogEntry);
        });

        if (data['links']['total_pages'] == 1) {
          previousButton.style.display = 'none';
          nextButton.style.display = 'none';
        }

        // 첫 번째 페이지일 경우 이전 페이지 버튼을 숨김
        if (currentPage === 1) {
          previousButton.classList.add('disabled');
        } else {
          previousButton.classList.remove('disabled');
        }

        // 다음 페이지로 이동하는 버튼을 다시 보이게 함
        if (currentPage < data['links']['total_pages']) {
          nextButton.classList.remove('disabled');
        } else {
          nextButton.classList.add('disabled');
        }
      }

      // 초기 데이터 표시
      // showBoards(data['results']['Boards']);

      // 다음 페이지로 이동하는 함수
      function loadNextPage() {
        if (currentPage < data['links']['total_pages']) {
          currentPage++;
          fetchDataAndShow();
        }
      }

      // 이전 페이지로 이동하는 함수
      function loadPrevPage() {
        if (currentPage > 1) {
          currentPage--;
          fetchDataAndShow();
        }
      }

      // 데이터를 가져와서 화면에 표시하는 함수
      function fetchDataAndShow() {
        fetch(`http://favspot.site:8000/user/${pk}/?page=${currentPage}`, {
          credentials: 'include',
        })
          .then((response) => response.json())
          .then((data) => {
            showBoards(data['results']['Boards']);
          })
          .catch((error) => {
            console.error('Failed to load data.', error);
          });
      }
    })
    .catch((error) => {
      console.error('Failed to retrieve user data.', error);
    });
}
