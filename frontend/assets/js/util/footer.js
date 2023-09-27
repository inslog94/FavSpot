export function createFooter() {
  // 기존 main-container 요소 가져오기
  const mainContainer = document.getElementById('main-container');

  // Footer 요소 생성
  const footer = document.createElement('footer');
  footer.className = 'footer footer-topbar';

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
    'https://lh3.googleusercontent.com/fife/AK0iWDx4iKNlowgdmDPw0RWQTNWrW7iYhUnZEbbSU0WaVtIBuDsQNsUM8hbbOffGldXgv6yu2DiJ2bajGY557K8ARgFNCpRI7bv1is3aC-6k-wdF-Uh-WekoU_9lNieYsS5cAb5c4GXPxvZqYkT7H80PWSWXlmhAq1VJNmZtut71KXHbqUMCyM1m_I_6bxkieq3W2EcyeyMA0Evc0Sszcuir2DGTkq51EuCFRQil9f6KFRYZB4_wEdQO3lIlks-B0cr2nsnYoTUAo0Cw7Iz55Rtxz3-FFS2trSmZly7TYgCS_4Vb4rd96nQ2iRj1vszHq5amZConK3184IXEXlAypvOjcC7M93AEA_Vy_zXmnBgvJZevck5iA8O1QKNpTVUvqT8m4II815h9v7dPL_4yjFlLSySZAxe4MRiB5WtPB6h2VFi_k0phgC2OzLphrIhIT-KcFRYFV2TBAmsQFEc5xMBD_48UVhSAUIKeB3OSMqMw1A01D7Vbf3kqeZsC6Idu6nRRka8Gly5Vx37KzmOs0SwxHNfEUNVu-MxyzuVrxkNbzJ3DmBs8AyXRLP0AzheUg3NAjp2Bg1FnhqKd8ajiGMlz3L_ERVgJUKnh-SHmv3RfUjxmCqSve9HXlp2V-boJTvn8-PXpNiiIoM12QqSqJlVJExoRvmpxaWZvlUwtvmnlH_zEAzNTlvYGwaBs6SqJkhKL9STQlD7T3H-tBo0qJRj0HgbCosBV1Z3AOdNuD2U6YNGdkRLqCvBbUgb6ImEyoYJAuJ9bS7I2uGHtOUBjuZTf5dLwCACaeA9s__VucnnMN_UXR006nQBNBoEd39rApGFVXHzWGDcr8Ua1ufcDSX27mEAH_zkD0J937fflX6v2x9X3qUfRFNkR07jdF5hs6o_6TQ3CyTDDSq139ewhlc6ep54PJlguqw7pxuSvkTMJDhg_OZTkOi8pjDFwJZqOsAG7LDY7MqSjIy_bYYIs5RUYL6TvtrqHeZhIRikjE2YUZc0uwJeJyNQJ1gRtoPhIyoinhqBsDJcs5hox4W16P-rvnJHuNMM_F3q0DkcFrQCxn7Th97jSeVV2cNjbYxLu9nk7li-0R4wHwur1v9d-3v3cmHfZkiSshUKIcSe-SnLshVM5c0E8e62ygd2S2Aq6bRrBwJ47LGsG6abqjd5wKjQk5bBdZDc6PA3uhtv9ZiVWEqraMQ8ETfZWBqnhaI9ufGDg6h-aSXx2-jzhBGi8SQPCbfR1Znm1Fa2Dox-vKIpn_59ZFx9W12h1sKc2YBIbcBjv-Wp-m7DyH7NsvoG8bf_ab1VWRDmhmBwmrJqaAqY5QHIsRobwuQCi7X95NLzjnCAhBaJMz4vbKFTMHMw9_HhGTuOM_fQbeAvI1reTYUvkwivyPO60aOCsHvM_O6kPNviM4lEwpqQotHeMxoG6ZpY9aduRpv4e3ZU7B2kpFSKdwas2Qsz65S4pEulXJWVfDrTuKHMe7e2ocRcU8Hk_65tMp8X3tJPCTUaD7AsyJWFRQSkri5b3Wk8rtqhK8bZD1k7-hamcHMvYHBQapuAFPLaE=w1704-h1313';
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
