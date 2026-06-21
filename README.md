# mangohada — Web

망고하다 PRD 기반 웹사이트 정적 프로토타입입니다. 빌드 도구 없이 순수 HTML/CSS/JS로 동작합니다.

## 폴더 구조

```
mangohada-web/
├── index.html       # 홈 (대시보드 + 행복저금 배너)
├── will.html         # 내 유언
├── expert.html        # 전문가
├── funeral.html        # 나의 장례식 (초대 관리)
├── mypage.html        # 마이 / 망고 충전
└── assets/
    ├── css/
    │   └── style.css   # 공통 스타일 (Pretendard 폰트, hover 효과 등)
    └── js/
        └── layout.js    # 공통 헤더/푸터 삽입 + 활성 메뉴 표시
```

## VS Code에서 실행하는 방법

1. 이 폴더 전체를 VS Code에서 `폴더 열기(Open Folder)`로 엽니다.
2. 확장 프로그램 마켓에서 **Live Server**(ritwickdey.LiveServer)를 설치합니다.
3. `index.html`을 우클릭 → **Open with Live Server** 클릭.
4. 자동으로 브라우저가 열리고, 상단 GNB(홈/내 유언/전문가/장례식/마이)를 클릭하면 페이지 이동이 됩니다.

> Live Server 없이 그냥 `index.html`을 더블클릭해서 열어도 동작하지만, 일부 환경에서는 로컬 서버로 여는 걸 권장합니다.

## 기술 스택

- **Tailwind CSS** — CDN 방식(`cdn.tailwindcss.com`)으로 불러옵니다. 별도 빌드 설정 없이 바로 동작하지만, 프로덕션 배포 시에는 Tailwind CLI/PostCSS로 빌드해 CDN 의존성을 제거하는 걸 권장합니다.
- **Pretendard** — jsdelivr CDN(`@orioncactus/pretendard`)으로 불러옵니다.
- 순수 JS로 헤더/푸터를 공통 삽입 (`assets/js/layout.js`), 별도 프레임워크 없음.

## 다음 단계 (선택)

- Tailwind를 CDN이 아닌 로컬 빌드로 전환하고 싶으면:
  ```bash
  npm init -y
  npm install -D tailwindcss
  npx tailwindcss init
  ```
  이후 `tailwind.config.js`의 `content`에 `["./*.html"]`을 추가하고 `npx tailwindcss -i ./assets/css/style.css -o ./assets/css/output.css --watch`로 빌드하면 됩니다.
- 데이터 연동(행복저금 개수, 유언 리스트 등)이 필요하면 `assets/js/` 안에 별도 데이터 모듈을 만들어 fetch로 API와 연결하면 됩니다.
