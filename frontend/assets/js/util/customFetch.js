export async function customFetch(url, options) {
  const response = await fetch(url, options);

  if (response.status === 401) {
    alert('원활한 서비스 이용을 위해 로그인이 필요합니다.');
    window.location.href = '/frontend/assets/html/login.html';
  } else if (!response.ok) { 
    throw new Error(`HTTP error! status: ${response.status}`);
  } else { 
    return await response.json();
  }
}