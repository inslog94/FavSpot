// 함수로 동적 생성
export function createBlogEntry(board) {
  const masonryItem = document.createElement('div');
  masonryItem.classList.add('masonry-item');

  const blogEntry = document.createElement('div');
  blogEntry.classList.add('blog-entry', 'mb-10');

  // Swiper 컨테이너를 포함하는 div를 생성합니다.
  const entryImage = document.createElement('div');
  entryImage.classList.add('entry-image', 'clearfix');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper-container');

  // Swiper 슬라이드들을 감싸는 div를 생성합니다.
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  // console.log(board);
  if (!board) {
    return;
  } else if (board.thumbnail_imgs.length === 0) {
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');

    const img = new Image(); // 이미지 엘리먼트 생성
    img.classList.add('img-fluid');
    // img.style.maxWidth = '100%'; // 이미지가 슬라이드를 넘어가지 않도록 설정
    img.style = 'width: 250px; height: 250px; border: 3px solid #fffafa';
    img.src =
      'https://lh3.googleusercontent.com/fife/AK0iWDx0p4nETcnM0nMNtW9fi6AUwPALLdgqBm2D0x9zPLWmLgM-FUPjr0CzmBfvCxqp3S9Ex36qBsaGVZrJynLnkvvAZZOQwv7KzECA2805RQQ_Hyv4jtvEVeF10FjP_IZwgjA2T_PfjwOLiQ0xOgJDc4LPV-bvmy605sBMrcJ6DZzf_u6ENIWKrNYbhwn9K6PQGC79FFnT610_xvrhHh52ATN4YzHLN3Jxrb7n9a5TuMccg1I4M4YueJDYUjXfLsGgoQV4MZqOE9O3xlCoyV-GfLpN66CQ0VYvJNvj51jz_E_ff3MdC_L7xvfsifpYykGGHZaW4tvtRqnFjlENY5h8qawRHzD5hwsgGPnnMnG349BT1MGsZ72kRiSxYAVZYgXK5T2V9aBUgRzFFE_UhXgoGDYbi_JH8ZRgSHXpdTxCqBdh5pXUYGWNEC3xOgQaIAKtPGEIDg676smAuLNDDyy31JS8g9n1VmPOvQSHa_0HBYvOWM36Siy44BmLBw4VtqAn8nphLcaoiYyP6ZzhiWVYEWWoN72lU_tBna83s9D-DywgCrDiin8-fWP9ICPGTl98nkYkONov6ETz3vo-waaN8Rb5w_lkhNip1AHdGtp-WrasQtApsGiDlznAhbacvR-9J4k-A0UkYPO_LkXPqYt5TyMfn0QFLtbY1sVijHK0up1WP0QUq-sQDNIBk4CSzftOtReifsWT6Cw2SFUWvvpAjh3r297lisXaeCPuOchGofKtz_ltrHGB2ySflFahNUKzAs_-06PFN1mf72_1D_GVud065_JThk4V1dxhvdva-h1gQuTD-kSHEt7RtsQlzCvGKdWIwMXx9mLyR0LRZWWipDkf9xLB6IxoZ8o28uUBu9vEPgrZxZmh3YmINGJCtJj2_mqCP9Zx4JFA22vhGDLIcAO-R462ILcL2LcG7vaiVUIvyXgdBzcocwnxHoYz1wWwlFMw6d5ig0cekNGtRbKYYf3S4qfdcDpCzZBRriU1FSNbQ3yTbqlY8U6I-WLbkMzISUNjmLbguV25bIk_w7Y94mEPdVbiZx5mhE5sjyjRs-5hPEw50FoYle5dSd6qQjdjKALgFo8y-GdEhqeHTU1OU6lyz5fk3qf0VDAgWRTNGOXYCUR_9RUdwHbqX0JWRbcfRb5DEhkb7G6cCA5pN0xlDcfMqGb081yrnriFLFuOfefEZs_3iTO3Hx7eN9LFUJ0I8K_K0r6R7efchmd8-BBk19aTnBFFInQVzHbYuq3igYEduCv5yNqUCtJpUYM6W6dFqROcSsgl4zSbPNoEhPwjX1CnnA9C1K6TuCD7hX1lsPWvFyDyvSZ8-7qx6L5osA2jkAVJsDoriHq75bLDXoD2N6WfMwd2eSZWN3Ti2YvAo57uHxTrMmgF7NYYX3Qk-NvYJFqFPUKQqt2LprUXYiPtq9k3158We1tc-lUsL05NoDodK0XrcdrTu-Wp-b0cXmTw8krbCKQqIfbv95mHRM8gTQ-tphJF3lLhiSu0RZnRfLwT3Jgijd9lTf7oZkOsswBgI-Rr2HDohAxltitqcs15=w1704-h1313';
    img.alt = '';

    swiperSlide.appendChild(img);
    swiperWrapper.appendChild(swiperSlide);
  } else {
    // 이미지 슬라이드를 위한 반복문
    board.thumbnail_imgs.forEach((imageSrc) => {
      const swiperSlide = document.createElement('div');
      swiperSlide.classList.add('swiper-slide');

      const img = new Image(); // 이미지 엘리먼트 생성
      img.classList.add('img-fluid');
      // img.style.maxWidth = '100%'; // 이미지가 슬라이드를 넘어가지 않도록 설정
      img.style = 'width: 250px; height: 250px; border: 3px solid #fffafa';
      img.src = imageSrc;
      img.alt = '';

      swiperSlide.appendChild(img);
      swiperWrapper.appendChild(swiperSlide);
    });
  }

  swiperContainer.appendChild(swiperWrapper);
  entryImage.appendChild(swiperContainer);
  blogEntry.appendChild(entryImage);

  // Swiper 초기화
  initializeSwiper(swiperContainer); // Swiper 초기화 함수 호출

  const blogDetail = document.createElement('div');
  blogDetail.classList.add('blog-detail');

  const entryTitle = document.createElement('div');
  entryTitle.classList.add('entry-title', 'mb-1');
  const titleLink = document.createElement('a');
  titleLink.setAttribute('href', '#');
  titleLink.textContent = board.title;
  entryTitle.appendChild(titleLink);
  blogDetail.appendChild(entryTitle);

  const entryMeta = document.createElement('div');
  entryMeta.classList.add('entry-meta', 'mb-10');
  const ul = document.createElement('ul');
  const li = document.createElement('li');
  const hashTag = document.createElement('i');
  hashTag.className = 'fa fa-solid fa-hashtag';
  li.appendChild(hashTag);
  const item = document.createElement('span');
  if (board.tags.length === 0) {
    item.textContent = 'None';
  } else {
    item.textContent = board.tags.slice(0, 2).join(', ');
  }
  li.appendChild(item);

  const li2 = document.createElement('li');
  const pins = document.createElement('i');
  pins.className = 'fa fa-solid fa-map-marker';
  li2.appendChild(pins);
  const item2 = document.createElement('span');
  item2.textContent = board.pins.length;
  li2.appendChild(item2);

  const li3 = document.createElement('li');
  const star = document.createElement('i');
  star.className = 'fa fa-solid fa-star';
  li3.appendChild(star);
  const item3 = document.createElement('span');
  item3.textContent = board.likes;
  li3.appendChild(item3);

  ul.appendChild(li);
  ul.appendChild(li2);
  ul.appendChild(li3);
  entryMeta.appendChild(ul);
  blogDetail.appendChild(entryMeta);

  const entryShare = document.createElement('div');
  entryShare.classList.add('entry-share', 'clearfix', 'mt-0');
  const entryButton = document.createElement('div');
  entryButton.classList.add('entry-button');
  const readMoreLink = document.createElement('a');
  readMoreLink.classList.add('button', 'arrow');
  readMoreLink.id = board.id;
  readMoreLink.setAttribute('href', '#');
  readMoreLink.textContent = 'Board Detail';

  readMoreLink.addEventListener('click', (event) => {
    localStorage.setItem('selectedPk', board.id);
    window.location.href = '/frontend/assets/html/board_detail.html';
  });

  const arrowIcon = document.createElement('i');
  arrowIcon.classList.add('fa', 'fa-angle-right');
  readMoreLink.appendChild(arrowIcon);
  entryButton.appendChild(readMoreLink);
  entryShare.appendChild(entryButton);
  blogDetail.appendChild(entryShare);

  blogEntry.appendChild(blogDetail);
  masonryItem.appendChild(blogEntry);

  return masonryItem;
}

// Swiper 초기화 함수
function initializeSwiper(container) {
  new Swiper(container, {
    loop: true,
    autoplay: {
      delay: 3000, // 각 슬라이드 간의 자동 슬라이딩 간격 (3초)
    },
    pagination: {
      el: '.swiper-pagination',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}
