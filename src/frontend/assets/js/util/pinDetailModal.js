export function createPinDetail() {
  // 새로운 모달 엘리먼트를 생성합니다.
  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade', 'bd-example-modal-lg');
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'myLargeModalLabel');
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
<div class="modal-dialog modal-lg mt-0" style="height: 0px;">
  <div class="modal-content">
    <div class="modal-header align-items-start" style="justify-content: center">
      <div class="modal-title" id="exampleModalLongTitle">
        <div class="section-title mb-10">
          <div class="blog-entry mb-10">
            <div class="entry-image clearfix">
            <img
            class="img-fluid subscribe-icon"
            src=""
            alt="thumbnail img"
          />
            </div>
            <div class="blog-detail">
              <div class="title-wrap">
                <h1 id="myModalLabel">Pin title</h1>
                <div class="entry-meta mb-30">
                <ul>
                  <li>
                    <i class="fa fa-map"></i>
                    <a href="#" id="modalCategory">category</a>
                  </li>
                  <li class="updated-at">
                    <i class="fa fa-calendar-o"></i>
                    <a href="#" id="modalUpdatedAt">12 Aug 2021</a>
                  </li>
                  <li class="pin-count">
                    <i class="fa fa-map-pin"></i>
                    <a href="#" id="modalPinCount">5</a>
                  </li>
                </ul>
                </div>
                <button
                  id="saveButton"
                  class="button button-border mt-2 mb-3 form-button"
                  style="display: none"
                >
                  핀 저장
                </button>
              </div>
              <!-- 핀 생성 step (숨김) -->
              <div id="pinCreationSteps" style="display: none">
                <div id="step1" class="step">
                  <!-- 보드 선택 드롭다운 -->
                  <label for="boardSelection" class="form-label"
                    >내 보드 목록</label
                  >
                  <select
                    id="boardSelection"
                    name="boards"
                    class="form-select"
                  >
                    <!-- 유저 보드 목록 추가될 부분 -->
                  </select>
                </div>
                <div id="step2" class="step" style="display: none">
                  <!-- 사진 업로드 (선택사항)-->
                  <label for="photoUpload" class="form-label"
                    >사진 업로드</label
                  >
                  <input
                    type="file"
                    id="photoUpload"
                    class="form-control"
                  />
                  <!-- 텍스트 입력 (선택사항)-->
                  <label for="textInput" class="form-label"
                    >내용 작성</label
                  >
                  <textarea
                    id="textInput"
                    rows="4"
                    class="form-control"
                  ></textarea>
                </div>
                <div class="buttons-wrap">
                  <button
                    id="saveNextButton"
                    class="button button-border mt-2 mb-3 form-button"
                  >
                    코멘트 쓰기
                  </button>
                  <button
                    id="createButton"
                    class="button-border mt-2 mb-3 btn btn-outline-primary"
                  >
                    저장
                  </button>
                </div>
              </div>
              <div class="entry-content">
                <p id="modalNewAddress" class="mt-3 mb-1">New Address</p>
                <p id="modalOldAddress" class="mt-3 mb-1">Old Address</p>
                <ul class="list list-arrow mt-30" id="modalMenu">
                  <!-- 각각의 메뉴가 삽입될 공간 -->
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="static-container d-flex justify-content-center align-items-center"
    >
      <!-- <div id="staticMap" style="width: 80%; height: 40vh"></div> -->
    </div>
    <!-- 핀 콘텐츠가 만들어질 컨테이너 -->
    <div id="pinContentsContainer" class="modal-body">
      <div class="port-post clearfix">
        <div class="port-post-photo">
        <img src="" alt="pin-comment-photo" />
        </div>
        <div class="port-post-info">
          <h3 class="theme-color">Kevin Martin</h3>
          <button type="button" class="close btn btn-lg p-0">
            <span>&times;</span>
          </button>
          <p>P</p>
        </div>
      </div>
    </div>
    <!-- 페이지 버튼 -->
    <div class="col-lg-12 col-md-12">
      <nav aria-label="Page navigation example">
        <ul id="pagination" class="pagination justify-content-center">
          <li id="previousButton" class="page-item disabled">
            <a class="page-link" href="#" tabindex="-1"
              ><i class="fa fa-chevron-left"></i
            ></a>
          </li>
          <!-- 페이지 숫자 생성 공간 -->
          <li id="nextButton" class="page-item">
            <a class="page-link" href="#"
              ><i class="fa fa-chevron-right"></i
            ></a>
          </li>
        </ul>
      </nav>
    </div>

    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
      >
        Close
      </button>
    </div>
  </div>
</div>
`;
  // 생성한 모달 엘리먼트를 문서에 추가합니다.
  document.body.appendChild(modal);
}
