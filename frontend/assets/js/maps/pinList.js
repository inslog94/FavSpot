import {
  createAddress,
  createMenu,
  createPinData,
  createThumbnailImg,
} from '/frontend/assets/js/util/getPlaceInfo.js';

export function createPinList(data) {
  const url = 'http://127.0.0.1:8000';
  // 가져온 사용자 데이터를 폼 필드에 채워줍니다.
  const email = document.querySelector('#email');
  email.textContent = data['results']['User']['email'];
  const nickname = document.querySelector('#nickname');

  if (data['results']['User']['nickname']) {
    nickname.textContent = data['results']['User']['nickname'];
  } else {
    nickname.textContent = 'None';
  }
  const img = data['results']['User']['profile_img'];
  console.log(img);
  const profileImg = document.getElementById('profileImg');
  if (img) {
    profileImg.src = img;
  }

  let followers = document.querySelector('.followers');
  followers.textContent = data['results']['User']['followers'];
  followers = document.querySelector('#followers');
  followers.addEventListener('click', (event) => {
    console.log('click');
    window.location.href = `follower.html`;
  });
  let following = document.querySelector('.following');
  following.textContent = data['results']['User']['following'];
  following = document.querySelector('#following');
  following.addEventListener('click', (event) => {
    window.location.href = `following.html`;
  });

  const changeBtnDiv = document.querySelector('.changeBtn');
  const button = document.createElement('a');
  button.type = 'button';
  button.classList.add('btn', 'btn-primary', 'mt-1', 'user-info-btn');
  button.style.display = 'block';
  button.textContent = 'User Info';
  button.setAttribute('href', 'user_info.html');
  changeBtnDiv.appendChild(button);

  // 핀 콘텐츠 목록
  fetch(`${url}/pin/comment/`, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      // 가져온 사용자 데이터를 폼 필드에 채워줍니다.
      const tbody = document.querySelector('#editList');
      const deleteTbody = document.querySelector('#deleteList');

      const pinContents = data;
      pinContents.forEach((data) => {
        const newTableRow = createTableRow(data);

        if (data.is_deleted) {
          deleteTbody.appendChild(newTableRow);
        } else {
          tbody.appendChild(newTableRow);
        }
      });
    })
    .catch((error) => {
      console.error('Failed to retrieve user data.', error);
    });

  function createTableRow(data) {
    const pin_content = data;
    const tableRow = document.createElement('tr');

    // 핀 이름 셀 생성
    const pinCell = document.createElement('td');
    pinCell.classList.add('description', 'pt-10', 'pb-10', 'pin-cell');
    const pinLink = document.createElement('a');
    pinLink.href = '#';
    pinLink.textContent = data.pin_title;
    pinLink.setAttribute('data-bs-toggle', 'modal');
    pinLink.setAttribute('data-bs-target', '.bd-example-modal-lg');
    pinLink.addEventListener('click', (e) => {
      e.preventDefault();
      displayPinDetail(data.place_id);
    });
    pinCell.appendChild(pinLink);
    tableRow.appendChild(pinCell);

    // 이미지 셀 생성
    if (data.is_deleted) {
    } else {
      const imageCell = document.createElement('td');
      imageCell.classList.add('image', 'pt-10', 'pb-10');

      const contentPhoto = document.createElement('img');
      contentPhoto.classList.add('img-fluid');
      contentPhoto.style.width = '75px';
      contentPhoto.style.height = '75px';
      contentPhoto.style.borderRadius = '10%';
      if (data.photo) {
        contentPhoto.src = data.photo;
      } else {
        contentPhoto.src =
          'https://favspot-fin.s3.amazonaws.com/images/default/main_logo.png';
      }
      contentPhoto.alt = '';

      imageCell.appendChild(contentPhoto);
      tableRow.appendChild(imageCell);
    }

    // 텍스트 셀 생성
    const textCell = document.createElement('td');
    textCell.classList.add('description', 'pt-10', 'pb-10', 'text-cell');
    const textLink = document.createElement('span');
    textLink.href = '#';
    if (data.is_deleted) {
      textLink.textContent = '코멘트를 작성해주세요';
      textLink.style.color = 'grey';
    } else if (data.text) {
      textLink.textContent = data.text;
      textLink.style.fontWeight = 500;
    } else {
      textLink.textContent = '입력된 코멘트가 없습니다';
      textLink.style.color = 'grey';
    }

    textCell.appendChild(textLink);
    tableRow.appendChild(textCell);

    // 수정 버튼 셀 생성
    const editCell = document.createElement('td');
    editCell.classList.add('td-quantity', 'pt-10', 'pb-10');
    if (data.is_deleted) {
      editCell.style.width = '170px';
    }
    const editLink = document.createElement('a');
    editLink.classList.add('button');
    editLink.href = '#';
    if (data.is_deleted) {
      editLink.textContent = '작성';
    } else {
      editLink.textContent = '수정';
    }

    // 수정 버튼 클릭 이벤트
    editLink.addEventListener('click', (e) => {
      e.preventDefault();

      // 기존에 열려있는 폼이 있는 행이 있다면 제거
      const oldFormRow = document.querySelector('#edit-form-row');
      if (oldFormRow) {
        // 폼이 이미 열려 있고, 그 행이 현재 행 바로 아래에 있는 경우, 해당 행을 제거
        if (oldFormRow === tableRow.nextSibling) {
          oldFormRow.remove();
          return;
        }

        // 다른 행의 폼이 열려 있는 경우, 그 행을 제거
        oldFormRow.remove();
      }

      // 새로운 폼을 포함한 행을 생성하고, 현재 클릭된 줄 바로 아래에 삽입
      const newFormRow = document.createElement('tr');
      newFormRow.id = 'edit-form-row';
      const formContainer = createEditForm(data, newFormRow, tableRow);

      tableRow.parentNode.insertBefore(newFormRow, tableRow.nextSibling);
    });

    editCell.appendChild(editLink);
    tableRow.appendChild(editCell);

    // 삭제 버튼 셀 생성
    if (!data.is_deleted) {
      const deleteCell = document.createElement('td');
      deleteCell.classList.add('td-quantity', 'pt-10', 'pb-10');

      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-danger';
      deleteButton.textContent = 'X';

      /// 삭제 버튼 클릭 이벤트
      deleteButton.addEventListener('click', () => {
        if (confirm('이 코멘트를 삭제하시겠습니까?')) {
          fetch(`${url}/pin/content/${data.id}/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {
              if (response.status === 204) {
                location.reload();
              } else if (response.status === 403) {
                window.alert('코멘트는 작성자만 삭제할 수 있습니다.');
              }
            })
            .catch((error) => {
              console.error('삭제시 문제가 발생했습니다:', error);
            });
        }
      });

      deleteCell.appendChild(deleteButton);
      tableRow.appendChild(deleteCell);
    }

    return tableRow;
  }

  // 핀 콘텐츠 수정 칸 생성
  function createEditForm(data, newFormRow, tableRow) {
    const container = newFormRow;
    console.log(container);

    // 이미지 프리뷰 생성
    const inputImage = document.createElement('td');
    inputImage.className = 'inputImage';
    const imagePreview = document.createElement('img');
    imagePreview.id = 'imagePreview';
    imagePreview.className = 'img-fluid ml-3';
    imagePreview.style.objectFit = 'cover';
    imagePreview.style.width = '100px';
    imagePreview.style.height = '100px';
    imagePreview.style.borderRadius = '3px';
    if (data.photo) {
      imagePreview.src = data.photo;
    } else {
      imagePreview.src =
        'https://favspot-fin.s3.amazonaws.com/images/default/main_logo.png';
    }

    // 이미지 프리뷰를 컨테이너에 추가
    inputImage.appendChild(imagePreview);

    // 이미지 업로드 필드 생성
    const inputDiv = document.createElement('div');
    inputDiv.className = 'inputDiv';

    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.id = 'photoUpload';
    imageInput.style.display = 'none';
    inputImage.appendChild(imageInput);

    const uploadBtn = document.createElement('button');
    uploadBtn.id = 'uploadButton';
    uploadBtn.textContent = '파일 선택';

    inputDiv.appendChild(inputImage);
    inputDiv.appendChild(uploadBtn);
    container.appendChild(inputDiv);

    uploadBtn.addEventListener('click', () => {
      imageInput.click();
    });
    imageInput.addEventListener('change', function () {
      const selectedImage = imageInput.files[0];

      if (selectedImage) {
        const reader = new FileReader();
        reader.onload = function (event) {
          imagePreview.src = event.target.result;
        };
        reader.readAsDataURL(selectedImage);
      }
    });

    // 텍스트 수정 필드 생성
    const textTd = document.createElement('td');

    const textInput = document.createElement('textarea');
    textInput.id = 'textUpload';
    textInput.className = 'rounded';
    // 내용 변경 시 자동으로 높이 조절
    textInput.addEventListener('input', autoResize, false);
    function autoResize() {
      this.style.height = 'auto';
      this.style.height = this.scrollHeight + 'px';
    }
    textInput.value = data.text;
    textTd.appendChild(textInput);
    if (tableRow.children.length == 5) {
      const newTd = document.createElement('td');
      container.appendChild(newTd);
    }
    container.appendChild(textTd);

    // 등록 버튼 추가
    const submitTd = document.createElement('td');
    const submitButton = document.createElement('button');
    submitButton.className = 'rounded submitbtn';
    submitButton.textContent = '등록';
    // 등록 버튼 클릭 이벤트
    submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      // 텍스트 필드, 이미지 업로드가 비어있는지 확인
      if (!textInput.value.trim() && !imageInput.files.length) {
        window.alert(
          '빈 코멘트를 등록할 수 없습니다. 내용이나 이미지를 업로드해주세요.'
        );
        return;
      }
      if (!window.confirm('등록하시겠습니까?')) {
        return;
      }
      const formData = new FormData();

      if (textInput.value) {
        formData.append('text', textInput.value);
      }
      if (imageInput.files[0]) {
        formData.append('photo', imageInput.files[0]);
      }

      fetch(`${url}/pin/content/${data.id}/`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.reload();
        })
        .catch((error) => console.error(error));
    });

    submitTd.appendChild(submitButton);
    container.appendChild(submitTd);

    if (tableRow.children.length == 5) {
      const newTd = document.createElement('td');
      container.appendChild(newTd);
    }

    return container;
  }
}

/// 백엔드에서 핀 상세보기 정보 가져오기
function displayPinDetail(place_id) {
  fetch(`http://127.0.0.1:8000/pin/${place_id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      // 성공 상태가 아니면 에러 메시지 출력 후 함수 종료
      return response.json();
    })
    .then((data) => {
      // 핀 생성 스텝들 숨기고 초기화하기
      const pinCreationElement = document.getElementById('pinCreationSteps');
      pinCreationElement.style.display = 'none';
      const saveButton = document.getElementById('saveButton');
      saveButton.innerText = '핀 저장';

      createPlaceInfo(data.results);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

function createPlaceInfo(data) {
  // 가져온 데이터로 상세보기 정보 표시하기
  const modalTitleElement = document.getElementById('myModalLabel');
  const modalCategoryElement = document.getElementById('modalCategory');
  const updatedAt = document.querySelector('.updated-at');
  const pinCount = document.querySelector('.pin-count');
  const pagination = document.getElementById('pagination');
  const pinContentsContainer = document.querySelector('#pinContentsContainer');
  pagination.style.display = 'none';
  pinContentsContainer.style.display = 'none';

  const dataPin = data.pin;
  modalTitleElement.textContent = dataPin.title;
  modalCategoryElement.textContent = dataPin.category;
  updatedAt.style.display = 'inline-block';
  pinCount.style.display = 'inline-block';

  createPinData(data, dataPin);
  createAddress(dataPin);
  createMenu(data);
  createThumbnailImg(dataPin);
}
