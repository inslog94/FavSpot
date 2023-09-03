import { PIN_DETAIL, origin } from "./data.js";
import { requestUser } from "./data.js";

export function pinDetail() {
  let pinData = null;

  fetchUserInfo();
  // 첫 페이지 핀 콘텐츠들을 불러는 함수 호출
  /// 페이지네이션을 통한 핀 콘텐츠 보여주기
  let currentPage = 1;
  displayPinContents(currentPage);
  // 핀 상세보기 정보 가져오는 함수 호출
  displayPinDetail();

  // 유저 정보 가져오기
  function fetchUserInfo() {
    return fetch(`${origin}/user/me/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // 가져온 데이터로 보드 선택 드롭다운 채우기
        const boardSelectionElement = document.getElementById("boardSelection");

        // 이전에 있던 옵션들을 모두 제거합니다.
        while (boardSelectionElement.firstChild) {
          boardSelectionElement.removeChild(boardSelectionElement.firstChild);
        }

        data.results.Boards.forEach((board) => {
          const optionElement = document.createElement("option");
          optionElement.value = board.id;
          optionElement.textContent = board.title;

          boardSelectionElement.appendChild(optionElement);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  /// 백엔드에서 핀 상세보기 정보 가져오기
  function displayPinDetail() {
    fetch(`${origin}/pin/${PIN_DETAIL.placeId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        pinData = data.results.pin; // 데이터 저장
        // 가져온 데이터로 상세보기 정보 표시하기
        const modalTitleElement = document.getElementById("myModalLabel");
        const modalCategoryElement = document.getElementById("modalCategory");
        const modalPinCountElement = document.getElementById("modalPinCount");
        const modalUpdatedAtElement = document.getElementById("modalUpdatedAt");
        const modalNewAddressElement =
          document.getElementById("modalNewAddress");
        const modalOldAddressElement =
          document.getElementById("modalOldAddress");
        const modalMenuElement = document.getElementById("modalMenu");
        const subscribeIconElement = document.querySelector(".subscribe-icon");

        modalTitleElement.textContent = data.results.pin.title;
        modalCategoryElement.textContent = data.results.pin.category;
        modalPinCountElement.innerHTML = `이 장소의 핀: <strong>${data.results.pin_content_count}<strong>개`;
        modalUpdatedAtElement.textContent = `업데이트: ${
          data.results.pin.updated_at.split("T")[0]
        }`;
        modalNewAddressElement.innerHTML = `<i class="fa fa-map-marker"></i> <b>도로명주소:</b> ${data.results.pin.new_address}`;
        modalOldAddressElement.innerHTML = `<i class="fa fa-map-marker"></i> <b>지번주소:</b> ${data.results.pin.old_address}`;

        // 메뉴가 있을 시 메뉴를 표 형식으로 보여주기
        if (data.results.menu !== null) {
          const menuItems = data.results.menu;
          let menuHtml = '<h5 class="mt-10 mb-20">- 메뉴 -</h5>';
          menuItems.forEach((menuItem) => {
            menuHtml += `<li>${menuItem.menu} - ${menuItem.price}</li>`;
          });
          modalMenuElement.innerHTML = menuHtml;
        } else {
          modalMenuElement.innerHTML = "<p>제공되는 메뉴가 없습니다.</p>";
        }

        // thumbnail_img를 보여주기
        if (data.results.pin.thumbnail_img) {
          subscribeIconElement.src = `${data.results.pin.thumbnail_img}`; // thumbnail_img 사진과 연결
        } else {
          subscribeIconElement.src =
            "https://everyplacetest.s3.ap-northeast-2.amazonaws.com/dev/default_img.png"; // 기본 사진 지정
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function displayPinContents(page) {
    fetch(`${origin}/pin/${PIN_DETAIL.placeId}/?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // 가져온 데이터로 핀 콘텐츠 정보 표시하기
        const pinContentsContainer = document.getElementById(
          "pinContentsContainer"
        );
        const previousButton = document.getElementById("previousButton");
        const nextButton = document.getElementById("nextButton");

        // 새 핀 콘텐츠를 추가하기 전에 비우기
        pinContentsContainer.innerHTML = "";

        // 각 핀 콘텐츠들을 추가하기
        data.results.pin_contents.forEach((pinContent) => {
          const pinContentElement = document.createElement("div");
          pinContentElement.className =
            "port-post clearfix mb-10 border rounded pin-con";

          // 사진 컨테이너 생성
          const photoContainer = document.createElement("div");
          photoContainer.className = "port-post-photo";

          // <img> 요소 생성
          const photoElement = document.createElement("img");
          photoElement.className = "border rounded ";

          // 핀 콘텐츠에 사진이 있는지 확인
          if (pinContent.photo) {
            photoElement.src = pinContent.photo; // photo 사진과 연결
          } else {
            photoElement.src =
              "https://everyplacetest.s3.ap-northeast-2.amazonaws.com/dev/default_img.png"; // 기본 사진 지정
          }

          // 이미지를 사진 컨테이너에 추가
          photoContainer.appendChild(photoElement);

          const infoContainer = document.createElement("div");
          infoContainer.className = "port-post-info";

          // 작성자 정보 h5 생성
          const emailText = document.createElement("h5");
          emailText.textContent = pinContent.email;
          emailText.className = "theme-color";

          infoContainer.appendChild(emailText);

          // 핀 콘텐츠 텍스트 p 요소 생성 및 추가
          const pinContentP = document.createElement("p");
          pinContentP.textContent = pinContent.text;

          infoContainer.appendChild(pinContentP);

          // 삭제 버튼 생성
          if (requestUser.email && pinContent.email === requestUser.email) {
            const deleteIconDiv = document.createElement("div");
            deleteIconDiv.classList.add("fa", "fa-times");
            pinContentElement.appendChild(deleteIconDiv);

            /// 삭제 버튼 클릭 이벤트
            deleteIconDiv.addEventListener("click", () => {
              if (confirm("이 리뷰를 삭제하시겠습니까?")) {
                fetch(`${origin}/pin/content/${pinContent.id}/`, {
                  method: "DELETE",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((response) => {
                    if (response.status === 204) {
                      pinContentElement.remove();
                      window.alert("리뷰를 삭제했습니다.");
                    } else if (response.status === 403) {
                      window.alert("리뷰는 작성자만 삭제할 수 있습니다.");
                    }
                  })
                  .catch((error) => {
                    console.error("삭제시 문제가 발생했습니다:", error);
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
        const pagination = document.getElementById("pagination");

        // 예전 버튼들 제거
        while (pagination.children.length > 2) {
          pagination.removeChild(pagination.children[1]);
        }

        // 새 버튼들 추가
        for (let i = 0; i < data.links.total_pages; i++) {
          const li = document.createElement("li");
          li.className = "page-item";

          const a = document.createElement("a");
          a.className = "page-link";
          a.textContent = i + 1;

          if (i + 1 === data.links.current_page) {
            li.classList.add("active");

            a.addEventListener("click", function (event) {
              event.preventDefault();
              displayPinContents(i + 1);
            });
          } else {
            a.href = "#";
            a.addEventListener("click", function (event) {
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
          newPreviousButton.classList.remove("disabled");
          newPreviousButton.children[0].addEventListener("click", () => {
            displayPinContents(data.links.current_page - 1);
          });
        } else {
          newPreviousButton.classList.add("disabled");
        }

        if (data.links.next) {
          newNextButton.classList.remove("disabled");
          newNextButton.children[0].addEventListener("click", () => {
            displayPinContents(data.links.current_page + 1);
          });
        } else {
          newNextButton.classList.add("disabled");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // 이전 버튼 클릭 이벤트: 페이지 수 -1
  const previousButton = document.getElementById("previousButton");
  previousButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayPinContents(currentPage);
    }
  });

  // 이전 버튼 클릭 이벤트: 페이지 수 +1
  const nextButton = document.getElementById("nextButton");
  nextButton.addEventListener("click", () => {
    currentPage++;
    displayPinContents(currentPage);
  });

  /// 핀 생성 이벤트
  // 현재 스텝 변수
  let currentStep = 1;

  /// "핀 저장" 버튼 클릭 이벤트
  document.getElementById("saveButton").addEventListener("click", function () {
    let pinCreationElement = document.getElementById("pinCreationSteps");
    // 만약 핀 생성 스텝들이 이미 보여지고 있다면, 숨기고 함수 종료
    if (pinCreationElement.style.display === "block") {
      pinCreationElement.style.display = "none";
      saveButton.innerText = "핀 저장"; // 텍스트를 원래대로 되돌림
      return;
    }
    // 핀 생성 스텝들 보이기
    pinCreationElement.style.display = "block";
    document.getElementById("saveButton").innerText = "취소"; // 텍스트를 '취소'로 변경함
    // 첫 번째 스텝 보이기
    document.getElementById(`step${currentStep}`).style.display = "block";
  });

  // "댓글 쓰기" 버튼 클릭 이벤트
  document
    .getElementById("saveNextButton")
    .addEventListener("click", function () {
      // 다음 스텝으로 이동
      currentStep++;

      // 다음 스텝 보이기
      document.getElementById(`step${currentStep}`).style.display = "block";
      document.getElementById("saveNextButton").style.display = "none";

      if (currentStep === 2) {
        document.getElementById("createButton").style.display = "inline-block";
        document.getElementById("saveNextButton").style.display = "none"; // 댓글 쓰기 버튼을 숨김
      }
    });

  // 저장 버튼 클릭 이벤트
  document
    .getElementById("createButton")
    .addEventListener("click", function () {
      // FormData 객체 생성
      const formData = new FormData();

      // 선택된 보드 ID 추가
      const selectedBoard = document.getElementById("boardSelection").value;
      formData.append("board_id", selectedBoard);

      // 입력된 텍스트 추가
      const textInput = document.getElementById("textInput").value;
      if (textInput) {
        formData.append("text", textInput);
      }

      // 업로드된 이미지 추가
      const uploadedImage = document.getElementById("photoUpload").files[0];
      if (uploadedImage) {
        formData.append("photo", uploadedImage);
      }

      if (pinData) {
        // 필요한 정보들만 선택적으로 추가하기
        [
          "category",
          "title",
          "place_id",
          "new_address",
          "old_address",
          "lat_lng",
        ].forEach((key) => {
          if (pinData.hasOwnProperty(key)) {
            formData.append(key, pinData[key]);
          }
        });
      }

      fetch(`${origin}/pin/`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // 성공 메시지 출력
          alert(`핀을 ${selectedBoard}에 담았습니다.`);
          // 페이지 새로 고침
          window.location.reload();
          displayPinContents(1);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}
