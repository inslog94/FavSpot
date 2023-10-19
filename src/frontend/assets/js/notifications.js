export function createNotifications() {
  const url = 'http://favspot.site:8000';
  const tagList = document.getElementById('tagList');

  // 알림 목록
  const checkedCountElement = document.querySelector('#checkedCount');

  fetch(`${url}/notification/`, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      // 가져온 사용자 데이터를 폼 필드에 채워줍니다.
      console.log(data[0]);
      const tbody = document.querySelector('#notificationList');
      const notifications = data;
      notifications.forEach((data) => {
        const newTableRow = createTableRow(data);
        tbody.appendChild(newTableRow);
      });
    })
    .catch((error) => {
      console.error('Failed to retrieve data.', error);
    });

  function createTableRow(data) {
    const notification = data;
    const tableRow = document.createElement('tr');
    // is_read 값에 따라 배경색 클래스 추가
    if (data.is_read) {
      tableRow.classList.add('read-notification');
    }

    // 읽음 여부 셀 생성
    const readCell = document.createElement('td');
    readCell.classList.add('description', 'pt-10', 'pb-10');
    const readLink = document.createElement('div');
    if (data.is_read == true) {
      readLink.innerHTML = '<i class="fa fa-envelope-open-o"></i>';
    } else {
      readLink.innerHTML = '<i class="fa fa-envelope"></i>';
    }
    readCell.appendChild(readLink);
    tableRow.appendChild(readCell);

    // 메시지 셀 생성
    const messageCell = document.createElement('td');
    messageCell.classList.add('description', 'pt-10', 'pb-10', 'text-cell');
    const messageLink = document.createElement('a');
    messageLink.href = '#';
    messageLink.textContent = data.message;
    messageCell.appendChild(messageLink);
    tableRow.appendChild(messageCell);

    messageLink.addEventListener('click', (event) => {
      event.preventDefault();
      // is_read를 True로 변경하는 요청
      fetch(`${url}/notification/${data.id}/read/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('적절하지 않은 응답입니다');
          }

          const relatedId = data.related_url.split(',')[0];
          // 성공적으로 처리된 후 페이지 이동
          if (relatedId) {
            // 보드 관련 알림인 경우
            localStorage.setItem('selectedPk', relatedId);
            window.location.href = 'board_detail.html';
          } else {
            // 팔로우 관련 알림인 경우
            window.location.href = `user_info.html?pk=${data.sender}`;
          }
        })
        .catch((error) => console.error('error:', error));
    });

    // 알림 종류 셀 생성
    const typeCell = document.createElement('td');
    typeCell.classList.add('description', 'pt-10', 'pb-10', 'pin-cell');
    const typeLink = document.createElement('div');
    typeLink.textContent = data.related_url.split(',')[1];
    typeCell.appendChild(typeLink);
    tableRow.appendChild(typeCell);

    // 보낸 유저 이메일 셀 생성
    const senderCell = document.createElement('td');
    senderCell.classList.add('description', 'pt-10', 'pb-10', 'pin-cell');
    const senderLink = document.createElement('img');
    senderLink.classList.add('img-fluid');
    senderLink.style.width = '75px';
    senderLink.style.height = '75px';
    senderLink.style.borderRadius = '50%';
    senderLink.style.cursor = 'pointer';
    if (data.sender_profile_img) {
      senderLink.src = data.sender_profile_img;
    } else {
      senderLink.src =
        'https://favspot-fin.s3.amazonaws.com/images/default/default_user_clear.png';
    }
    senderLink.alt = '';
    senderCell.appendChild(senderLink);
    tableRow.appendChild(senderCell);

    senderLink.addEventListener('click', (event) => {
      window.location.href = `user_info.html?pk=${data.sender}`;
    });

    // 알림 시간 셀 생성
    const timeCell = document.createElement('td');
    timeCell.classList.add('description', 'pt-10', 'pb-10', 'pin-cell');
    const timeLink = document.createElement('div');

    const serverDate = new Date(data.created_at);
    const now = new Date();
    let timeText;
    if (serverDate.toDateString() === now.toDateString()) {
      // 오늘이면 시간만 표시
      const hours = String(serverDate.getHours()).padStart(2, '0');
      const minutes = String(serverDate.getMinutes()).padStart(2, '0');
      timeText = `${hours}:${minutes}`;
    } else {
      // 오늘이 아니면 날짜만 표시
      const year = serverDate.getFullYear();
      const month = String(serverDate.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작하므로 +1 필요
      const date = String(serverDate.getDate()).padStart(2, '0');
      timeText = `${year}-${month}-${date}`;
    }

    timeLink.textContent = timeText;
    timeCell.appendChild(timeLink);
    tableRow.appendChild(timeCell);

    // 체크박스 셀 생성
    const checkboxCell = document.createElement('td');
    checkboxCell.classList.add('td-quantity', 'pt-10', 'pb-10');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = data.id;

    checkbox.addEventListener('change', () => {
      // 모든 일반 체크박스 찾기
      const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]:not(#checkAll)'
      );

      // 현재 체크된 박스 수 계산
      const checkedCount = Array.from(checkboxes).filter(
        (box) => box.checked
      ).length;

      // 화면에 표시
      if (checkedCount === 0) {
        // 선택된 항목이 없으면 요소를 숨김
        checkedCountElement.style.display = 'none';
        readAllButton.style.visibility = 'hidden';
        deleteAllButton.style.visibility = 'hidden';
      } else {
        // 선택된 항목이 있으면 개수를 표시하고 요소를 보임
        checkedCountElement.textContent = `선택된 알림 ${checkedCount}개`;
        checkedCountElement.style.display = '';
        readAllButton.style.visibility = '';
        deleteAllButton.style.visibility = '';
      }
    });

    checkboxCell.appendChild(checkbox);
    tableRow.appendChild(checkboxCell);

    return tableRow;
  }

  // 모두 삭제 버튼 클릭 이벤트
  const deleteAllButton = document.querySelector('.deleteAllButton');
  deleteAllButton.addEventListener('click', () => {
    const checkboxes = Array.from(
      document.querySelectorAll('input[type="checkbox"]:not(#checkAll)')
    );
    const checkedBoxes = checkboxes.filter((box) => box.checked); // 선택된 체크박스만 필터링

    // 체크된 박스가 없으면 함수 종료
    if (checkedBoxes.length === 0) {
      return;
    }

    const deletePromises = []; // 삭제 요청 프로미스들을 저장할 배열

    checkedBoxes.forEach((box) => {
      const deletePromise = fetch(`${url}/notification/${box.value}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      deletePromises.push(deletePromise); // 배열에 추가
    });

    const confirmDelete = window.confirm(
      '선택한 알림들을 모두 삭제하시겠습니까?'
    );
    if (confirmDelete) {
      Promise.all(deletePromises)
        .then((responses) => {
          responses.forEach((response, index) => {
            if (response.status === 204) {
              checkedBoxes[index].parentElement.parentElement.remove();
              checkedCountElement.style.display = 'none';
              readAllButton.style.visibility = 'hidden';
              deleteAllButton.style.visibility = 'hidden';
            } else if (response.status === 403) {
              window.alert('알림은 본인만 삭제할 수 있습니다.');
            }
          });
        })
        .catch((error) => {
          console.error('삭제 중 문제가 발생했습니다:', error);
        });
    }
  });

  // 모두 읽음 버튼 클릭 이벤트
  const readAllButton = document.querySelector('.readAllButton');
  readAllButton.addEventListener('click', () => {
    const checkboxes = Array.from(
      document.querySelectorAll('input[type="checkbox"]:not(#checkAll)')
    );
    const checkedBoxes = checkboxes.filter((box) => box.checked); // 선택된 체크박스만 필터링

    // 체크된 박스가 없으면 함수 종료
    if (checkedBoxes.length === 0) {
      return;
    }

    const readPromises = []; // 읽음 요청 프로미스들을 저장할 배열

    checkedBoxes.forEach((box) => {
      const readPromise = fetch(`${url}/notification/${box.value}/read/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      readPromises.push(readPromise); // 배열에 추가
    });

    Promise.all(readPromises)
      .then((responses) => {
        window.alert('선택한 알림들을 모두 읽음 처리했습니다.');
        window.location.reload();
      })
      .catch((error) => {
        console.error('읽음 처리 중 문제가 발생했습니다:', error);
      });
  });

  // 모두 선택/해제 체크박스 클릭 이벤트
  const checkAllBox = document.querySelector('#checkAll');

  checkAllBox.addEventListener('change', () => {
    // 모든 일반 체크박스 찾기
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:not(#checkAll)'
    );
    // 각 일반 체크박스의 상태를 '모두 선택/해제' 상태로 설정
    checkboxes.forEach((box) => (box.checked = checkAllBox.checked));
    // 현재 체크된 박스 수 계산
    const checkedCount = Array.from(checkboxes).filter(
      (box) => box.checked
    ).length;

    // 화면에 표시
    if (checkedCount === 0) {
      // 선택된 항목이 없으면 요소를 숨김
      checkedCountElement.style.display = 'none';
      readAllButton.style.visibility = 'hidden';
      deleteAllButton.style.visibility = 'hidden';
    } else {
      // 선택된 항목이 있으면 개수를 표시하고 요소를 보임
      checkedCountElement.textContent = `선택된 알림 ${checkedCount}개`;
      checkedCountElement.style.display = '';
      readAllButton.style.visibility = '';
      deleteAllButton.style.visibility = '';
    }
  });
}
