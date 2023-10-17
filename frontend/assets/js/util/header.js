import { notification } from '../websocket.js';
import { createFollower } from '../follower.js';
import { createFollowing } from '../following.js';
import { createUserLikedBoard } from '../userLikedBoard.js';
import { createUserTaggedBoard } from '../userTaggedBoard.js';
import { createPinList } from '../pinList.js';
import { createUserInfo } from '../userInfo.js';
import { customFetch } from './customFetch.js';

let loginCheckCookieValue;

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
    'https://favspot-fin.s3.amazonaws.com/images/default/default_user_clear.png';
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
    'https://favspot-fin.s3.amazonaws.com/images/default/header_logo.png';
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
  loginCheckCookieValue = cookies['login_check'];

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

  if (page === 'login.html' && loginCheckCookieValue === 'True' || page === 'signup.html' && loginCheckCookieValue === 'True') {
    // 이미 로그인된 유저가 로그인 또는 회원가입 페이지에 접근하려 할 경우 메인 페이지로 리다이렉트
    window.location.href = '/frontend/index.html';
    return;
  }

  if (page === 'login.html' || (loginCheckCookieValue === 'False' && page === 'board_detail.html') || page === 'signup.html') {
    return;
  }

  if (
    !(
      page === '' ||
      page === 'index.html' ||
      page === 'index.html#' ||
      page === undefined ||
      page === null
    )
  ) {
    customFetch(`http://127.0.0.1:8000/user/me/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => {
        const requestUser = data.results.User.email;
        const requestUserPk = data.results.User.id;
        const followingList = data.results.User.following_list;
        const requestUserProfileImg = data.results.User.profile_img;

        if (requestUser) {
          const email = document.querySelector('#headerEmail');
          email.textContent = requestUser;
          if (requestUserProfileImg) {
            const profileImg = document.querySelector('.profileImg');
            profileImg.src = requestUserProfileImg;
            profileImg.style.borderRadius = '50%';
          }
        }
        const logout = document.querySelector('#logout');
        logout.addEventListener('click', (event) => {
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

        // 가져온 사용자 데이터를 사이드바에 채워줍니다.
        const currentPathname = window.location.pathname;
        if (
          currentPathname == '/frontend/assets/html/notification.html#' ||
          currentPathname == '/frontend/assets/html/notification.html'
        ) {
          const email = document.querySelector('#email');
          email.textContent = data['results']['User']['email'];
          const nickname = document.querySelector('#nickname');

          if (data['results']['User']['nickname']) {
            nickname.textContent = data['results']['User']['nickname'];
          } else {
            nickname.textContent = 'None';
          }
          const profileImg = document.getElementById('profileImg');
          if (requestUserProfileImg) {
            profileImg.src = requestUserProfileImg;
          }
          let followers = document.querySelector('.followers');
          followers.textContent = data['results']['User']['followers'];
          followers = document.querySelector('#followers');
          followers.addEventListener('click', (event) => {
            console.log('click');
            window.location.href = `follower.html`;
          });
          let following = document.querySelector('.following');
          following.textContent = data['results']['User']['following'];
          following = document.querySelector('#following');
          following.addEventListener('click', (event) => {
            window.location.href = `following.html`;
          });
        } else if (
          currentPathname == '/frontend/assets/html/profile_edit.html#' ||
          currentPathname == '/frontend/assets/html/profile_edit.html'
        ) {
          // 가져온 사용자 데이터를 폼 필드에 채워줍니다.
          const nickname = (document.querySelector('#nickname').value =
            data['results']['User']['nickname']);
          const imagePreview = document.getElementById('imagePreview');
          if (profileImg) {
            imagePreview.src = requestUserProfileImg;
          }
        } else if (
          currentPathname.startsWith('/frontend/assets/html/follower.html#') ||
          currentPathname.startsWith('/frontend/assets/html/follower.html')
        ) {
          createFollower(requestUserPk, followingList);
        } else if (
          currentPathname.startsWith('/frontend/assets/html/following.html#') ||
          currentPathname.startsWith('/frontend/assets/html/following.html')
        ) {
          createFollowing(requestUserPk, followingList);
        } else if (
          currentPathname.startsWith(
            '/frontend/assets/html/user_liked_board.html#'
          ) ||
          currentPathname.startsWith(
            '/frontend/assets/html/user_liked_board.html'
          )
        ) {
          createUserLikedBoard(requestUser, requestUserPk, followingList);
        } else if (
          currentPathname.startsWith(
            '/frontend/assets/html/user_tagged_board.html#'
          ) ||
          currentPathname.startsWith(
            '/frontend/assets/html/user_tagged_board.html'
          )
        ) {
          createUserTaggedBoard(requestUser, requestUserPk, followingList);
        } else if (
          currentPathname == '/frontend/assets/html/pin_list.html#' ||
          currentPathname == '/frontend/assets/html/pin_list.html'
        ) {
          createPinList(data);
        } else if (
          currentPathname.startsWith('/frontend/assets/html/user_info.html#') ||
          currentPathname.startsWith('/frontend/assets/html/user_info.html')
        ) {
          createUserInfo(requestUser, requestUserPk, followingList);
        }
        notification(requestUserPk);
      })
      .catch((error) => {
        console.error('Failed to retrieve user data.', error);
      });
  }
});
