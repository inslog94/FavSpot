import { PIN_DETAIL, origin } from './data.js';
import { requestUser } from './data.js';
import { createPlaceInfo } from '/frontend/assets/js/util/setPlaceInfo.js';

export function pinDetail() {
  let pinData = null;
  let boardData = {};

  fetchUserInfo();
  // 첫 페이지 핀 콘텐츠들을 불러는 함수 호출
  /// 페이지네이션을 통한 핀 콘텐츠 보여주기
  let currentPage = 1;
  displayPinContents(currentPage);
  // 핀 상세보기 정보 가져오는 함수 호출
  displayPinDetail();

  // 유저 정보 가져오기
  function fetchUserInfo(url = `${origin}/user/me/`, boards = []) {
    return fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const newBoards = boards.concat(data.results.Boards);
        if (data.links.next) { // 다음 페이지가 있다면
          return fetchUserInfo(data.links.next, newBoards); // 다음 페이지 데이터를 재귀적으로 요청
        } else { // 더 이상 다음 페이지가 없다면
          const boardSelectionElement = document.getElementById('boardSelection');

          while (boardSelectionElement.firstChild) {
            boardSelectionElement.removeChild(boardSelectionElement.firstChild);
          }

          newBoards.forEach((board) => {
            const optionElement = document.createElement('option');
            optionElement.value = board.id;
            optionElement.textContent = board.title;

            boardData[board.id] = { title: board.title };

            boardSelectionElement.appendChild(optionElement);

            document.getElementById('saveButton').style.display = 'block';
          });
        }
      })
      .catch((error) => console.error('Error:', error));
  }

  /// 백엔드에서 핀 상세보기 정보 가져오기
  function displayPinDetail() {
    fetch(`${origin}/pin/${PIN_DETAIL.place_id}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        // 성공 상태가 아니면 에러 메시지 출력 후 함수 종료
        if (!response.ok) {
          // 가져온 데이터로 상세보기 정보 표시하기
          pinData = PIN_DETAIL; // 데이터 저장
          createPlaceInfo();
          throw new Error('NO PIN');
        }
        return response.json();
      })
      .then((data) => {
        // 핀 생성 스텝들 숨기고 초기화하기
        const pinCreationElement = document.getElementById('pinCreationSteps');
        pinCreationElement.style.display = 'none';
        const saveButton = document.getElementById('saveButton');
        saveButton.innerText = '핀 저장';
        currentStep = 1;
        document.getElementById('step1').style.display = 'block';
        document.getElementById('step2').style.display = 'none';
        document.getElementById('saveNextButton').style.display = 'block';

        pinData = data.results.pin; // 데이터 저장
        createPlaceInfo(data.results);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  function displayPinContents(page) {
    fetch(`${origin}/pin/${PIN_DETAIL.place_id}/?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // 가져온 데이터로 핀 콘텐츠 정보 표시하기
        const pinContentsContainer = document.getElementById(
          'pinContentsContainer'
        );
        const previousButton = document.getElementById('previousButton');
        const nextButton = document.getElementById('nextButton');

        // 새 핀 콘텐츠를 추가하기 전에 비우기
        pinContentsContainer.innerHTML = '';

        // 각 핀 콘텐츠들을 추가하기
        data.results.pin_contents.forEach((pinContent) => {
          const pinContentElement = document.createElement('div');
          pinContentElement.className =
            'port-post clearfix mb-10 border rounded pin-con';

          // 사진 컨테이너 생성
          const photoContainer = document.createElement('div');
          photoContainer.className = 'port-post-photo';

          // <img> 요소 생성
          const photoElement = document.createElement('img');
          photoElement.className = 'border rounded ';

          // 핀 콘텐츠에 사진이 있는지 확인
          if (pinContent.photo) {
            photoElement.src = pinContent.photo; // photo 사진과 연결
          } else {
            photoElement.src =
              'https://favspot-fin.s3.amazonaws.com/images/default/main_logo.png'; // 기본 사진 지정
          }

          // 이미지를 사진 컨테이너에 추가
          photoContainer.appendChild(photoElement);

          const infoContainer = document.createElement('div');
          infoContainer.className = 'port-post-info';

          // 작성자 정보 h5 생성
          const emailText = document.createElement('h5');
          emailText.textContent = pinContent.email;
          emailText.className = 'theme-color';

          infoContainer.appendChild(emailText);

          // 핀 콘텐츠 텍스트 p 요소 생성 및 추가
          const pinContentP = document.createElement('p');
          pinContentP.className = 'mt-20';
          if (pinContent.text) {
            pinContentP.textContent = pinContent.text;
          } else {
            pinContentP.textContent = "입력된 코멘트가 없습니다";
          }

          infoContainer.appendChild(pinContentP);

          // 삭제 버튼 생성
          if (requestUser.email && pinContent.email === requestUser.email) {
            const deleteIconDiv = document.createElement('div');
            deleteIconDiv.classList.add('fa', 'fa-times');
            pinContentElement.appendChild(deleteIconDiv);

            /// 삭제 버튼 클릭 이벤트
            deleteIconDiv.addEventListener('click', () => {
              if (confirm('이 리뷰를 삭제하시겠습니까?')) {
                fetch(`${origin}/pin/content/${pinContent.id}/`, {
                  method: 'DELETE',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                  .then((response) => {
                    if (response.status === 204) {
                      pinContentElement.remove();
                      window.alert('리뷰를 삭제했습니다.');
                    } else if (response.status === 403) {
                      window.alert('리뷰는 작성자만 삭제할 수 있습니다.');
                    }
                  })
                  .catch((error) => {
                    console.error('삭제시 문제가 발생했습니다:', error);
                  });
              }
            });
          }

          // 생성한 사진과 텍스트 추가하기
          pinContentElement.appendChild(photoContainer);
          pinContentElement.appendChild(infoContainer);
          pinContentsContainer.appendChild(pinContentElement);
        });

        /// 페이지네이션 버튼 이벤트
        const pagination = document.getElementById('pagination');

        // 예전 버튼들 제거
        while (pagination.children.length > 2) {
          pagination.removeChild(pagination.children[1]);
        }

        // 새 버튼들 추가
        for (let i = 0; i < data.links.total_pages; i++) {
          const li = document.createElement('li');
          li.className = 'page-item';

          const a = document.createElement('a');
          a.className = 'page-link';
          a.textContent = i + 1;

          if (i + 1 === data.links.current_page) {
            li.classList.add('active');

            a.addEventListener('click', function (event) {
              event.preventDefault();
              displayPinContents(i + 1);
            });
          } else {
            a.href = '#';
            a.addEventListener('click', function (event) {
              event.preventDefault();
              displayPinContents(i + 1);
            });
          }

          li.appendChild(a);
          pagination.insertBefore(li, nextButton);
        }

        // 이전 버튼 제거 후 복제한 것을 집어넣기
        const newPreviousButton = previousButton.cloneNode(true);
        previousButton.parentNode.replaceChild(
          newPreviousButton,
          previousButton
        );

        // 다음 버튼 제거 후 복제한 것을 집어넣기
        const newNextButton = nextButton.cloneNode(true);
        nextButton.parentNode.replaceChild(newNextButton, nextButton);

        if (data.links.previous) {
          newPreviousButton.classList.remove('disabled');
          newPreviousButton.children[0].addEventListener('click', () => {
            displayPinContents(data.links.current_page - 1);
          });
        } else {
          newPreviousButton.classList.add('disabled');
        }

        if (data.links.next) {
          newNextButton.classList.remove('disabled');
          newNextButton.children[0].addEventListener('click', () => {
            displayPinContents(data.links.current_page + 1);
          });
        } else {
          newNextButton.classList.add('disabled');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  // 이전 버튼 클릭 이벤트: 페이지 수 -1
  const previousButton = document.getElementById('previousButton');
  previousButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayPinContents(currentPage);
    }
  });

  // 이전 버튼 클릭 이벤트: 페이지 수 +1
  const nextButton = document.getElementById('nextButton');
  nextButton.addEventListener('click', () => {
    currentPage++;
    displayPinContents(currentPage);
  });

  /// 핀 생성 이벤트
  // 현재 스텝 변수
  let currentStep = 1;

  /// "핀 저장" 버튼 클릭 이벤트
  const saveButton = document.getElementById('saveButton');
  // 기존의 모든 이벤트 핸들러 제거
  saveButton.replaceWith(saveButton.cloneNode(true));
  const newSaveButton = document.getElementById('saveButton');

  newSaveButton.addEventListener('click', function () {
    let pinCreationElement = document.getElementById('pinCreationSteps');
    // 만약 핀 생성 스텝들이 이미 보여지고 있다면, 숨기고 함수 종료
    if (pinCreationElement.style.display === 'block') {
      pinCreationElement.style.display = 'none';
      newSaveButton.innerText = '핀 저장'; // 텍스트를 원래대로 되돌림
      return;
    }
    // 핀 생성 스텝들 보이기
    pinCreationElement.style.display = 'block';
    newSaveButton.innerText = '취소'; // 텍스트를 '취소'로 변경함
    // 첫 번째 스텝 보이기
    document.getElementById(`step${currentStep}`).style.display = 'block';
  });

  // "댓글 쓰기" 버튼 클릭 이벤트
  document
    .getElementById('saveNextButton')
    .addEventListener('click', function () {
      // 다음 스텝으로 이동
      currentStep++;

      // 다음 스텝 보이기
      document.getElementById(`step${currentStep}`).style.display = 'block';
      document.getElementById('saveNextButton').style.display = 'none';

      if (currentStep === 2) {
        document.getElementById('createButton').style.display = 'inline-block';
        document.getElementById('saveNextButton').style.display = 'none'; // 댓글 쓰기 버튼을 숨김
      }
    });

  // 저장 버튼 클릭 이벤트
  const createButton = document.getElementById('createButton')
  // 기존의 모든 이벤트 핸들러 제거
  createButton.replaceWith(createButton.cloneNode(true));
  const newCreateButton = document.getElementById('createButton');
  newCreateButton.addEventListener('click', function () {
      // FormData 객체 생성
      const formData = new FormData();

      // 선택된 보드 ID 추가
      const selectedBoard = document.getElementById('boardSelection').value;
      formData.append('board_id', selectedBoard);
      
      // 입력된 텍스트 추가
      const textInput = document.getElementById('textInput').value;
      if (textInput) {
        formData.append('text', textInput);
      }

      // 업로드된 이미지 추가
      const uploadedImage = document.getElementById('photoUpload').files[0];
      if (uploadedImage) {
        formData.append('photo', uploadedImage);
      }

      if (pinData) {
        // 필요한 정보들만 선택적으로 추가하기
        [
          'category',
          'title',
          'place_id',
          'new_address',
          'old_address',
          'lat_lng',
        ].forEach((key) => {
          if (pinData.hasOwnProperty(key)) {
            formData.append(key, pinData[key]);
          }
        });
      }

      fetch(`${origin}/pin/`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // 성공 메시지 출력
          alert(`'${pinData.title}' 핀을 '${boardData[selectedBoard].title}' 보드에 담았습니다.`);
          // 페이지 새로 고침
          displayPinDetail();
          displayPinContents(1);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
}
