export function createFooter() {
  // 기존 main-container 요소 가져오기
  const mainContainer = document.getElementById('main-container');

  // Footer 요소 생성
  const footer = document.createElement('footer');

  const currentPathname = window.location.pathname;
  if (
    currentPathname == '/frontend/index.html' ||
    currentPathname == '/frontend/'
  ) {
    footer.className = 'footer footer-topbar';
  } else {
    footer.className = 'footer footer-topbar fixed-bottom';
  }

  // Copyright 부분 생성
  const copyrightDiv = document.createElement('div');
  copyrightDiv.className = 'copyright pt-10 pb-0 col-12';
  copyrightDiv.style.backgroundColor = 'beige';

  const containerDiv = document.createElement('div');
  containerDiv.className = 'container m-0';

  const rowDiv = document.createElement('div');
  rowDiv.className = 'row d-flex justify-content-between';
  rowDiv.style.width = '99vw';

  // 왼쪽 푸터 생성
  const leftFooterDiv = document.createElement('div');
  leftFooterDiv.className = 'left-footer ml-10 col-lg-6';
  leftFooterDiv.style.width = '470px';

  const logoImg = document.createElement('img');
  logoImg.className = 'img-fluid mb-10 ml-20';
  logoImg.style.height = '50px';
  logoImg.src =
    'https://favspot-fin.s3.amazonaws.com/images/default/footer_logo.png';
  logoImg.alt = '';

  const copyrightTextDiv = document.createElement('div');
  copyrightTextDiv.style.color = '#555';

  const copyrightParagraph = document.createElement('p');
  copyrightParagraph.className = 'ml-20';
  copyrightParagraph.innerHTML =
    '&copy;Copyright <span id="copyright"></span> by <a href="#" style="color: #ff5757"> FavSpot. </a> Making Every Destination Yours.';

  copyrightTextDiv.appendChild(copyrightParagraph);
  leftFooterDiv.appendChild(logoImg);
  leftFooterDiv.appendChild(copyrightTextDiv);

  // 오른쪽 푸터 생성
  const rightFooterDiv = document.createElement('div');
  rightFooterDiv.className = 'right-footer col-lg-6 mt-2';
  rightFooterDiv.style.width = '400px';

  const footerSocialParagraph = document.createElement('p');
  footerSocialParagraph.className = 'text-start text-lg-end mr-20';
  footerSocialParagraph.innerHTML =
    'Leave Your Mark with <a href="#" style="color: #ff5757">FavSpot</a>, Everywhere You Go';

  const socialIconsDiv = document.createElement('div');
  socialIconsDiv.className =
    'social-icons color-hover text-start text-lg-end mt-20';

  const ulList = document.createElement('ul');
  ulList.className = 'clearfix';

  const githubListItem = document.createElement('li');
  githubListItem.className = 'social-github';

  const githubLink = document.createElement('a');
  githubLink.className = 'mr-20';
  githubLink.href = 'https://github.com/inslog94/FavSpot';
  githubLink.target = '_blank';

  const githubIcon = document.createElement('i');
  githubIcon.className = 'fa fa-github';

  githubLink.appendChild(githubIcon);
  githubListItem.appendChild(githubLink);
  ulList.appendChild(githubListItem);
  socialIconsDiv.appendChild(ulList);

  rightFooterDiv.appendChild(footerSocialParagraph);
  rightFooterDiv.appendChild(socialIconsDiv);

  rowDiv.appendChild(leftFooterDiv);
  rowDiv.appendChild(rightFooterDiv);
  containerDiv.appendChild(rowDiv);
  copyrightDiv.appendChild(containerDiv);
  footer.appendChild(copyrightDiv);

  // Footer를 main-container에 추가
  mainContainer.appendChild(footer);

  // Copyright 연도 업데이트
  const currentYear = new Date().getFullYear();
  document.getElementById('copyright').textContent = currentYear;
}
