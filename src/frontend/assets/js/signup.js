const $signup = document.querySelector('#signup');
$signup.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  signup(email, password);
});

function signup(email, password) {
  const signupError = document.getElementById('signupError');
  fetch('https://favspot.site:8443/user/signup/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.err_msg);
        });
      }
      return response.json();
    })
    .then((data) => {
      // 회원가입 성공 시 처리
      window.location.href = '/index.html';
    })
    .catch((error) => {
      signupError.textContent = error.message;
    });
}
