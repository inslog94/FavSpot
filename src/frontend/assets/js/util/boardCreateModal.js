export function createBoard() {
  // Create the board add modal container
  const boardAddModal = document.createElement('div');
  boardAddModal.id = 'board_add_modal';
  boardAddModal.className = 'board_add_modal_cls';
  // boardAddModal.style.display = 'flex'; // Flex 속성 추가

  // Create the board content modal
  const boardContentModal = document.createElement('div');
  boardContentModal.id = 'board_content_modal';
  boardContentModal.style.height = '300px';
  boardContentModal.className = 'board_add_modal_content';
  boardContentModal.style.display = 'flex'; // Flex 속성 추가

  // Create the heading for the modal
  const heading = document.createElement('div');
  const headingText = document.createElement('span');
  headingText.textContent = '어떤 보드를 만드실건가요?';
  heading.appendChild(headingText);

  // Create the form elements
  const formDiv = document.createElement('div');

  const inputBox1 = document.createElement('div');
  inputBox1.id = 'board_input_box1';
  const nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'board_add_title');
  nameLabel.textContent = '이름';
  const nameInput = document.createElement('input');
  nameInput.setAttribute('type', 'text');
  nameInput.id = 'board_add_title';
  nameInput.placeholder = '예: 동네 맛집, 버킷 리스트';
  inputBox1.appendChild(nameLabel);
  inputBox1.appendChild(nameInput);

  const inputBox2 = document.createElement('div');
  inputBox2.id = 'board_input_box2';
  const tagsLabel = document.createElement('label');
  tagsLabel.setAttribute('for', 'board_add_tags');
  tagsLabel.innerHTML = '태그<span> 쉼표(,)로 구분해주세요</span>';
  const tagsInput = document.createElement('input');
  tagsInput.setAttribute('type', 'text');
  tagsInput.id = 'board_add_tags';
  tagsInput.placeholder = '예: 부산, 제주도, 맛집';
  inputBox2.appendChild(tagsLabel);
  inputBox2.appendChild(tagsInput);

  formDiv.appendChild(inputBox1);
  formDiv.appendChild(inputBox2);

  // Create the buttons
  const nextButton = document.createElement('div');
  nextButton.id = 'board_add_next_btn';
  nextButton.textContent = '다음';

  const createButton = document.createElement('div');
  createButton.id = 'board_add_c_btn';
  createButton.textContent = '생성';

  // Append form elements to content modal
  boardContentModal.appendChild(heading);
  boardContentModal.appendChild(formDiv);
  boardContentModal.appendChild(nextButton); // nextButton을 boardContentModal의 하위로 이동
  boardContentModal.appendChild(createButton); // createButton을 boardContentModal의 하위로 이동

  // Create the board confirm modal
  const boardConfirmModal = document.createElement('div');
  boardConfirmModal.id = 'board_confirm_modal';
  boardConfirmModal.style.height = '250px';
  boardConfirmModal.style.display = 'none';
  boardConfirmModal.className = 'board_add_modal_content';

  // Create the confirmation message
  const confirmationMessage = document.createElement('div');
  const messageSpan = document.createElement('span');
  messageSpan.id = 'board_add_result';
  messageSpan.textContent = '보드가 성공적으로 생성되었습니다 !';
  confirmationMessage.appendChild(messageSpan);

  // Create the confirm button
  const confirmButton = document.createElement('div');
  confirmButton.id = 'board_add_confirm_btn';
  confirmButton.textContent = '확인';

  // Append message and button to confirm modal
  boardConfirmModal.appendChild(confirmationMessage);
  boardConfirmModal.appendChild(confirmButton);

  // Append modals to the board add modal container
  boardAddModal.appendChild(boardContentModal);
  boardAddModal.appendChild(boardConfirmModal);

  // Append the board add modal container to the body
  document.body.appendChild(boardAddModal);
}
