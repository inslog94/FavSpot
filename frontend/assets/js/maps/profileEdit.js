export function createProfileEdit() {
  // 프로필 이미지 추가시 img 태그에 미리보기 추가
  document.addEventListener('DOMContentLoaded', function () {
    const profileImgInput = document.getElementById('profileImg');
    const imagePreview = document.getElementById('imagePreview');

    profileImgInput.addEventListener('change', function () {
      const selectedImage = profileImgInput.files[0];

      if (selectedImage) {
        const reader = new FileReader();
        reader.onload = function (event) {
          imagePreview.src = event.target.result;
        };
        reader.readAsDataURL(selectedImage);
      }
    });

    // 비밀번호 유효성 검사
    const pwChange = document.querySelector('.pwChange');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword1 = document.getElementById('newPassword1');
    const newPassword2 = document.getElementById('newPassword2');
    const passwordError = document.getElementById('passwordError');
    const profileEdit = document.querySelector('.profileEdit');
    const passwordInputs = [currentPassword, newPassword1, newPassword2];

    // 쿠키 문자열 가져오기
    const cookiesString = document.cookie;

    // 쿠키 문자열을 파싱하여 객체로 변환
    const cookiesArray = cookiesString.split('; ');
    const cookies = {};

    cookiesArray.forEach((cookie) => {
      const [name, value] = cookie.split('=');
      cookies[name] = value;
    });

    // social_login 쿠키 값 가져오기
    const socialLoginCookieValue = cookies['social_login'];

    // social_login 쿠키 값이 'True'인지 'False'인지 확인
    if (socialLoginCookieValue === 'True') {
      // 소셜 로그인 상태
      pwChange.style.display = 'none';
    } else {
      // 일반 로그인 상태
      pwChange.style.display = 'block';
    }

    // 입력 이벤트를 감지하여 required 옵션을 동적으로 설정/해제
    passwordInputs.forEach((input) => {
      input.addEventListener('input', () => {
        const atLeastOneInputFilled = passwordInputs.some(
          (input) => input.value !== ''
        );

        // 모든 입력란이 비어있지 않다면 required 설정, 아니면 해제
        passwordInputs.forEach((input) => {
          input.required = atLeastOneInputFilled;
        });

        // 새로운 비밀번호 체크
        const newPassword1Value = newPassword1.value;
        const newPassword2Value = newPassword2.value;

        if (newPassword1Value && newPassword2Value) {
          if (newPassword1Value !== newPassword2Value) {
            passwordError.textContent = "Passwords don't match.";
          } else {
            passwordError.textContent = '';

            // 현재 비밀번호와 새로운 비밀번호가 같은지 체크
            if (
              currentPassword.value === newPassword1Value ||
              currentPassword.value === newPassword2Value
            ) {
              passwordError.textContent =
                'New password should be different from the current password.';
            }
          }
        }
      });
    });

    // passwordError가 있는 경우 폼 제출할 수 없게 처리
    profileEdit.addEventListener('click', function (event) {
      if (passwordError.textContent !== '') {
        event.preventDefault();
      }
    });
  });

  const $profileEdit = document.querySelector('.profileEdit');
  $profileEdit.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('제출');
    const profileImg = document.querySelector('#profileImg');
    const nickname = document.querySelector('#nickname').value;
    const currentPassword = document.querySelector('#currentPassword').value;
    const newPassword1 = document.querySelector('#newPassword1').value;
    const newPassword2 = document.querySelector('#newPassword2').value;

    const formData = new FormData();
    if (nickname !== '') {
      formData.append('nickname', nickname);
    }
    if (profileImg.files[0]) {
      formData.append('profile_img', profileImg.files[0]);
    }
    if (currentPassword !== '') {
      formData.append('password', currentPassword);
    }
    if (newPassword1 !== '') {
      formData.append('new_password1', newPassword1);
    }
    if (newPassword2 !== '') {
      formData.append('new_password2', newPassword2);
    }

    profileEdit(formData);
  });

  async function profileEdit(formdata) {
    const passwordError = document.getElementById('passwordError');
    try {
      const response = await fetch('http://127.0.0.1:8000/user/me/', {
        method: 'PATCH',
        body: formdata,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      const data = await response.json();
      console.log(data);
      alert('Profile Update success.');
      location.reload();
    } catch (error) {
      const errData = JSON.parse(error.message);
      console.log(errData);

      for (const key in errData['err_msg']) {
        if (Array.isArray(errData['err_msg'][key])) {
          const messages = errData['err_msg'][key];
          console.log(typeof messages);
          passwordError.textContent = messages.join(' ');
        } else {
          const messages = errData['err_msg'];
          passwordError.textContent = messages;
        }
      }
    }
  }
}
