// ============================================
// mangohada — 공통 헤더/푸터 삽입 + 활성 메뉴 표시 + 로그인 상태 반영
// ============================================

const AUTH_STORAGE_KEY = 'mangohada_user';

// 로그인 상태 확인 (auth.js의 saveSession()이 저장한 값을 읽음)
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
  } catch {
    return null;
  }
}

// 로그아웃
function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = 'login.html';
}

const NAV_LINKS_HTML = `
  <a href="index.html" data-page="home" class="nav-link"><span class="dot"></span>홈</a>
  <a href="will.html" data-page="will" class="nav-link"><span class="dot"></span>내 유언</a>
  <a href="expert.html" data-page="expert" class="nav-link"><span class="dot"></span>전문가</a>
  <a href="funeral.html" data-page="funeral" class="nav-link"><span class="dot"></span>장례식</a>
  <a href="mypage.html" data-page="mypage" class="nav-link"><span class="dot"></span>마이</a>
`;

function buildHeaderHTML() {
  const user = getCurrentUser();

  const rightSideHTML = user
    ? `
      <a href="happy-savings.html" class="text-sm font-semibold bg-[#FFC107] px-4 py-2 rounded-full hover:bg-[#ffb300] transition">행복 저금하기</a>
      <button class="relative">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
        <span class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
      </button>
      <div class="relative">
        <button id="userMenuTrigger" class="flex items-center gap-2">
          ${
            user.picture
              ? `<img src="${user.picture}" class="w-8 h-8 rounded-full object-cover" alt="${user.name}">`
              : `<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">${(user.name || '?').slice(0, 1)}</div>`
          }
          <span class="hidden lg:block text-sm font-semibold">${user.name || '사용자'}</span>
        </button>
        <div id="userMenuDropdown" class="hidden absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          <a href="mypage.html" class="block px-4 py-3 text-sm font-semibold hover:bg-gray-50">마이페이지</a>
          <button id="logoutBtn" class="w-full text-left px-4 py-3 text-sm font-semibold text-red-500 hover:bg-gray-50">로그아웃</button>
        </div>
      </div>
    `
    : `
      <a href="login.html" class="text-sm font-semibold bg-[#FFC107] px-4 py-2 rounded-full hover:bg-[#ffb300] transition">로그인 / 회원가입</a>
    `;

  return `
<header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
  <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <div class="flex items-center gap-10">
      <a href="index.html"><img src="assets/images/logo.svg" alt="mangohada" class="h-8 w-auto"></a>
      <nav class="hidden md:flex items-center gap-7 text-sm">
        ${NAV_LINKS_HTML}
      </nav>
    </div>
    <div class="flex items-center gap-4">
      ${rightSideHTML}
    </div>
  </div>
</header>
`;
}

const FOOTER_HTML = `
<footer class="border-t border-gray-100 mt-12 py-8">
  <div class="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
    <span>© 2026 mangohada. 나의 마지막까지, 좋은 삶으로 나아가기 위한 일상 기록</span>
    <a href="admin/login.html" class="hover:text-gray-600 transition">관리자</a>
  </div>
</footer>
`;

function mountLayout() {
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');
  if (headerSlot) headerSlot.innerHTML = buildHeaderHTML();
  if (footerSlot) footerSlot.innerHTML = FOOTER_HTML;

  // 현재 페이지에 맞는 nav 링크 활성화 (body의 data-page 속성 사용)
  const currentPage = document.body.dataset.page;
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active-link');
    }
  });

  // 사용자 메뉴 드롭다운 토글
  const trigger = document.getElementById('userMenuTrigger');
  const dropdown = document.getElementById('userMenuDropdown');
  if (trigger && dropdown) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', () => dropdown.classList.add('hidden'));
  }

  // 로그아웃 버튼
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

document.addEventListener('DOMContentLoaded', mountLayout);
