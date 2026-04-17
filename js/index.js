$(function () {
  // PC에서만 적용 (화면 너비 767px 초과)
  $(".navi > ul > li").mouseover(function () {
    if ($(window).width() > 767) {
      $(".navi > ul > li > ul").stop().slideDown(500);
      $("#header").addClass("on");
    }
  });

  $(".navi > ul > li").mouseout(function () {
    if ($(window).width() > 767) {
      $(".navi > ul > li > ul").stop().slideUp(500);
      $("#header").removeClass("on");
    }
  });

  // 모바일: 햄버거 토글
  $(".m_menu").on("click", function () {
    $(".navi").toggleClass("mobile-active");
    $(this).find("i").toggleClass("fa-bars fa-times");
  });

  // 모바일: 서브메뉴 아코디언 (이벤트 위임 방식으로 개선)
  $(".navi > ul > li > a").on("click", function (e) {
    if ($(window).width() <= 767) {
      const $subMenu = $(this).siblings(".sub_menu");
      if ($subMenu.length > 0) {
        e.preventDefault();
        $subMenu.stop().slideToggle();
      }
    }
  });

  $(window).on("resize", function () {
    if ($(window).width() > 767) {
      $(".navi").removeClass("mobile-active");
      $(".m_menu i").removeClass("fa-times").addClass("fa-bars");
      $(".sub_menu").removeAttr("style"); // 모바일에서 slideToggle로 들어간 style 속성 제거
    }
  });

  /* --- Visual 슬라이더  --- */
  let i = 0;
  const total = $(".panel li").length;
  let timer;

  // 초기 실행
  fade();
  start();

  function start() {
    timer = setInterval(function () {
      i = (i + 1) % total; // 다음 인덱스 계산 중복 제거 (0, 1, 2 반복)
      fade();
    }, 3000);
  }

  function fade() {
    // 패널 및 텍스트 전환
    $(".panel li").stop().fadeOut().removeClass("on");
    $(".panel li").eq(i).stop().fadeIn().addClass("on");
    $(".txt li").hide().eq(i).show();

    // 게이지 바 초기화 및 애니메이션
    $(".progress_bar li div").stop().css({ width: "0" });
    $(".progress_bar li")
      .eq(i)
      .find("div")
      .stop()
      .animate({ width: "100%" }, 1000);
  }

  // 슬라이더 컨트롤 통합 (정지 -> 인덱스변경 -> 실행)
  function handleControl(action) {
    clearInterval(timer);
    action();
    fade();
    if ($(".play_bar .pause").is(":visible")) start(); // 재생 상태일 때만 다시 시작
  }

  $(".next").on("click", () =>
    handleControl(() => {
      i = (i + 1) % total;
    }),
  );
  $(".prev").on("click", () =>
    handleControl(() => {
      i = (i - 1 + total) % total;
    }),
  );
  $(".progress_bar li").on("click", function () {
    const idx = $(this).index();
    handleControl(() => {
      i = idx;
    });
  });

  // 재생/일시정지
  $(".play_bar .pause").on("click", function () {
    clearInterval(timer);
    $(this).hide();
    $(".play").show();
  });

  $(".play_bar .play").on("click", function () {
    start();
    $(this).hide();
    $(".pause").show();
  });

  /* --- con02 갤러리 모달 --- */
  const galleryData = [
    {
      title: "AI 기반 보조 기술",
      desc: "최신 AI 기술을 활용하여 시각장애인과 이동약자를 위한 혁신적인 보조 솔루션을 개발합니다. 음성 안내, 객체 인식, 경로 안내 등 다양한 기능을 제공합니다.",
    },
    {
      title: "스마트 내비게이션",
      desc: "실내외 통합 내비게이션 시스템으로 휠체어 사용자와 시각장애인이 안전하고 편리하게 목적지까지 이동할 수 있도록 지원합니다.",
    },
    {
      title: "모바일 앱 서비스",
      desc: "스마트폰을 통해 언제 어디서나 AI 기반 보조 서비스를 이용할 수 있습니다. 음성 명령, 진동 알림, 실시간 위치 추적 기능을 제공합니다.",
    },
  ];

  // 갤러리 아이템 클릭 시 모달 열기
  $(".gallery_item").on("click", function () {
    const index = $(this).data("index");
    const imgSrc = $(this).find("img").attr("src");
    const data = galleryData[index];

    $("#modal_img").attr("src", imgSrc);
    $("#modal_title").text(data.title);
    $("#modal_desc").text(data.desc);
    $("#modal").fadeIn(300);
    $("body").css("overflow", "hidden"); // 배경 스크롤 방지
  });

  // 모달 닫기
  $(".modal_close").on("click", function () {
    $("#modal").fadeOut(300);
    $("body").css("overflow", "");
  });

  // 모달 외부 클릭 시 닫기
  $("#modal").on("click", function (e) {
    if ($(e.target).is("#modal")) {
      $("#modal").fadeOut(300);
      $("body").css("overflow", "");
    }
  });

  // 모달 닫기
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $("#modal").is(":visible")) {
      $("#modal").fadeOut(300);
      $("body").css("overflow", "");
    }
  });

  /* --- con03 뉴스 슬라이더 컨트롤 --- */
  let isPaused = false;

  // 일시정지/재생 버튼
  $(".slider_pause").on("click", function () {
    if (isPaused) {
      $(".news_track").css("animation-play-state", "running");
      $(this).html('<i class="fa-solid fa-pause"></i>');
      isPaused = false;
    } else {
      $(".news_track").css("animation-play-state", "paused");
      $(this).html('<i class="fa-solid fa-play"></i>');
      isPaused = true;
    }
  });

  // 이전/다음 버튼 (수동 스크롤)
  $(".slider_prev").on("click", function () {
    $(".news_track").css("animation-play-state", "paused");
    $(".slider_pause").html('<i class="fa-solid fa-play"></i>');
    isPaused = true;

    const itemWidth = $(".news_item").first().outerWidth(true);
    $(".news_track").animate(
      {
        scrollLeft: "-=" + itemWidth,
      },
      300,
    );
  });

  $(".slider_next").on("click", function () {
    $(".news_track").css("animation-play-state", "paused");
    $(".slider_pause").html('<i class="fa-solid fa-play"></i>');
    isPaused = true;

    const itemWidth = $(".news_item").first().outerWidth(true);
    $(".news_track").animate(
      {
        scrollLeft: "+=" + itemWidth,
      },
      300,
    );
  });

  // 카드 클릭 시 링크 이동 (예시)
  $(".news_item").on("click", function () {
    const title = $(this).find("h4").text();
    console.log("뉴스 클릭:", title);
    // location.href = '/news/detail?id=' + id;
  });

  /* --- GSAP ScrollTrigger 적용 --- */
  gsap.registerPlugin(ScrollTrigger);

  // con01 아이템 등장 (아래에서 위로)
  gsap.from("#con01 .item", {
    scrollTrigger: {
      trigger: "#con01",
      start: "top 80%",
      once: true,
    },
    y: 80,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.2,
  });

  // con02 갤러리 등장 (왼쪽에서 톡톡톡)
  gsap.from(".gallery_item", {
    scrollTrigger: {
      trigger: ".gallery_wrap",
      start: "top 85%",
      once: true,
    },
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.2,
  });

  // con03 뉴스 등장 (아래에서 위로)
  gsap.from(".news_item", {
    scrollTrigger: {
      trigger: ".news_track",
      start: "top 85%",
      once: true,
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.1,
  });

  // con04 등장 (왼쪽에서 톡톡톡)
  // 지도 이미지 먼저
  gsap.from("#con04 .con04_map", {
    scrollTrigger: {
      trigger: "#con04",
      start: "top 80%",
      once: true,
    },
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  // info_list 항목들 순차적으로
  gsap.from("#con04 .info_list li", {
    scrollTrigger: {
      trigger: "#con04",
      start: "top 80%",
      once: true,
    },
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.2,
    delay: 0.2,
  });

  // footer 등장 (아래에서)
  gsap.from("#footer .inner", {
    scrollTrigger: {
      trigger: "#footer",
      start: "top 90%",
      once: true,
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  });
});
