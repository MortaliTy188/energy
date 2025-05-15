document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".history-swiper-container")) {
    const historySwiper = new Swiper(".history-swiper-container", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
    });
  }

  const assemblySwiperContainer = document.querySelector(
    ".assembly-swiper-container"
  );
  let assemblySwiperInstance = null;

  if (assemblySwiperContainer) {
    assemblySwiperInstance = new Swiper(assemblySwiperContainer, {
      direction: "vertical",
      slidesPerView: 1,
      spaceBetween: 25,
      grabCursor: true,
      mousewheel: false,

      pagination: {
        el: ".assembly-swiper-pagination",
        clickable: true,
      },
      on: {
        slideChange: function () {
          assemblySwiperContainer
            .querySelectorAll(".swiper-slide.assembly-slide")
            .forEach((slide) => {
              slide.classList.remove("active");
            });
          if (this.slides[this.activeIndex]) {
            this.slides[this.activeIndex].classList.add("active");
          }
        },
        init: function () {
          if (this.slides[this.activeIndex]) {
            this.slides[this.activeIndex].classList.add("active");
          }
        },
      },
    });
  }

  const regularExperimentListItems = document.querySelectorAll(
    "#experiment .exp-list-item:not(.assembly-slide)"
  );

  if (regularExperimentListItems.length > 0) {
    const regularObserverOptions = {
      root: null,
      rootMargin: "0px 0px -45% 0px",
      threshold: 0.2,
    };

    const regularItemObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!entry.target.classList.contains("active")) {
              entry.target.classList.add("active");
            }
          } else {
            if (
              entry.boundingClientRect.bottom < window.innerHeight * 0.55 &&
              entry.target.classList.contains("active")
            ) {
              entry.target.classList.remove("active");
            }
          }
        });
      },
      regularObserverOptions
    );

    regularExperimentListItems.forEach((item) => {
      regularItemObserver.observe(item);
    });
  }

  const assemblySlidesForScroll = document.querySelectorAll(
    ".assembly-swiper-container .swiper-slide.assembly-slide"
  );

  if (assemblySlidesForScroll.length > 0 && assemblySwiperInstance) {
    const slideObserverOptions = {
      root: null,
      rootMargin: "0px 0px -50% 0px",
      threshold: 0.1,
    };

    const assemblySlideObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slideIndex = Array.from(assemblySlidesForScroll).indexOf(
              entry.target
            );
            if (
              slideIndex !== -1 &&
              assemblySwiperInstance.activeIndex !== slideIndex
            ) {
              assemblySwiperInstance.slideTo(slideIndex);
            }
          }
        });
      },
      slideObserverOptions
    );

    assemblySlidesForScroll.forEach((slide) => {
      assemblySlideObserver.observe(slide);
    });
  }

  const navLinks = document.querySelectorAll('#site-header nav a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      let targetId = this.getAttribute("href");
      let targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset =
          document.getElementById("site-header").offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    });
  });

  const sections = document.querySelectorAll("section[id]");
  function navHighlighter() {
    let scrollY = window.pageYOffset;
    const headerHeight = document.getElementById("site-header").offsetHeight;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerHeight - 50;
      let sectionId = current.getAttribute("id");
      let correspondingLink = document.querySelector(
        `#site-header nav a[href="#${sectionId}"]`
      );
      if (correspondingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document
            .querySelectorAll("#site-header nav a")
            .forEach((link) => link.classList.remove("active"));
          correspondingLink.classList.add("active");
        } else {
          correspondingLink.classList.remove("active");
        }
      }
    });
    if (
      sections.length > 0 &&
      scrollY < sections[0].offsetTop - headerHeight - 50
    ) {
      document
        .querySelectorAll("#site-header nav a")
        .forEach((link) => link.classList.remove("active"));
    }
  }
  window.addEventListener("scroll", navHighlighter);
  navHighlighter();
});
