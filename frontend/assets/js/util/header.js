import { notification } from '../maps/websocket.js';

export function createHeader() {
  // 기존 main-container 요소 가져오기
  const mainContainer = document.getElementById('main-container');

  // Header 요소 생성
  const header = document.createElement('header');
  header.id = 'header';
  header.className = 'header light logo-center';
  header.style.backgroundColor = 'beige';
  header.style.height = '65px';

  // Nav 요소 생성
  const nav = document.createElement('nav');
  nav.id = 'menu';
  nav.className = 'mega-menu d-flex align-items-center';
  nav.style.minHeight = '60px';

  // Nav 내용 생성
  const navContent = document.createElement('div');
  navContent.className = 'col-lg-12 col-md-12';

  // Shopping Cart 생성
  const shppingCart = document.createElement('div');
  shppingCart.className = 'shpping-cart position-absolute top-0 end-0 mt-2';

  const cartBtn = document.createElement('a'); // 수정된 부분: 변수 이름을 cartLink에서 cartBtn으로 수정
  cartBtn.className = 'cart-btn'; // 수정된 부분: 변수 이름을 cartLink에서 cartBtn으로 수정
  cartBtn.href = '#';

  const profileImg = document.createElement('img');
  profileImg.className = 'profileImg';
  profileImg.src =
    'https://lh3.googleusercontent.com/fife/AK0iWDwVWAXewAMnDql8lfJtLGrKZvfKAylpgqs3EXp5CxPKRpHWq3SECb4I3UakekPyok7aNfKntXMfkgSp3X2dN7vY4uC4I1un6DKjzSlyfms2ZEIhxULmqZOsEMs5xIz66vI6peqkmIKP2b0EaXH4oXvtk_8ssyHnV0wcsM85p9Nl0rOsVOHNQh8B0ApbFtmzpa1ytow5e3L5xl7C2lgiBFVKvuKFpbmc-m7d2wW0MoZRKQsR7kYCnvdl58X-59UamxVyqMRiGm_l9wkEjNmESuObZvuIqkNAZmrPTqNtEM0mStWjJ6mXFmUJ25OReIlC3gE4CG9uQ_l96U5x73kH4Yy7C_CEgTlWTgZHv7b44GTeg1Xg02gYfLkTpFRHqpXeicmdoCjJQWzpqGZLbXa0463UScSFs2K7riK4kS9CgvMLt4QQg_LEDLfnc0_pidGdZGPbDvg8FqJuuqa7c9IyjlHPBVNop19S9IbbfquTFI8YAXwZBLzEl5FY16KZGumwySoqIhp6bUGRzFP_U0Pn4kXOWc2z3SudMA_uz2YyJmvYzGkMXWtZrOb8XfhT8ARe2kqIp6_2Yh0wTKHqKNoZryQNnel9IuiDyUHykSMfk5E6qHbPwS9aM4oBYaxCnw2NiQwAsVmUqeXXvSA46rb7gMe0Gy1JirmlI0j0emeeE5Qh7v1P1wL537xSBoJ5z2OIWmGT9KWhggfH4uFgYJM7VwT19hiYgbm8LRfKvgv93SzEAHnQsa1GfQJlFlqnuRt_KPOOXRD_Qin7YbjA39PQsaR6584Wsiyg2urLHnJ4TIW_807ut9ApXllHPvNp4G5iC5oWdHIXV9facDnvR4OKykODRPpIX71_jmlx622FgMz2gbL3HQNR1BbwPaUdk1PefPFtdQzfRUza20OgKozt5MOO7eYEkbOK-wD7f9QcxWi8B2EJ2OrNjSIlMr1vO5qiPm8lubK7ma5EcLSJpZBX96cTSC1wDZcX3TwoHjCYvi9YJVXLkyxrnxqbq3wVwBlSoj37mPXLp5rUL0vf8BO3dRkirMEkaby6mwowOIpc6Dic6Lq-l8x1P9OHDW7G4V_-yukFUNYlgN0UHTixjts5FA_d3dMWDt55f1cu1T3eXhvWY8sQfd8GVZhT8FIQg7uCKsn5M8mTguX3jgIwYLvhHHTxiWozfkmL5y2PpCCWw-PCJSqgg5IIIR_GdmQuxjxEgIwrw_RAXT0XuK9TCWJRRRMnzduRsZnrX3oyTiwPi7UiEsisgy3vinQnbMHR1hJR-pomQibCQ3chRh0UNd3HdEyl2wHl9cplJVce2yuVCIbABCeCdYzaoQtKP6EvHtVnYnghiZsOaQXtotAzQNvM3ZnqJsOr-6AjE7BvYgvyuRB8yxpKqd-CybF6u7rq4UzV8dvrJqH9WjO63ocy_aV3J8bqjjznfVoUDTJ58QVni0HNjkt40ATihGDD0CES-2mA2O3sEayvKdzUB4uT4BX8L6o1btKEhaTCldEMLGHPnk6pBRqLLkKr0-djl_YHS1_cRFGx5dOEdpe2DtLVsuuK=w1705-h1313';
  profileImg.alt = '';
  profileImg.style.objectFit = 'cover';
  profileImg.style.width = '45px';
  profileImg.style.height = '45px';

  // <span> 요소를 생성합니다.
  const notificationDot = document.createElement('span');
  notificationDot.classList.add('notification-dot');

  // <span> 요소에 스타일을 추가합니다.
  notificationDot.style.position = 'absolute';
  notificationDot.style.top = '-1px';
  notificationDot.style.right = '-3px';
  notificationDot.style.width = '12px';
  notificationDot.style.height = '12px';
  notificationDot.style.backgroundColor = 'red';
  notificationDot.style.borderRadius = '50%';
  notificationDot.style.display = 'none';

  cartBtn.appendChild(profileImg);
  cartBtn.appendChild(notificationDot);

  const cart = document.createElement('div');
  cart.className = 'cart';

  const cartTitle = document.createElement('div');
  cartTitle.className = 'cart-title';

  const headerEmail = document.createElement('h6');
  headerEmail.id = 'headerEmail';
  headerEmail.className = 'uppercase mb-0';

  cartTitle.appendChild(headerEmail);

  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item';

  const cartName = document.createElement('div');
  cartName.className = 'cart-name clearfix';

  const userDetailLink = document.createElement('a');
  userDetailLink.href = '/frontend/assets/html/user_info.html';
  userDetailLink.textContent = 'User Detail';

  cartName.appendChild(userDetailLink);
  cartItem.appendChild(cartName);

  // 알림
  const cartItem2 = document.createElement('div');
  cartItem2.classList.add('cart-item');

  const cartName2 = document.createElement('div');
  cartName2.classList.add('cart-name', 'clearfix');

  const link2 = document.createElement('a');
  link2.href = '/frontend/assets/html/notification.html';
  link2.textContent = 'Notification';

  cartName2.appendChild(link2);
  cartItem2.appendChild(cartName2);

  const cartItem3 = document.createElement('div');
  cartItem3.classList.add('cart-item');
  cartItem3.id = 'notification-div';
  cartItem3.style.display = 'none';

  const cartName3 = document.createElement('div');
  cartName3.classList.add('cart-name', 'clearfix');

  const ul = document.createElement('ul');
  ul.id = 'notification-list';

  cartName3.appendChild(ul);
  cartItem3.appendChild(cartName3);
  notification();

  const cartTotal = document.createElement('div');
  cartTotal.className = 'cart-total';

  const profileEditLink = document.createElement('a');
  profileEditLink.className = 'button me-1';
  profileEditLink.href = '/frontend/assets/html/profile_edit.html';
  profileEditLink.textContent = 'Profile Edit';

  const logoutLink = document.createElement('a');
  logoutLink.id = 'logout';
  logoutLink.className = 'button black';
  logoutLink.href = '#';
  logoutLink.textContent = 'Logout';

  logoutLink.addEventListener('click', (event) => {
    fetch(`http://127.0.0.1:8000/user/logout/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('로그아웃 성공');
          location.reload(); // 페이지 새로고침
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });

  cartTotal.appendChild(profileEditLink);
  cartTotal.appendChild(logoutLink);

  cart.appendChild(cartTitle);
  cart.appendChild(cartItem);
  cart.appendChild(cartItem2);
  cart.appendChild(cartItem3);
  cart.appendChild(cartTotal);

  shppingCart.appendChild(cartBtn); // 수정된 부분: cartBtn을 shppingCart에 추가
  shppingCart.appendChild(cart); // 수정된 부분: cartBtn을 shppingCart에 추가

  // HeaderContent 부분 생성
  const headerContent = document.createElement('div');
  headerContent.id = 'headerContent';
  headerContent.className = 'position-relative';
  headerContent.style.width = '95vw';

  const div = document.createElement('div');
  div.className = 'position-absolute top-0 end-0 mt-3';

  const login = document.createElement('a');
  login.className = 'login';
  login.textContent = 'Login';
  login.href = '/frontend/assets/html/login.html';

  const signup = document.createElement('a');
  signup.id = 'signup';
  signup.className = 'signup ms-3';
  signup.textContent = 'Signup';
  signup.href = '/frontend/assets/html/signup.html';

  div.appendChild(login);
  div.appendChild(signup);

  const logoImg = document.createElement('img');
  logoImg.id = 'logo-img';
  logoImg.src =
    'https://lh3.googleusercontent.com/fife/AK0iWDxbxHngBdCSHcodM98IrWvs2sB0SNoKPnWIlB8_p2klpaOe4JOClHyxKz0FdA3oZQLmO-3xp9QZqEzHw4F2GXueN5LKOSz7TnAQV2JLOPirGmFyMqD22xRyRjmgyk0mbOo6sDsrhwfap8NBdjgYBbME61dK24sCmk9mF162FRzvVZtBoOJDJWxTOU14l8A3CSBqdnIEoJYyxfq11ELT2VPNe77gF474ghOEZqUfMHjcaD4KUH7U87J6Hzsq__K3hGXwX1KRmaP_nTN7w5VeYduUYE2m4AxMEfjlGJ8sfuZ7ainw9IwOeNxLp9Y2-hpZDO6E1IdyHxVrbT_GHIwNHFKeH7_fiN1vFfW3GOiRecTGtwYUReKFKU13853V_jsMI_pfZ_2DIpt8Udnef8RbR7jgnleMHHlgtCAudiVzL58XJnsF1zSZz0GL1NEgasenz91Lb43gSEraeUoEv-mJy6XM85kpTetqWUWE1eHWXCILCadsz7M6IzR95PjHvEtq1G-NLdkt_L6wWpXz4l2-vOiKRJUAFDPTlHqCUeafUwcCoSBvNuBI9C8J_CQrWe7w3fXQimfkD1sMSaOjwE7TRZ2LgFE2JWCh2fFGmPJRGzm3RWYkec5EfwcMdvL0QUoOSS1xzkWPSZ_0Rdp4E1nhX-rjA9uDmje8osTinB1jvUJNA1xYUvHG-49KiOsP0HovXFT7ghJJHHltQhjhiBkdYoRnpjFykGhWN9rEOXhEVnGLEgU--PH6Jtl72Mc06ZzJYkTLjodprLSWKKR85cMn4wD0k4nZaR95qRCSJoPne0heLEYVmMKRbzWPPG5mAUwduPvy6sVOE14P7ZbnTGCbFzoGMN3KQi1LDojKd8IPn_aPcsNm6N6rPoNPV23h4sMGtO_eSQk_QRLEUYFr6oibqfCm9t5Xsg1vd-4N7unfSHLCvBJKLE7EXQ_CDbd3ClD7l8w-jy5a7Zw9hY9PPVfSPhBAGkDBYjWKzWbB8OYj22NKnKB7C8wRf-eJg0-Wmh2dBeTiGHjl30IHgwguN7I1lCtN8tPISBESs8l8vD7UN9ji_WHlZQw6yXv1-iBnRhPKxGG-uP2057E6pdExgD5-8Jn-BCdml55jSn8CHiLfx6SHthUJygc9MwO2eynnNV5hCgcPtDSKXmsK25EgH08oSIGTTyQ3tCOQ62WPMFSMe51wMvYdfBV-RbS_LcX2rGWiMe4FUspbLsyWhPlVp5AGJUQUd3dgEtV4iZJDdDHrO06T9RI8i5AKDfDuVNPbsJOabOkwI8fZyTImB3ACHJ2poL-C6dlP9o09ZatEjtrH6pEdCnGx4-3kRt-_n5l9ZnVRaRPXeRYSJoBfLh_YRzOCcturSXE4bM3XXUnm4MzNFFbZyE3x_8f5G4tyNTeaSZfrnxRLShgzd4GBT5bUF7U9mEB0pWmOdVAxdfO9aTmbNBGimMeCGCD9e87EANnwvnNUdLknRakOdvufkVjYdw3dvaGZF4COaTVe8lV4xB3i9K2k0prF74ucUVl6_pBnqWc6mrPcRIlWA0fIuAWShJGM=w1704-h1313';
  logoImg.alt = 'logo';
  // logoImg.style.width = '80px';
  logoImg.style.height = '60px';
  logoImg.className = 'mx-auto d-block';

  logoImg.addEventListener('click', () => {
    window.location.href = '/frontend/index.html';
  });

  headerContent.appendChild(logoImg);
  headerContent.appendChild(shppingCart); // 수정된 부분: shppingCart를 headerContent에 추가
  headerContent.appendChild(div);

  // 모든 요소를 조립
  navContent.appendChild(headerContent); // 수정된 부분: headerContent를 navContent에 추가

  nav.appendChild(navContent);
  header.appendChild(nav);

  // main-container에 header를 추가
  mainContainer.insertBefore(header, mainContainer.firstChild);

  // 쿠키 문자열 가져오기
  const cookiesString = document.cookie;

  // 쿠키 문자열을 파싱하여 객체로 변환
  const cookiesArray = cookiesString.split('; ');
  const cookies = {};

  cookiesArray.forEach((cookie) => {
    const [name, value] = cookie.split('=');
    cookies[name] = value;
  });

  // login_check 쿠키 값 가져오기
  const loginCheckCookieValue = cookies['login_check'];

  // login_check 쿠키 값이 'True'인지 'False'인지 확인
  if (loginCheckCookieValue === 'True') {
    // 로그인 상태
    profileImg.style.display = 'block';
    login.style.display = 'none';
    signup.style.display = 'none';
  } else {
    // 로그아웃 상태
    profileImg.style.display = 'none';
    login.style.display = 'inline-block';
    signup.style.display = 'inline-block';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  let path = window.location.pathname;
  let page = path.split('/').pop();
  if (
    !(
      page === '' ||
      page === 'index.html' ||
      page === 'index.html#' ||
      page === undefined ||
      page === null
    )
  ) {
    fetch(`http://127.0.0.1:8000/user/me/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const requestUser = data.results.User.email;
        const requestUserPk = data.results.User.id;
        const followingList = data.results.User.following_list;
        const requestUserProfileImg = data.results.User.profile_img;

        if (requestUser) {
          const email = document.querySelector('#headerEmail');
          email.textContent = requestUser;
          const profileImg = document.querySelector('.profileImg');
          if (requestUserProfileImg) {
            profileImg.src = requestUserProfileImg;
            profileImg.style.borderRadius = '50%';
          }
        }
      });
  }
});
