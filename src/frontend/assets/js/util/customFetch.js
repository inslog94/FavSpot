export async function customFetch(url, options) {
  const response = await fetch(url, options);
  const currentPathname = window.location.pathname;

  if (
    !(
      currentPathname == '/assets/html/board_detail.html#' ||
      currentPathname == '/assets/html/board_detail.html'
    ) &&
    (response.status === 401 || response.status === 403)
  ) {
    alert('원활한 서비스 이용을 위해 로그인이 필요합니다.');
    window.location.href = '/assets/html/login.html';
  } else if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    return await response.json();
  }
}
