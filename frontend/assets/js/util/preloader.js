export function createPreloader() {
  // 새로운 div 엘리먼트를 생성합니다.
  const preLoaderDiv = document.createElement('div');
  preLoaderDiv.id = 'pre-loader';

  // 이미지 엘리먼트를 생성합니다.
  const imageElement = document.createElement('img');
  imageElement.classList.add('img-fluid', 'd-block', 'mx-auto');
  imageElement.src = '/frontend/assets/img/pre-loader/loader-03.svg';
  imageElement.alt = '';

  // 이미지 엘리먼트를 div 엘리먼트의 자식으로 추가합니다.
  preLoaderDiv.appendChild(imageElement);

  // 생성한 pre-loader div를 원하는 위치에 추가합니다.
  // 예를 들어, body 요소의 맨 앞에 추가하려면 다음과 같이 할 수 있습니다.
  document.body.insertBefore(preLoaderDiv, document.body.firstChild);
}
