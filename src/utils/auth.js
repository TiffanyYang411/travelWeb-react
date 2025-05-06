// utils/auth.js
export function login(inputEmail) {
    const userName = inputEmail.includes('@')
      ? inputEmail.split('@')[0] // ✅ 若為 email，顯示 @ 前
      : inputEmail;              // ✅ 否則直接使用輸入名稱
  
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', inputEmail); // ✅ 儲存完整 email 或帳號
    return userName;
  }
  
  export function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  }
  
  export function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
  
  export function getUserName() {
    return localStorage.getItem('userName') || '';
  }
  
  
  