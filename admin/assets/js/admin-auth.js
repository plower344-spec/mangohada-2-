const ADMIN_SESSION_KEY = 'mangohada_admin';

const ADMIN_CREDENTIALS = {
  email: 'admin@mangohada.com',
  password: 'admin1234',
  name: '관리자',
};

function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY));
  } catch {
    return null;
  }
}

function adminLogin(email, password) {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ email, name: ADMIN_CREDENTIALS.name }));
    window.location.href = 'index.html';
  } else {
    alert('이메일 또는 비밀번호가 올바르지 않습니다.');
  }
}

function adminLogout() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.location.href = 'login.html';
}

function requireAdminAuth() {
  if (!getAdminUser()) {
    window.location.href = 'login.html';
  }
}
