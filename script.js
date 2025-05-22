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

// 페이드인 애니메이션 함수
function initFadeInAnimations() {
  // 모든 fade-in-section 클래스 요소에 대한 IntersectionObserver 설정
  const fadeInSections = document.querySelectorAll(".fade-in-section");

  // 옵저버 설정 (뷰포트의 10% 이상 보이면 애니메이션 실행)
  const options = {
    root: null, // 뷰포트 기준
    rootMargin: "0px",
    threshold: 0.1, // 10% 이상 보이면 실행
  };

  // IntersectionObserver 생성
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // 섹션이 화면에 진입했을 때
      if (entry.isIntersecting) {
        // is-visible 클래스 추가하여 애니메이션 실행
        entry.target.classList.add("is-visible");

        // 내부 요소들에 stagger 효과 적용
        const staggerItems = entry.target.querySelectorAll(".stagger-item");
        staggerItems.forEach((item) => {
          item.classList.add("is-visible");
        });

        // 요소가 한 번 보이면 더 이상 관찰하지 않음
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // 모든 섹션 관찰
  fadeInSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

// 페이지 로드 시 모든 기능 초기화
document.addEventListener("DOMContentLoaded", () => {
  handleNavigation();
  initFadeInAnimations();

  // 페이지 로드 시 첫 번째 섹션 애니메이션 즉시 실행
  setTimeout(() => {
    const firstSection = document.querySelector("#overview");
    if (firstSection) {
      firstSection.classList.add("is-visible");
      const staggerItems = firstSection.querySelectorAll(".stagger-item");
      staggerItems.forEach((item) => {
        item.classList.add("is-visible");
      });
    }
  }, 100);
});
