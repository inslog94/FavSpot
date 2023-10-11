export function notification(requestUserPk) {
  let notifications = []; // 알림 메시지들을 저장할 배열

  // 웹소켓 연결 url
  const socket = new WebSocket(
    `ws://127.0.0.1:8000/ws/notifications/${requestUserPk}/`
  );

  socket.addEventListener('open', (event) => {
    console.log('WebSocket connection established.');

    // 웹소켓 연결 후 읽지 않은 알림 요청 메시지 전송
    socket.send(JSON.stringify({
      type: 'check_unread_notifications',
      user_id: requestUserPk,
    }));
  });

  socket.addEventListener('message', (event) => {
    // 들어오는 WebSocket messages 관리 (알림)
    const message = JSON.parse(event.data);

    // 받아온 unread_status에 따라 붉은 점 표시 여부 결정
    if (message.type === "unread_status") { 
      document.querySelector('.notification-dot').style.display = message.status ? 'inline' : 'none';
      
    // 받아온 알림 메시지 처리
    } else { 
      console.log('Received notification:', message.message);

      // 받은 알림 메시지를 배열에 추가
      notifications.push(message.message);
      // 만약 알림이 세 개 이상이라면, 가장 오래된 것부터 제거
      if (notifications.length > 2) {
        notifications.shift();
      }

      // 새로운 알림이 도착했으므로 붉은 점 표시
      document.querySelector('.notification-dot').style.display = 'inline';
      document.querySelector('#notification-div').style.display = 'flex';

      // 기존 내용 초기화
      const notificationList = document.getElementById('notification-list');
      notificationList.innerHTML = '';
      // 최신 순으로 반복하여 li 요소 추가
      for (let i = notifications.length - 1; i >= 0; i--) {
        const listItem = document.createElement('li');
        listItem.className = 'ms-2';
        listItem.style.listStyleType = 'disc';
        listItem.style.wordBreak = 'keep-all';
        listItem.textContent = `${notifications[i]}`;
        notificationList.appendChild(listItem);
      }
    }
  });

  socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed.', event);
  });
}
