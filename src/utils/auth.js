// utils/// 登入：設定使用者資訊
export function login(inputEmail) {
  const userName = inputEmail.includes('@')
    ? inputEmail.split('@')[0] // 若為 email，使用 @ 前文字
    : inputEmail;

  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userName', userName);
  localStorage.setItem('userEmail', inputEmail);
  localStorage.setItem('currentUser', userName); // ✅ 關鍵補充：設定目前使用者 ID

  return userName;
}

// 登出：清除所有使用者資訊
export function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('currentUser'); // ✅ 清除 currentUser
}

// 判斷是否已登入
export function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

// 取得使用者名稱
export function getUserName() {
  return localStorage.getItem('userName') || '';
}

  
  
  