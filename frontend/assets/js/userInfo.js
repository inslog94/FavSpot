import { createBlogEntry } from '/assets/js/util/boardSlide.js';

export function createUserInfo(requestUser, requestUserPk, followingList) {
  const params = new URLSearchParams(window.location.search);
  let pk = params.get('pk');
  if (!pk) {
    pk = 'me';
  }

  // 보드 생성 버튼을 숨기거나 표시하는 부분
  const createBoardButton = document.querySelector(
    '.btn.btn-primary.board-plus-text'
  );

  if (requestUserPk !== pk && pk !== 'me') {
    // 현재 사용자와 페이지 주인이 다를 경우
    createBoardButton.style.display = 'none'; // 버튼 숨기기
  } else {
    createBoardButton.style.display = 'flex'; // 버튼 표시하기
  }

  const tagList = document.getElementById('tagList');
  fetch(`http://favspot.site:8000/user/${pk}/`, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      // 가져온 사용자 데이터를 폼 필드에 채워줍니다.
      const currentUserPk = data['results']['User']['id'];
      const currentUser = data['results']['User']['email'];
      const email = document.querySelector('#email');
      email.textContent = currentUser;
      const nickname = document.querySelector('#nickname');

      if (data['results']['User']['nickname']) {
        nickname.textContent = data['results']['User']['nickname'];
      } else {
        nickname.textContent = 'None';
      }
      const img = data['results']['User']['profile_img'];
      const profileImg = document.getElementById('profileImg');
      if (img) {
        profileImg.src = img;
      }

      let followers = document.querySelector('.followers');
      followers.textContent = data['results']['User']['followers'];
      followers = document.querySelector('#followers');
      followers.addEventListener('click', (event) => {
        window.location.href = `follower.html?pk=${currentUserPk}`;
      });

      let following = document.querySelector('.following');
      following.textContent = data['results']['User']['following'];
      following = document.querySelector('#following');
      following.addEventListener('click', (event) => {
        window.location.href = `following.html?pk=${pk}`;
      });

      const button = document.createElement('a');
      button.type = 'button';
      button.classList.add('btn', 'btn-primary', 'mt-1');
      button.style.display = 'block';

      const button2 = document.createElement('a');
      button2.type = 'button';
      button2.classList.add('btn', 'btn-primary', 'mt-1');

      // 좋아요한 보드 목록 버튼
      const button3 = document.createElement('a');
      button3.type = 'button';
      button3.classList.add('btn', 'btn-primary', 'mt-1', 'liked-board-btn');

      // 기존 요소에 버튼 추가
      const changeBtnDiv = document.querySelector('.changeBtn');
      const params = new URLSearchParams(window.location.search);
      let followerPk = params.get('pk');

      if ((requestUser === currentUser) | (requestUserPk === pk)) {
        button.textContent = 'Profile Edit';
        button.setAttribute('href', 'profile_edit.html');

        button2.textContent = 'Pin List';
        button2.style.display = 'block';
        button2.setAttribute('href', 'pin_list.html');

        button3.textContent = 'Liked Board';
        button3.style.display = 'block';
        button3.setAttribute(
          'href',
          `user_liked_board.html?pk=${requestUserPk}`
        );

        changeBtnDiv.appendChild(button2);
      } else if (followingList.includes(currentUser)) {
        button.textContent = 'Unfollow';

        button3.textContent = 'Liked Board';
        button3.style.display = 'block';
        button3.setAttribute('href', `user_liked_board.html?pk=${pk}`);

        button.addEventListener('click', () => {
          fetch(`http://favspot.site:8000/user/follow/${followerPk}/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {
              if (response.status === 204) {
                location.reload(); // 페이지 새로고침
              } else {
                return response.json();
              }
            })
            .catch((error) => console.error('Error:', error));
        });
      } else {
        button.textContent = 'Follow';

        button3.textContent = 'Liked Board';
        button3.style.display = 'block';
        button3.setAttribute('href', `user_liked_board.html?pk=${pk}`);

        button.addEventListener('click', () => {
          fetch(`http://favspot.site:8000/user/follow/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: followerPk }),
          })
            .then((response) => {
              if (response.status === 201) {
                location.reload(); // 페이지 새로고침
              } else {
                return response.json();
              }
            })
            .catch((error) => console.error('Error:', error));
        });
      }
      changeBtnDiv.appendChild(button);
      changeBtnDiv.appendChild(button3);

      const tags = data['results']['User']['tags'];
      tags.forEach((tag) => {
        const newLi = document.createElement('li');
        const newTag = document.createElement('a');
        newTag.setAttribute(
          'href',
          'user_tagged_board.html?pk=' +
            encodeURIComponent(pk) +
            '&tag=' +
            encodeURIComponent(tag)
        );
        newTag.textContent = tag;

        newLi.appendChild(newTag);
        tagList.appendChild(newLi);
      });

      const parentElement = document.querySelector('.masonry.columns-2');
      const previousButton = document.getElementById('previousButton');
      const nextButton = document.getElementById('nextButton');

      previousButton.addEventListener('click', loadPrevPage);
      nextButton.addEventListener('click', loadNextPage);

      // 초기 페이지 번호
      let currentPage = 1;

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
      showBoards(data['results']['Boards']);

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

  // 보드 생성 모달 관련 JS
  // 보드 공개 여부 상태 저장 변수
  let isPublic = true;

  // 공개 / 비공개 보드 표시 (모달)
  const lockIcon2 = document.querySelector('.icon-lock-box .fa-lock');
  const unlockIcon2 = document.querySelector('.icon-lock-box .fa-unlock');

  // 초기 상태 설정
  lockIcon2.style.display = 'none'; // lockIcon2 보이게
  unlockIcon2.style.display = 'inline'; // unlockIcon2 숨기게

  unlockIcon2.addEventListener('click', function () {
    unlockIcon2.style.display = 'none';
    lockIcon2.style.display = 'inline';

    isPublic = false; // 비공개로 변경
  });

  lockIcon2.addEventListener('click', function () {
    lockIcon2.style.display = 'none';
    unlockIcon2.style.display = 'inline';

    isPublic = true; // 공개로 변경
  });

  // 보드 이름
  const boardTitleElement = document.querySelector('.input-board-title-02');

  // 보드 태그 (모달)
  const ulElement = document.createElement('ul'); // <ul> 요소 생성

  const boardTagsElement = document.querySelector('.board-tags2');
  boardTagsElement.appendChild(ulElement);

  // 새 태그 추가
  const newTagInput = document.querySelector('#new-tag-input');
  const addTagButton = document.querySelector('#add-tag-button');

  addTagButton.addEventListener('click', function () {
    const newTag = newTagInput.value;
    if (newTag) {
      const liElement = createNewLiElement(newTag); // 태그 생성 함수 호출

      const boardTagsUlElement = document.querySelector('.board-tags2 ul');
      boardTagsUlElement.appendChild(liElement);

      newTagInput.value = ''; // 입력 필드 초기화
    }
  });

  // 태그 생성 함수
  function createNewLiElement(tag) {
    const liElement = document.createElement('li');

    const aElement = document.createElement('a');
    aElement.href = '#';
    aElement.textContent = `${tag}`;

    const iDeleteIcon = document.createElement('i');
    iDeleteIcon.classList.add('fa', 'fa-times');

    // 삭제 아이콘 클릭 시 이벤트 리스너 등록
    iDeleteIcon.addEventListener('click', function (event) {
      event.preventDefault(); // a 태그의 기본 동작 취소
      liElement.remove(); // 태그 제거
    });

    aElement.appendChild(iDeleteIcon);
    liElement.appendChild(aElement);

    return liElement;
  }

  //보드 생성 버튼 클릭 시 이벤트
  //보드 생성 기능
  document
    .querySelector('#boardCreateBtn')
    .addEventListener('click', function () {
      const title = document.querySelector('.input-board-title-02').value;
      const tags = Array.from(
        document.querySelectorAll('.board-tags2 ul li'),
        (li) => li.textContent
      );

      const newBoard = {
        title: title,
        tags: tags,
        is_public: isPublic,
      };

      fetch(`http://favspot.site:8000/board/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBoard),
      })
        .then((response) => response.json())
        .then((data) => {
          location.reload(); // 페이지 새로고침
        })
        .catch((error) => console.error('Error:', error));
    });
}
