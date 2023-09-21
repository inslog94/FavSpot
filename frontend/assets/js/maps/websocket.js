let socket;
let notifications = []; // 알림 메시지들을 저장할 배열

fetch(`http://127.0.0.1:8000/user/me/`, {
  method: "GET",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    // 웹소켓 연결 url
    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/${data.results.User.id}/`
    );

    socket.addEventListener("open", (event) => {
      console.log("WebSocket connection established.");
    });

    socket.addEventListener("message", (event) => {
      // 들어오는 WebSocket messages 관리 (알림)
      const notification = JSON.parse(event.data);
      console.log("Received notification:", notification.message);

      // 받은 알림 메시지를 배열에 추가
      notifications.push(notification.message);
      // 만약 알림이 세 개 이상이라면, 가장 오래된 것부터 제거
      if (notifications.length > 2) {
        notifications.shift();
      }

      // 새로운 알림이 도착했으므로 붉은 점 표시
      document.querySelector(".notification-dot").style.display = "inline";
      document.querySelector("#notification-div").style.display = "flex";

      // 기존 내용 초기화
      const notificationList = document.getElementById("notification-list");
      notificationList.innerHTML = "";
      // 최신 순으로 반복하여 li 요소 추가
      for (let i = notifications.length - 1; i >= 0; i--) {
        const listItem = document.createElement("li");
        listItem.className = "ms-3";
        listItem.style.listStyleType = "disc";
        listItem.style.wordBreak = "keep-all";
        listItem.textContent = `${notifications[i]}`;
        notificationList.appendChild(listItem);
      }
    });

    socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed.", event);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// 페이지 로드시 읽지않은 알림이 있는지 확인 후 없다면 붉은 점 표시
document.addEventListener("DOMContentLoaded", function () {
  fetch(`http://127.0.0.1:8000/notification/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const unreadNotifications = data.filter(
        (notification) => !notification.is_read
      );

      if (unreadNotifications.length > 0) {
        document.querySelector(".notification-dot").style.display = "inline";
      } else {
        document.querySelector(".notification-dot").style.display = "none";
      }
    });
});
