export function createFollowing(requestUserPk, followingList) {
  const params = new URLSearchParams(window.location.search);
  let pk = params.get('pk');
  if (!pk) {
    pk = 'me';
  }

  fetch(`http://127.0.0.1:8000/user/${pk}/`, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      // 가져온 사용자 데이터를 폼 필드에 채워줍니다.
      const email = document.querySelector('#email');
      email.textContent = data['results']['User']['email'];
      const nickname = document.querySelector('#nickname');

      if (data['results']['User']['nickname']) {
        nickname.textContent = data['results']['User']['nickname'];
      } else {
        nickname.textContent = 'None';
      }
      const img = data['results']['User']['profile_img'];
      const profileImg = document.getElementById('profileImg');
      if (img) {
        profileImg.src = img;
      }
      let followers = document.querySelector('.followers');
      followers.textContent = data['results']['User']['followers'];
      followers = document.querySelector('#followers');
      followers.addEventListener('click', (event) => {
        window.location.href = `follower.html?pk=${pk}`;
      });

      let following = document.querySelector('.following');
      following.textContent = data['results']['User']['following'];
      following = document.querySelector('#following');
      following.addEventListener('click', (event) => {
        window.location.href = `following.html?pk=${pk}`;
      });

      const button = document.createElement('a');
      button.type = 'button';
      button.classList.add('btn', 'mt-1');
      button.style.display = 'block';

      // 기존 요소에 버튼 추가
      const changeBtnDiv = document.querySelector('.changeBtn');

      if ((requestUserPk === parseInt(pk)) | (pk == 'me')) {
        button.textContent = 'User Info';
        button.classList.add('user-info-btn'); 
        button.setAttribute('href', 'user_info.html');
      } else if (followingList.includes(data['results']['User']['email'])) {
        button.textContent = 'Unfollow';
        button.classList.add('btn-primary');
        button.addEventListener('click', () => {
          fetch(`http://127.0.0.1:8000/user/follow/${pk}/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {
              if (response.status === 204) {
                location.reload(); // 페이지 새로고침
              } else {
                return response.json();
              }
            })
            .catch((error) => console.error('Error:', error));
        });
      } else {
        button.textContent = 'Follow';
        button.addEventListener('click', () => {
          fetch(`http://127.0.0.1:8000/user/follow/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: pk }),
          })
            .then((response) => {
              if (response.status === 201) {
                location.reload(); // 페이지 새로고침
              } else {
                return response.json();
              }
            })
            .catch((error) => console.error('Error:', error));
        });
      }
      changeBtnDiv.appendChild(button);
    })
    .catch((error) => {
      console.error('Failed to retrieve user data.', error);
    });

  const url =
    pk === 'me'
      ? `http://127.0.0.1:8000/user/following/`
      : `http://127.0.0.1:8000/user/${pk}/following/`;
  // 팔로워 목록
  fetch(url, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      // 가져온 사용자 데이터를 폼 필드에 채워줍니다.
      // 사용 예시
      const tbody = document.querySelector('#followList');
      const followers = data['Following List'];
      followers.forEach((data) => {
        const newTableRow = createTableRow(pk, data);
        tbody.appendChild(newTableRow);
      });
    })
    .catch((error) => {
      console.error('Failed to retrieve user data.', error);
    });

  function createTableRow(pk, data) {
    const currentUser = data['following_user'];
    const following = data['followed_user_info'];
    const followingPk = data['followed_user'];
    const tableRow = document.createElement('tr');

    // 이미지 셀 생성
    const imageCell = document.createElement('td');
    imageCell.classList.add('image', 'pt-10', 'pb-10');

    const profileImg = document.createElement('img');
    profileImg.classList.add('img-fluid');
    profileImg.style.width = '75px';
    profileImg.style.height = '75px';
    profileImg.style.borderRadius = '50%';
    if (following.profile_img) {
      profileImg.src = following.profile_img;
    } else {
      profileImg.src =
        'https://favspot-fin.s3.amazonaws.com/images/default/default_user_clear.png';
    }
    profileImg.alt = '';

    imageCell.appendChild(profileImg);
    tableRow.appendChild(imageCell);

    // 이메일 셀 생성
    const emailCell = document.createElement('td');
    emailCell.id = 'email';
    emailCell.classList.add('description', 'pt-10', 'pb-10');
    const emailLink = document.createElement('a');
    emailLink.href = '#';
    emailLink.textContent = following.email;
    emailCell.appendChild(emailLink);
    tableRow.appendChild(emailCell);

    emailLink.addEventListener('click', (event) => {
      window.location.href = `user_info.html?pk=${followingPk}`;
    });
    // 닉네임 셀 생성
    const nicknameCell = document.createElement('td');
    nicknameCell.id = 'nickname';
    nicknameCell.classList.add('description', 'pt-10', 'pb-10');
    const nicknameLink = document.createElement('a');
    nicknameLink.href = '#';
    if (following.nickname) {
      nicknameLink.textContent = following.nickname;
    } else {
      nicknameLink.textContent = 'None';
    }
    nicknameCell.appendChild(nicknameLink);
    tableRow.appendChild(nicknameCell);

    // 언팔로우 버튼 셀 생성
    if (requestUserPk === currentUser) {
      const unfollowTh = document.querySelector('.Unfollow');
      if (!unfollowTh) {
        const followTr = document.getElementById('followTr');
        const thElement = document.createElement('th');
        thElement.className = 'Unfollow';
        thElement.textContent = 'Unfollow';
        followTr.appendChild(thElement);
      }

      const unfollowCell = document.createElement('td');
      unfollowCell.classList.add('td-quantity', 'pt-10', 'pb-10');
      const unfollowLink = document.createElement('a');
      unfollowLink.id = 'unfollow';
      unfollowLink.classList.add('button');
      unfollowLink.href = '#';

      unfollowLink.textContent = 'Unfollow';
      unfollowLink.addEventListener('click', () => {
        fetch(`http://127.0.0.1:8000/user/follow/${followingPk}/`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (response.status === 204) {
              location.reload(); // 페이지 새로고침
            } else {
              return response.json();
            }
          })
          .catch((error) => console.error('Error:', error));
      });

      unfollowCell.appendChild(unfollowLink);
      tableRow.appendChild(unfollowCell);
    }
    return tableRow;
  }
}
