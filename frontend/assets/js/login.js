export function createLogin() {
  const $login = document.querySelector('#login');
  console.log($login);
  $login.addEventListener('submit', (event) => {
    console.log('로그인');
    event.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    login(email, password);
  });

  function login(email, password) {
    const loginError = document.getElementById('loginError');
    fetch('http://favspot.site:8000/user/login/', {
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
        // 로그인 성공 시 처리
        window.location.href = '/index.html';
      })
      .catch((error) => {
        loginError.textContent = error.message;
      });
  }
}
