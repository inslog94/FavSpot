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
    img.style = 'width: 100%; height: 100%; border-radius: 2px;';
    img.src =
      'https://favspot-fin.s3.amazonaws.com/images/default/main_logo.png';
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
      img.style = 'width: 100%; height: 100%; border-radius: 2px;';
      img.alt = 'place image';
      if (imageSrc) {
        img.src = imageSrc;
      } else {
        img.src =
          'https://favspot-fin.s3.amazonaws.com/images/default/main_logo.png';
      }

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

  // 본인의 비공개 보드 표기
  const entryLock = document.createElement('span');
  if (board.is_public === false) {
    const lock = document.createElement('i');
    lock.className = 'fa fa-solid fa-lock mr-10';
    lock.style.color = '#bf6447';
    lock.style.fontSize = '18px';
    entryLock.appendChild(lock);
    entryTitle.appendChild(entryLock);
  }
  
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
