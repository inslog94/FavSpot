import { CURRENT_PINS, PIN_DETAIL } from './data.js';
import { pinDetail } from './pinDetail.js';
import { displayGeoLocationMap } from './map.js';
import { mapSetup, pinDetailSetUp } from './event.js';
let selectedPk;

function formatDate(dateString) {
  var date = new Date(dateString);
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  var hour = ('0' + date.getHours()).slice(-2);
  var minute = ('0' + date.getMinutes()).slice(-2);

  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
}

document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll('.button-like');

  buttons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      if (button.classList.contains('liked')) {
        button.classList.remove('liked');
      } else {
        button.classList.add('liked');
      }
    });
  });
});

export async function boardDetail(data) {
  // 유저 정보 저장할 전역 변수
  let loggedInUserEmail;

  // 좋아요 버튼
  const likeButton = document.querySelector('.button-like');

  // 좋아요 테이블 pk
  let boardLikePk;
  selectedPk = window.localStorage.getItem('selectedPk');

  // 로그인된 유저 이메일 저장
  loggedInUserEmail = data.request_user.email;
  console.log(loggedInUserEmail);
  
  // 유저 이름 설정
  const nameInput = document.querySelector('#headerEmail');
  console.log(nameInput);
  nameInput.textContent = data.request_user.email;

  // 프로필 이미지 설정
  const profileImg = document.querySelector('profileImg');
  if (data.request_user.profile_img) {
    profileImg.src = data.request_user.profile_img;
  }

  CURRENT_PINS.value = '';
  CURRENT_PINS.value = data.pins;

  // 공개 / 비공개 보드 표시
  const lockIcon = document.querySelector('.fa-lock');

  if (data.board.is_public) {
    lockIcon.style.display = 'none'; // 숨길 때
  } else {
    lockIcon.style.display = 'inline'; // 보여줄 때
  }

  // 보드 수정 / 삭제 아이콘 표시
  // 로그인된 유저와 보드 작성자가 같은 경우
  const settingsBox = document.querySelector('.settings-box');
  const boardUserEmail = data.board.user;

  if (loggedInUserEmail === boardUserEmail) {
    settingsBox.style.display = 'block';
  } else {
    settingsBox.style.display = 'none';
  }

  // 보드 이름
  const boardTitleElement = document.querySelector('.board-title');
  boardTitleElement.textContent = data.board.title;

  // 보드 작성자
  const userProfileLink = document.querySelector('.user-profile-link');
  const boardUserElement = document.querySelector('.board-userId');

  // 이메일 클릭 시 작성자 프로필로 이동
  userProfileLink.addEventListener('click', function (event) {
    const boardUserEmail = data.board.user;
    event.preventDefault();

    const boardUserPk = data.board.user_id;

    let userProfileUrl;

    if (loggedInUserEmail === boardUserEmail) {
      userProfileUrl = '../html/user_info.html';
    } else {
      userProfileUrl = `../html/user_info.html?pk=${boardUserPk}`;
    }

    window.location.href = userProfileUrl;
  });

  // 보드 작성자 출력
  boardUserElement.textContent = data.board.user;

  // 보드 작성일
  const boardCreatedAtElement = document.querySelector('.board-createdAt');
  boardCreatedAtElement.textContent = formatDate(data.board.created_at);

  // 보드 좋아요 개수
  const boardLikedCntElement = document.querySelector('.board-likedCnt');
  boardLikedCntElement.textContent = data.likes_count;

  // 로그인된 사용자의 보드 좋아요 여부
  if (data.user_liked[0]) {
    likeButton.classList.add('liked');

    // 좋아요 테이블 pk 저장
    boardLikePk = data.user_liked[1];
  } else {
    likeButton.classList.remove('liked');
    likeButton.classList.add('button-like');
  }

  // 보드 태그
  if (data.board.tags.length === 0) {
    const noTagsMessage = document.createElement('div');
    noTagsMessage.textContent = '보드에 등록된 태그가 없습니다.';
    noTagsMessage.classList.add('no-tags-message');
    const boardTagsElement = document.querySelector('.board-tags');
    boardTagsElement.appendChild(noTagsMessage);
  } else {
    const ulElement = document.createElement('ul');

    data.board.tags.forEach((tag) => {
      const liElement = document.createElement('li');

      const aElement = document.createElement('a');
      aElement.setAttribute(
        'href',
        'tagged_board_list.html?tag=' + encodeURIComponent(tag)
      );
      aElement.textContent = `${tag}`;

      liElement.appendChild(aElement); // <a> 요소를 <li> 요소의 자식으로 추가
      ulElement.appendChild(liElement); // <li> 요소를 <ul>요 소의 자식으로 추가
    });

    // 최종적으로 생성된 HTML 코드 출력
    const boardTagsElement = document.querySelector('.board-tags');
    boardTagsElement.appendChild(ulElement);
  }

  // 핀 목록
  const containerElement = document.querySelector('.pins-container');

  // 등록된 핀이 없는 경우
  if (data.pins.length === 0) {
    const noPinsMessage = document.createElement('div');
    noPinsMessage.textContent = '보드에 등록된 핀이 없습니다.';
    noPinsMessage.classList.add('no-pins-message');
    containerElement.appendChild(noPinsMessage);
  } else {
    data.pins.forEach((pin, index) => {
      const postElement = document.createElement('div');
      postElement.classList.add('port-post', 'clearfix', 'bg-white');

      if (index === 0) {
        postElement.classList.add('mt-20');
      } else {
        postElement.classList.add('mt-40', 'mb-20');
      }

      const boxElement = document.createElement('div');
      boxElement.classList.add('pins-box');

      const photoDivElement = document.createElement('div');
      photoDivElement.classList.add('port-post-photo');

      const imgElement = document.createElement('img');
      if (pin.thumbnail_img) {
      imgElement.src = pin.thumbnail_img;
      } else {
        imgElement.src =
          'https://favspot-fin.s3.amazonaws.com/images/default/main_logo.png';
      }
      imgElement.classList.add('pin-thumbnail-img');

      photoDivElement.appendChild(imgElement);

      const infoDivElement = document.createElement('div');
      infoDivElement.classList.add('port-post-info');

      const h3Element = document.createElement('h3');
      h3Element.classList.add('theme-color');
      h3Element.innerHTML = `<span>상호명: </span>${pin.title}`;

      infoDivElement.appendChild(h3Element);

      let pinsInfoDiv = document.createElement('div');
      pinsInfoDiv.classList.add('pins-info');

      ['category', 'new_address'].forEach((key) => {
        if (pin[key]) {
          let h5Element = document.createElement('h5');
          let label = '';

          if (key === 'category') {
            label = '카테고리';
          } else if (key === 'new_address') {
            label = '주소';
          }

          h5Element.innerHTML = `<span>${label}: </span>${pin[key]}`;
          pinsInfoDiv.append(h5Element);
        }
      });

      infoDivElement.append(pinsInfoDiv);

      boxElement.append(photoDivElement, infoDivElement);

      postElement.append(boxElement);

      // 특정 핀 마우스오버시 스타일 추가
      postElement.addEventListener('mouseover', function () {
        postElement.classList.add('pins-hovered');
      });

      // 특정 핀 마우스오버 해제시 스타일 제거
      postElement.addEventListener('mouseout', function () {
        postElement.classList.remove('pins-hovered');
      });

      // 특정 핀 클릭 시 핀 상세보기 모달 표시
      postElement.addEventListener('click', function () {
        $('#myModal').modal('show');
        let place_id = pin.place_id;
        console.log(place_id);
        PIN_DETAIL.place_id = place_id;
        pinDetail();
      });

      containerElement.appendChild(postElement);
    });
  }

  // 댓글 작성란 유저 프로필 이미지 설정
  const replyprofileImg = document.querySelector('.img-profile');
  if (data.request_user.profileImg) {
    replyprofileImg.src = data.request_user.profileImg;
  }

  // 댓글 작성란 유저 이름 설정
  const replyNameInput = document.querySelector('.user-email');
  replyNameInput.textContent = data.request_user.email;

  // 댓글 목록
  var commentsSection = document.querySelector('.comments-container');

  data.comments.forEach(function (comment) {
    var commentDiv = document.createElement('div');
    commentDiv.className = 'comments-1';

    var photoDiv = document.createElement('div');
    photoDiv.className = 'comments-photo';

    var imgTag = document.createElement('img');
    imgTag.className = 'img-fluid';

    if (
      comment.user.profile_img !== null &&
      comment.user.profile_img !== undefined
    ) {
      imgTag.src = comment.user.profile_img; // 실제 이미지 URL
    } else {
      imgTag.src =
        'https://favspot-fin.s3.amazonaws.com/images/default/default_user.png'; // 기본 이미지 URL
    }

    photoDiv.appendChild(imgTag);

    var infoDiv = document.createElement('div');
    infoDiv.className = 'comments-info';

    let h4Tag = document.createElement('h5');
    h4Tag.className = 'theme-color mb-20';

    let aTag = document.createElement('a');
    if (loggedInUserEmail === comment.user.email) {
      aTag.href = '../html/user_info.html';
    } else {
      const boardCommentUserPk = comment.user.id;
      aTag.href = `../html/user_info.html?pk=${boardCommentUserPk}`;
    }

    let textNode = document.createTextNode(comment.user.email);
    aTag.appendChild(textNode);

    let spanTag = document.createElement('span');
    let dateNode = document.createTextNode(formatDate(comment.created_at));
    spanTag.appendChild(dateNode);

    h4Tag.appendChild(aTag);
    h4Tag.appendChild(spanTag);

    let pElement = document.createElement('p');
    let pTextNode = document.createTextNode(comment.content);

    pElement.appendChild(pTextNode);

    infoDiv.appendChild(h4Tag);
    infoDiv.appendChild(pElement);

    commentDiv.appendChild(photoDiv);
    commentDiv.appendChild(infoDiv);

    commentsSection.append(commentDiv);

    // 댓글 삭제 아이콘 표시
    // 로그인된 유저와 댓글 작성자가 같은 경우
    if (comment.user.email === loggedInUserEmail) {
      const deleteIconDiv = document.createElement('div');
      deleteIconDiv.classList.add('fa', 'fa-times');
      infoDiv.appendChild(deleteIconDiv);

      // 댓글 삭제 아이콘 마우스오버시 스타일 추가
      deleteIconDiv.addEventListener('mouseover', function () {
        deleteIconDiv.style.cursor = 'pointer';
      });

      // 댓글 삭제 기능
      // 클릭 이벤트 추가
      deleteIconDiv.addEventListener('click', function () {
        // 삭제 확인 메시지
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
          fetch(`http://127.0.0.1:8000/board/comment/${comment.id}`, {
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
        }
      });
    }
  });

  // 좋아요 등록과 해제 기능
  // 로그인하지 않은 유저는 이용할 수 없도록 좋아요 버튼 숨김 처리
  if (!loggedInUserEmail){
    likeButton.style.display = 'none';
  }

  likeButton.addEventListener('click', function () {
    if (boardLikePk) {
      // 좋아요 해제
      fetch(`http://127.0.0.1:8000/board/like/${boardLikePk}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          if (response.status === 204) {
            return;
          }

          return response.json();
        })
        .then((data) => {
          likeButton.classList.remove('liked');
          boardLikePk = null; // 좋아요 아이디 초기화
          location.reload(); // 페이지 새로고침
        })
        .catch((error) => console.error('Error:', error));
    } else {
      // 아직 좋아요가 안 눌러져 있으면 등록
      fetch(`http://127.0.0.1:8000/board/${selectedPk}/like/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // 받은 데이터에서 id를 추출하여 전역변수에 저장합니다.
          boardLikePk = data.id;
          likeButton.classList.add('liked'); // 버튼 스타일 변경
          location.reload(); // 페이지 새로고침
        })
        .catch((error) => console.error('Error:', error));
    }
  });

  // 댓글 등록 기능
  // 로그인하지 않은 유저는 이용할 수 없도록 댓글 작성란 숨김 처리
  if (!loggedInUserEmail){
    document.getElementById('commentWriteBox').style.display = 'none';
  }
  
  document.getElementById('submit').addEventListener('click', function () {
    var commentText = document.getElementById('commentText').value;

    fetch(`http://127.0.0.1:8000/board/${selectedPk}/comment/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: commentText }),
    })
      .then((response) => response.json())
      .then((data) => {
        location.reload(); // 페이지 새로고침
      })
      .catch((error) => 
      console.error('Error:', error
      ));
  });

  // 보드 삭제 기능
  document.getElementById('deleteButton').addEventListener('click', function () {
    // 삭제 확인 메시지
    if (window.confirm('보드를 삭제하시겠습니까?')) {
      fetch(`http://127.0.0.1:8000/board/${selectedPk}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status === 204) {
            window.location.href = 'user_info.html';
          } else {
            return response.json();
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  });
}

export function createBoardDetail() {
  document.addEventListener('DOMContentLoaded', function () {
    // 로컬 스토리지로 보드 id 값 가져오기
    const boardPk = localStorage.getItem('selectedPk');

    // 보드 공개 여부 상태 저장 변수
    let isPublic;

    // 보드 상세 정보 가져오기 위한 통신
    fetch(`http://127.0.0.1:8000/board/${boardPk}/`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // 공개 / 비공개 보드 표시 (모달)
        const lockIcon2 = document.querySelector('.icon-lock-box .fa-lock');
        const unlockIcon2 = document.querySelector('.icon-lock-box .fa-unlock');

        if (data.board.is_public) {
          unlockIcon2.style.display = 'inline';
          lockIcon2.style.display = 'none';
        } else {
          lockIcon2.style.display = 'inline';
          unlockIcon2.style.display = 'none';
        }

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
        const boardTitleElement = document.querySelector('.input-board-title');
        boardTitleElement.value = data.board.title;

        // 보드 태그 (모달)
        const ulElement = document.createElement('ul'); // <ul> 요소 생성

        data.board.tags.forEach((tag) => {
          const liElement = createNewLiElement(tag); // 태그 생성 함수 호출
          ulElement.appendChild(liElement); // <li> 요소를 <ul>요 소의 자식으로 추가
        });

        const boardTagsElement = document.querySelector('.board-tags2');
        boardTagsElement.appendChild(ulElement);

        // 핀 목록 (모달)
        const containerElement = document.querySelector('.pins-container2');

        // 등록된 핀이 없는 경우
        if (data.pins.length === 0) {
          const noPinsMessage = document.createElement('div');
          noPinsMessage.innerHTML =
            '보드에 등록된 핀이 없습니다. <br>메인페이지에서 해당 보드에 핀을 추가할 수 있습니다.';
          noPinsMessage.classList.add('no-pins-message');
          containerElement.appendChild(noPinsMessage);
        } else {
          data.pins.forEach((pin, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('port-post', 'clearfix', 'bg-white');
            postElement.dataset.id = pin.id; // data-id 속성 설정

            if (index === 0) {
              postElement.classList.add('mt-20');
            } else {
              postElement.classList.add('mt-40', 'mb-20');
            }

            const boxElement = document.createElement('div');
            boxElement.classList.add('pins-box');

            const photoDivElement = document.createElement('div');
            photoDivElement.classList.add('port-post-photo');

            const imgElement = document.createElement('img');
            imgElement.src = pin.thumbnail_img;
            imgElement.classList.add('pin-thumbnail-img');

            photoDivElement.appendChild(imgElement);

            const infoDivElement = document.createElement('div');
            infoDivElement.classList.add('port-post-info');

            const h3Element = document.createElement('h3');
            h3Element.classList.add('theme-color');
            h3Element.innerHTML = `<span>상호명: </span>${pin.title}`;

            infoDivElement.appendChild(h3Element);

            let pinsInfoDiv = document.createElement('div');
            pinsInfoDiv.classList.add('pins-info');

            ['category', 'new_address'].forEach((key) => {
              if (pin[key]) {
                let h5Element = document.createElement('h5');
                let label = '';

                if (key === 'category') {
                  label = '카테고리';
                } else if (key === 'new_address') {
                  label = '주소';
                }

                h5Element.innerHTML = `<span>${label}: </span>${pin[key]}`;
                pinsInfoDiv.append(h5Element);
              }
            });

            // 삭제 아이콘을 위한 버튼 요소 생성
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('fa', 'fa-times-rectangle');

            infoDivElement.append(pinsInfoDiv);
            infoDivElement.appendChild(deleteButton);
            boxElement.append(photoDivElement, infoDivElement);
            postElement.append(boxElement);
            containerElement.appendChild(postElement);

            // 삭제 아이콘 클릭 시 핀 삭제
            deleteButton.addEventListener('click', function () {
              postElement.remove();
            });

            infoDivElement.appendChild(deleteButton);
          });
        }
      })
      .catch((error) => console.error('Error:', error));

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

    // 수정 버튼 클릭 시 이벤트
    // 보드 수정 기능

    document
      .querySelector('#save-button')
      .addEventListener('click', function () {
        const title = document.querySelector('.input-board-title').value;
        const tags = Array.from(
          document.querySelectorAll('.board-tags2 ul li'),
          (li) => li.textContent
        );
        const pins = Array.from(
          document.querySelectorAll('.port-post'),
          (post) => Number(post.dataset.id)
        );

        const updatedBoard = {
          title: title,
          tags: tags,
          pins: pins,
          is_public: isPublic,
        };

        fetch(`http://127.0.0.1:8000/board/${boardPk}/`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBoard),
        })
          .then((response) => response.json())
          .then((data) => {
            location.reload(); // 페이지 새로고침
          })
          .catch((error) => console.error('Error:', error));
      });
  });
}
