// ============================================
// mangohada — Supabase Auth 버전
// ============================================

// ---------- 현재 로그인 유저 조회 ----------
async function getCurrentUser() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  const { data: profile } = await sb
    .from('profiles')
    .select('name, avatar_url, role')
    .eq('id', user.id)
    .single();

  // 접속 시각 기록 (MAU/DAU/이탈자 산출에 사용)
  sb.from('profiles').update({ last_seen_at: new Date().toISOString() }).eq('id', user.id);

  return {
    id: user.id,
    email: user.email,
    name: profile?.name || user.user_metadata?.name || user.email,
    avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    role: profile?.role || 'user',
  };
}

// ---------- 이메일 로그인 ----------
async function loginWithEmail(email, password) {
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    alert(error.message === 'Invalid login credentials'
      ? '이메일 또는 비밀번호가 일치하지 않습니다.'
      : error.message);
    return false;
  }
  return true;
}

// ---------- 이메일 회원가입 ----------
async function signupWithEmail(name, email, password, birthDate, gender) {
  if (!name || !email || !password) {
    alert('이름, 이메일, 비밀번호를 모두 입력해 주세요.');
    return false;
  }
  const { error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { name, birth_date: birthDate || null, gender: gender || null } },
  });
  if (error) {
    alert(error.message);
    return false;
  }
  return true;
}

// ---------- 구글 로그인 ----------
async function loginWithGoogle() {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/index.html' },
  });
  if (error) alert(error.message);
}

// ---------- 카카오 로그인 ----------
async function loginWithKakao() {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'kakao',
    options: { redirectTo: window.location.origin + '/index.html' },
  });
  if (error) alert(error.message);
}

// ---------- 로그아웃 ----------
async function logout() {
  await sb.auth.signOut();
  window.location.href = 'index.html';
}
