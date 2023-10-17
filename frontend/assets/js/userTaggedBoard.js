import { createBlogEntry } from '/frontend/assets/js/util/boardSlide.js';

export function createUserTaggedBoard(requestUser, requestUserPk, followingList) {
  const params = new URLSearchParams(window.location.search);
  let pk = params.get('pk');
  if (!pk) {
    pk = 'me';
  }
  const tagList = document.getElementById('tagList');
  fetch(`http://127.0.0.1:8000/user/${pk}/`, {
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
      console.log('img', img, !!img, profileImg);
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
        button2.textContent = 'Pin List';
        button2.style.display = 'block';
        button2.setAttribute('href', 'pin_list.html');

        button3.textContent = 'Liked Board';
        button3.style.display = 'block';
        button3.setAttribute(
          'href',
          `user_liked_board.html?pk=${requestUserPk}`
        );

        button.textContent = 'User Info';
        button.classList.add('user-info-btn');
        button.setAttribute('href', 'user_info.html');
        changeBtnDiv.appendChild(button2);
      } else if (followingList.includes(currentUser)) {
        button.textContent = 'Unfollow';

        button3.textContent = 'Liked Board';
        button3.style.display = 'block';
        button3.setAttribute('href', `user_liked_board.html?pk=${pk}`);

        button.addEventListener('click', () => {
          fetch(`http://127.0.0.1:8000/user/follow/${followerPk}/`, {
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
        button.addEventListener('click', () => {
          fetch(`http://127.0.0.1:8000/user/follow/`, {
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
      changeBtnDiv.appendChild(button3);
      changeBtnDiv.appendChild(button);

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

      let fetchdata;

      // 특정 태그가 등록된 유저의 보드 목록 가져오기위한 통신
      // URL의 쿼리 스트링 가져오기
      let queryString = window.location.search;

      // URLSearchParams 객체 생성
      let urlParams = new URLSearchParams(queryString);

      // 'tag' 파라미터 값 얻기
      let tag = urlParams.get('tag');

      // 'pk' 파라미터 값 얻기
      let pagePk = urlParams.get('pk');
      if (pagePk === 'me') {
        pagePk = requestUserPk;
      }

      // 페이지 상단 안내 문구에 선택된 태그 값 표기
      document.querySelector('.tag-name').textContent = tag;

      fetch(`http://127.0.0.1:8000/board/${pagePk}/tag/?tag=${tag}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data2) => {
          // 데이터를 보여주는 함수에 가져온 데이터 전달
          fetchdata = data2;
          showBoards(data2.results.boards);
        })
        .catch((error) => console.error('Error:', error));

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

        if (fetchdata['links']['total_pages'] == 1) {
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
        if (currentPage < fetchdata['links']['total_pages']) {
          nextButton.classList.remove('disabled');
        } else {
          nextButton.classList.add('disabled');
        }
      }

      // 초기 데이터 표시
      // showBoards(data['results']['Boards']);

      // 다음 페이지로 이동하는 함수
      function loadNextPage() {
        if (currentPage < fetchdata['links']['total_pages']) {
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
        fetch(
          `http://127.0.0.1:8000/board/${pagePk}/tag/?tag=${tag}&page=${currentPage}`,
          {
            credentials: 'include',
          }
        )
          .then((response) => response.json())
          .then((data) => {
            showBoards(data.results.boards);
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
