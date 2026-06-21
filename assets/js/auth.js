// ============================================
// mangohada — 소셜 로그인(Google/Kakao) + 이메일 회원가입
//
// ⚠️ 이 파일은 백엔드 없이 동작하는 "프론트엔드 데모" 구현입니다.
//    - 구글/카카오 로그인은 각 사 SDK를 통해 실제로 동작하지만,
//      받아온 사용자 정보(이름/이메일/프로필사진)를 브라우저 localStorage에만 저장합니다.
//    - 이메일 회원가입/로그인은 서버/DB가 없어 localStorage를 "가짜 DB"로 사용합니다.
//      실서비스에서는 반드시 백엔드(Supabase Auth, Firebase Auth 등)에서
//      비밀번호 해시 저장 및 토큰 검증을 처리해야 합니다.
// ============================================

const AUTH_CONFIG = {
  // Google Cloud Console > API 및 서비스 > 사용자 인증 정보 > OAuth 클라이언트 ID(웹 애플리케이션)
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  // Kakao Developers > 내 애플리케이션 > 앱 키 > JavaScript 키
  KAKAO_JS_KEY: 'YOUR_KAKAO_JAVASCRIPT_KEY',
};

const USERS_DB_KEY = 'mangohada_users_demo_db'; // 이메일 회원가입용 로컬 더미 DB

// ---------- 공통 ----------
function saveSession(user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  window.location.href = 'index.html';
}

// ---------- 구글 로그인 (Google Identity Services) ----------
function initGoogleLogin() {
  if (!window.google || !google.accounts) {
    console.warn('[mangohada] Google Identity Services 스크립트가 로드되지 않았습니다.');
    return;
  }
  if (AUTH_CONFIG.GOOGLE_CLIENT_ID.startsWith('YOUR_')) {
    document.getElementById('googleLoginBtn')?.insertAdjacentHTML(
      'afterbegin',
      '<p class="text-[11px] text-red-500 mb-2">⚠️ assets/js/auth.js에 GOOGLE_CLIENT_ID를 설정해 주세요.</p>'
    );
  }

  google.accounts.id.initialize({
    client_id: AUTH_CONFIG.GOOGLE_CLIENT_ID,
    callback: handleGoogleCredentialResponse,
  });

  google.accounts.id.renderButton(document.getElementById('googleLoginBtn'), {
    theme: 'outline',
    size: 'large',
    width: 320,
    text: 'continue_with',
    locale: 'ko',
  });
}

function handleGoogleCredentialResponse(response) {
  // response.credential은 JWT 형식 — payload(가운데 부분)를 디코딩해 사용자 정보를 꺼낸다.
  const base64Payload = response.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(decodeURIComponent(escape(atob(base64Payload))));

  saveSession({
    provider: 'google',
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  });
}

// ---------- 카카오 로그인 (Kakao JavaScript SDK) ----------
function initKakaoLogin() {
  if (!window.Kakao) {
    console.warn('[mangohada] Kakao SDK 스크립트가 로드되지 않았습니다.');
    return;
  }
  if (!Kakao.isInitialized()) {
    Kakao.init(AUTH_CONFIG.KAKAO_JS_KEY);
  }
}

function loginWithKakao() {
  if (AUTH_CONFIG.KAKAO_JS_KEY.startsWith('YOUR_')) {
    alert('assets/js/auth.js에 KAKAO_JS_KEY를 설정해 주세요. (Kakao Developers > 앱 키 > JavaScript 키)');
    return;
  }
  if (!window.Kakao || !Kakao.isInitialized()) {
    alert('카카오 SDK가 초기화되지 않았습니다.');
    return;
  }

  Kakao.Auth.login({
    scope: 'profile_nickname, profile_image, account_email',
    success: function () {
      Kakao.API.request({
        url: '/v2/user/me',
        success: function (res) {
          const kakaoAccount = res.kakao_account || {};
          const profile = kakaoAccount.profile || {};
          saveSession({
            provider: 'kakao',
            email: kakaoAccount.email || '',
            name: profile.nickname || '카카오 사용자',
            picture: profile.profile_image_url || '',
          });
        },
        fail: function (error) {
          console.error(error);
          alert('카카오 사용자 정보를 가져오지 못했습니다.');
        },
      });
    },
    fail: function (error) {
      console.error(error);
      alert('카카오 로그인에 실패했습니다.');
    },
  });
}

// ---------- 이메일 회원가입 / 로그인 (데모용 localStorage DB) ----------
function getUsersDB() {
  try {
    return JSON.parse(localStorage.getItem(USERS_DB_KEY)) || [];
  } catch {
    return [];
  }
}

function signupWithEmail(name, email, password) {
  if (!name || !email || !password) {
    alert('이름, 이메일, 비밀번호를 모두 입력해 주세요.');
    return;
  }
  const users = getUsersDB();
  if (users.find((u) => u.email === email)) {
    alert('이미 가입된 이메일입니다. 로그인해 주세요.');
    return;
  }
  // ⚠️ 데모용: 실서비스에서는 절대 평문 비밀번호를 저장하지 마세요. 서버에서 해시(bcrypt 등) 처리 필수.
  users.push({ name, email, password });
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  saveSession({ provider: 'email', email, name, picture: '' });
}

function loginWithEmail(email, password) {
  const users = getUsersDB();
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) {
    alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    return;
  }
  saveSession({ provider: 'email', email: found.email, name: found.name, picture: '' });
}

document.addEventListener('DOMContentLoaded', () => {
  initGoogleLogin();
  initKakaoLogin();
});
