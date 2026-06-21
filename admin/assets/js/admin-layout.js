const ADMIN_NAV = [
  { page: 'dashboard',      href: 'index.html',         label: '대시보드',   icon: '📊' },
  { page: 'users',          href: 'users.html',          label: '회원 관리',  icon: '👥' },
  { page: 'happy-savings',  href: 'happy-savings.html',  label: '행복저금',   icon: '🌿' },
  { page: 'articles',       href: 'articles.html',       label: '아티클',     icon: '📝' },
  { page: 'experts',        href: 'experts.html',        label: '전문가',     icon: '👔' },
  { page: 'notifications',  href: 'notifications.html',  label: '알림',       icon: '🔔' },
  { page: 'support',        href: 'support.html',        label: '1:1 문의',   icon: '💬' },
  { page: 'payments',       href: 'payments.html',       label: '결제',       icon: '💳' },
  { page: 'stats',          href: 'stats.html',          label: '통계',       icon: '📈' },
];

const SIDEBAR_HTML = `
<aside class="fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-100 flex flex-col z-20">
  <div class="h-14 flex items-center gap-2 px-5 border-b border-gray-100">
    <a href="../index.html"><img src="../assets/images/logo.svg" alt="mangohada" class="h-6 w-auto"></a>
    <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">ADMIN</span>
  </div>
  <nav class="flex-1 py-4 overflow-y-auto">
    ${ADMIN_NAV.map(item => `
      <a href="${item.href}" data-page="${item.page}"
        class="admin-nav-link flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition">
        <span>${item.icon}</span>${item.label}
      </a>
    `).join('')}
  </nav>
  <div class="border-t border-gray-100 p-4">
    <a href="../index.html" class="text-xs text-gray-400 hover:text-gray-600">← 사이트로 돌아가기</a>
  </div>
</aside>
`;

const PAGE_TITLES = {
  dashboard:      '대시보드',
  users:          '회원 관리',
  'happy-savings':'행복저금 관리',
  articles:       '아티클 관리',
  experts:        '전문가 관리',
  notifications:  '알림 관리',
  support:        '1:1 문의',
  payments:       '결제 관리',
  stats:          '통계',
};

function buildAdminHeaderHTML() {
  const admin = getAdminUser();
  const currentPage = document.body.dataset.page;
  const title = PAGE_TITLES[currentPage] || '관리자';
  return `
<header class="fixed left-56 top-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-10">
  <p class="text-sm font-bold text-gray-700">${title}</p>
  <div class="flex items-center gap-3">
    <span class="text-sm text-gray-500">${admin?.name || '관리자'}</span>
    <button id="adminLogoutBtn" class="text-xs text-red-500 font-semibold border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50">로그아웃</button>
  </div>
</header>
`;
}

function mountAdminLayout() {
  requireAdminAuth();

  const sidebarSlot = document.getElementById('admin-sidebar');
  const headerSlot  = document.getElementById('admin-header');
  if (sidebarSlot) sidebarSlot.innerHTML = SIDEBAR_HTML;
  if (headerSlot)  headerSlot.innerHTML  = buildAdminHeaderHTML();

  const currentPage = document.body.dataset.page;
  document.querySelectorAll('.admin-nav-link').forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('text-gray-900', 'bg-[#FFFBEB]', 'border-r-2', 'border-[#FFC107]');
    }
  });

  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', adminLogout);
}

document.addEventListener('DOMContentLoaded', mountAdminLayout);
