// 네비게이션 메뉴 클릭 이벤트 처리 함수
function handleNavigation() {
  // 모든 네비게이션 링크 선택
  const navLinks = document.querySelectorAll("nav ul li a");

  // 각 링크에 클릭 이벤트 리스너 추가
  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      // 기본 동작 방지
      event.preventDefault();

      // 타겟 섹션 ID 가져오기
      const targetId = this.getAttribute("href");

      // 해당 섹션 요소 선택
      const targetSection = document.querySelector(targetId);

      // 섹션으로 부드럽게 스크롤
      targetSection.scrollIntoView({
        behavior: "smooth",
      });
    });
  });
}

// 페이지 로드 시 네비게이션 기능 초기화
document.addEventListener("DOMContentLoaded", handleNavigation);
