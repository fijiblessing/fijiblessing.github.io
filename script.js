// 네비게이션 및 부드러운 스크롤 기능
function initNavigation() {
  // 모든 네비게이션 링크 선택
  const navLinks = document.querySelectorAll("nav ul li a, a[href^='#']");

  // 각 링크에 클릭 이벤트 리스너 추가
  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      // 기본 동작 방지
      event.preventDefault();

      // 타겟 섹션 ID 가져오기
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      // 섹션으로 부드럽게 스크롤
      if (targetSection) {
        const headerOffset = 80; // 헤더의 높이를 고려한 오프셋
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// 통합된 스크롤 애니메이션 기능
function initScrollAnimations() {
  // 스크롤 애니메이션 옵션
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  // IntersectionObserver 생성
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 섹션 애니메이션
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
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
  }, observerOptions);

  // 모든 섹션에 초기 스타일 적용 및 관찰
  document.querySelectorAll("section").forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });
}

// 슬라이더 클래스 정의
class SponsorshipSlider {
  constructor(containerSelector, type) {
    this.container = document.querySelector(containerSelector);
    this.type = type;
    this.currentSlide = 0;

    if (!this.container) {
      return;
    }

    this.sliderContainer = this.container.querySelector(".slider-container");
    this.slides = this.container.querySelectorAll(".slide");
    this.prevBtn = document.querySelector(`.${type}-prev`);
    this.nextBtn = document.querySelector(`.${type}-next`);
    this.dots = document.querySelectorAll(`.${type}-dot`);

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateSlider();
    this.initTouchEvents();
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.prevSlide());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.nextSlide());
    }

    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });
  }

  initTouchEvents() {
    let startX = 0;
    let startY = 0;
    let moveX = 0;
    let moveY = 0;

    this.sliderContainer.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    this.sliderContainer.addEventListener("touchmove", (e) => {
      moveX = e.touches[0].clientX;
      moveY = e.touches[0].clientY;
    });

    this.sliderContainer.addEventListener("touchend", () => {
      const diffX = startX - moveX;
      const diffY = startY - moveY;

      // 가로 스와이프가 세로보다 클 때만 슬라이드 변경
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    });
  }

  prevSlide() {
    this.currentSlide =
      this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.updateSlider();
  }

  nextSlide() {
    this.currentSlide =
      this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
    this.updateSlider();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateSlider();
  }

  updateSlider() {
    const translateX = -this.currentSlide * 100;
    this.sliderContainer.style.transform = `translateX(${translateX}%)`;

    // 도트 업데이트
    this.dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add("bg-sky");
        dot.classList.remove("bg-gray-300");
      } else {
        dot.classList.remove("bg-sky");
        dot.classList.add("bg-gray-300");
      }
    });

    // 네비게이션 버튼 상태 업데이트
    if (this.slides.length <= 1) {
      if (this.prevBtn) this.prevBtn.style.display = "none";
      if (this.nextBtn) this.nextBtn.style.display = "none";
    }
  }
}

// 탭 전환 기능
function initSponsorshipTabs() {
  const tabs = document.querySelectorAll(".sponsorship-tab");
  const tabContents = document.querySelectorAll(".tab-content");

  if (tabs.length === 0) {
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.dataset.tab;

      // 모든 탭 비활성화
      tabs.forEach((t) => {
        t.classList.remove("bg-sky", "text-white");
        t.classList.add("bg-transparent", "text-sky");
      });

      // 클릭된 탭 활성화
      tab.classList.add("bg-sky", "text-white");
      tab.classList.remove("bg-transparent", "text-sky");

      // 모든 탭 컨텐츠 숨기기
      tabContents.forEach((content) => {
        content.classList.add("hidden");
        content.classList.remove("active");
        content.style.display = "none";
        content.style.opacity = "0";
        content.style.transform = "translateY(20px)";
      });

      // 선택된 탭 컨텐츠 표시
      const targetContent = document.getElementById(`${targetTab}-content`);
      if (targetContent) {
        targetContent.classList.remove("hidden");
        targetContent.classList.add("active");
        targetContent.style.display = "block";
        targetContent.style.opacity = "1";
        targetContent.style.transform = "translateY(0)";
      }
    });
  });
}

// 슬라이더 초기화 함수
function initSliders() {
  const sliders = {
    students: new SponsorshipSlider(".students-slider", "students"),
    sponsors: new SponsorshipSlider(".sponsors-slider", "sponsors"),
  };

  return sliders;
}

// 자동 슬라이드 기능
function initAutoSlide(sliders) {
  let autoSlideInterval;

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      const activeTab = document.querySelector(".sponsorship-tab.bg-sky");
      const activeTabType = activeTab ? activeTab.dataset.tab : "students";

      if (sliders[activeTabType]) {
        sliders[activeTabType].nextSlide();
      }
    }, 5000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  const sliderContainers = document.querySelectorAll(
    ".students-slider, .sponsors-slider"
  );
  sliderContainers.forEach((container) => {
    container.addEventListener("mouseenter", stopAutoSlide);
    container.addEventListener("mouseleave", startAutoSlide);
  });

  startAutoSlide();
}

