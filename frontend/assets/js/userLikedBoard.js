import { createBlogEntry } from '/frontend/assets/js/util/boardSlide.js';

export function createUserLikedBoard(requestUser, requestUserPk, followingList) {
  const params = new URLSearchParams(window.location.search);
  let pk = params.get('pk');
  if (!pk) {
    pk = 'me';
  }

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

      // const button = document.createElement('a');
      // button.type = 'button';
      // button.classList.add('btn', 'btn-primary', 'mt-1');
      // button.style.display = 'block';
      const button2 = document.createElement('a');
      button2.type = 'button';
      button2.classList.add('btn', 'btn-primary', 'mt-1');

      // 좋아요한 보드 목록 버튼
      const button3 = document.createElement('a');
      button3.type = 'button';
      button3.classList.add('btn', 'btn-primary', 'mt-1', 'user-info-btn');

      // 기존 요소에 버튼 추가
      const changeBtnDiv = document.querySelector('.changeBtn');
      const params = new URLSearchParams(window.location.search);
      let followerPk = params.get('pk');

      if ((requestUser === currentUser) | (requestUserPk === pk)) {
        // button.textContent = 'Profile Edit';
        // button.setAttribute('href', 'profile_edit.html');

        button2.textContent = 'Pin List';
        button2.style.display = 'block';
        button2.setAttribute('href', 'pin_list.html');

        button3.textContent = 'User Info';
        button3.style.display = 'block';
        button3.addEventListener('click', function (e) {
          e.preventDefault(); // 기본 링크 클릭 동작 방지
          location.href = 'user_info.html';
        });

        // changeBtnDiv.appendChild(button2);
      } else if (followingList.includes(currentUser)) {
        button2.textContent = 'Unfollow';
        button2.style.display = 'block';

        button3.textContent = 'User Info';
        button3.style.display = 'block';
        button3.addEventListener('click', function (e) {
          e.preventDefault(); // 기본 링크 클릭 동작 방지
          location.href = `user_info.html?pk=${pk}`;
        });

        button2.addEventListener('click', () => {
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
        button2.textContent = 'Follow';
        button2.style.display = 'block';

        button3.textContent = 'User Info';
        button3.style.display = 'block';
        button3.addEventListener('click', function (e) {
          e.preventDefault(); // 기본 링크 클릭 동작 방지
          location.href = `user_info.html?pk=${pk}`;
        });

        button2.addEventListener('click', () => {
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
      changeBtnDiv.appendChild(button2);
      changeBtnDiv.appendChild(button3);

      const parentElement = document.querySelector('.masonry.columns-2');
      const previousButton = document.getElementById('previousButton');
      const nextButton = document.getElementById('nextButton');

      previousButton.addEventListener('click', loadPrevPage);
      nextButton.addEventListener('click', loadNextPage);

      // 초기 페이지 번호
      let currentPage = 1;

      let fetchdata;
      // 유저가 좋아요한 보드 목록 가져오기 위한 통신
      const paramsUserId = new URLSearchParams(window.location.search);
      let userId = params.get('pk');

      fetch(`http://127.0.0.1:8000/board/like/${userId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data2) => {
          // 데이터를 보여주는 함수에 가져온 데이터 전달
          fetchdata = data2;
          showBoards(data2.results);
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
      // showBoards(data.results);

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
        fetch(`http://127.0.0.1:8000/board/like/${pk}/?page=${currentPage}`, {
          credentials: 'include',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            if (!Array.isArray(data.results)) {
              console.error('Invalid data:', data);
              return;
            }

            showBoards(data.results);
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