// 갤러리 더 보기 기능
function initGalleryLoadMore() {
  const loadMoreBtn = document.getElementById("load-more");
  const loadMoreBtnEn = document.getElementById("load-more-en");
  const galleryItems = document.querySelectorAll(".gallery-item");
  let currentItems = 6;

  function updateLoadMoreButton() {
    const remainingItems = galleryItems.length - currentItems;
    const nextBatchSize = Math.min(6, remainingItems);

    if (remainingItems <= 0) {
      if (loadMoreBtn) loadMoreBtn.style.display = "none";
      if (loadMoreBtnEn) loadMoreBtnEn.style.display = "none";
    } else {
      // Update Korean button text
      if (loadMoreBtn && loadMoreBtn.querySelector("span")) {
        loadMoreBtn.querySelector(
          "span"
        ).textContent = `더 많은 사진 보기 (${nextBatchSize}장)`;
      }

      // Update English button text
      if (loadMoreBtnEn && loadMoreBtnEn.querySelector("span")) {
        loadMoreBtnEn.querySelector(
          "span"
        ).textContent = `View More Photos (${nextBatchSize})`;
      }

      if (loadMoreBtn) loadMoreBtn.style.display = "";
      if (loadMoreBtnEn) loadMoreBtnEn.style.display = "";
    }
  }

  function loadMoreItems() {
    let counter = 0;
    galleryItems.forEach((item, index) => {
      if (index >= currentItems && counter < 6) {
        item.classList.remove("hidden");
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";

        // Stagger the animation for each item
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, counter * 100);

        counter++;
      }
    });

    currentItems += 6;
    updateLoadMoreButton();
  }

  // Initialize button state
  updateLoadMoreButton();

  [loadMoreBtn, loadMoreBtnEn].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", loadMoreItems);
    }
  });

  // Add transition effect to gallery items
  galleryItems.forEach((item) => {
    item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });
}

// 모바일 메뉴 토글 기능
function initMobileMenu() {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll("#mobile-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }
}

// 언어 토글 기능
function initLanguageToggle() {
  const langKo = document.getElementById("lang-ko");
  const langEn = document.getElementById("lang-en");
  const langKoMobile = document.getElementById("lang-ko-mobile");
  const langEnMobile = document.getElementById("lang-en-mobile");
  const koElements = document.querySelectorAll(".lang-ko");
  const enElements = document.querySelectorAll(".lang-en");

  function setKorean() {
    koElements.forEach((el) => el.classList.remove("hidden-lang"));
    enElements.forEach((el) => el.classList.add("hidden-lang"));
    [langKo, langKoMobile].forEach((btn) => {
      if (btn) {
        btn.classList.add("bg-sky", "text-white");
        btn.classList.remove("border", "border-sky", "text-sky");
      }
    });
    [langEn, langEnMobile].forEach((btn) => {
      if (btn) {
        btn.classList.remove("bg-sky", "text-white");
        btn.classList.add("border", "border-sky", "text-sky");
      }
    });
  }

  function setEnglish() {
    enElements.forEach((el) => el.classList.remove("hidden-lang"));
    koElements.forEach((el) => el.classList.add("hidden-lang"));
    [langEn, langEnMobile].forEach((btn) => {
      if (btn) {
        btn.classList.add("bg-sky", "text-white");
        btn.classList.remove("border", "border-sky", "text-sky");
      }
    });
    [langKo, langKoMobile].forEach((btn) => {
      if (btn) {
        btn.classList.remove("bg-sky", "text-white");
        btn.classList.add("border", "border-sky", "text-sky");
      }
    });
  }

  [langKo, langKoMobile].forEach((btn) => {
    if (btn) btn.addEventListener("click", setKorean);
  });

  [langEn, langEnMobile].forEach((btn) => {
    if (btn) btn.addEventListener("click", setEnglish);
  });
}

// 페이지 로드 시 모든 기능 초기화
document.addEventListener("DOMContentLoaded", () => {
  // 기본 기능 초기화
  initNavigation();
  initScrollAnimations();
  initGalleryLoadMore();
  initMobileMenu();
  initLanguageToggle();

  // 후원 매칭 기능 초기화
  initSponsorshipTabs();
  const sliders = initSliders();
  initAutoSlide(sliders);

  // 초기 탭 상태 설정
  setTimeout(() => {
    const studentsContent = document.getElementById("students-content");
    if (studentsContent) {
      studentsContent.style.display = "block";
      studentsContent.style.opacity = "1";
      studentsContent.style.transform = "translateY(0)";
    }
  }, 100);

  // 페이지 로드 시 첫 번째 섹션 애니메이션 즉시 실행
  setTimeout(() => {
    const firstSection = document.querySelector("#hero");
    if (firstSection) {
      firstSection.classList.add("is-visible");
      const staggerItems = firstSection.querySelectorAll(".stagger-item");
      staggerItems.forEach((item) => {
        item.classList.add("is-visible");
      });
    }
  }, 100);
});
