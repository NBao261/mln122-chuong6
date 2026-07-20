document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('#toc-list a');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');
  const topNav = document.getElementById('topNav');
  const revealElements = document.querySelectorAll('.reveal');

  /* ── Reading Progress Bar ──────────────── */
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }

  /* ── Nav shadow on scroll ──────────────── */
  function updateNavShadow() {
    if (window.scrollY > 10) {
      topNav.classList.add('scrolled');
    } else {
      topNav.classList.remove('scrolled');
    }
  }

  /* ── Back to Top visibility ───────────── */
  function updateBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  /* ── Scroll listener (throttled via rAF) */
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        updateNavShadow();
        updateBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ── Active TOC link on scroll (IntersectionObserver) ── */
  const observerOptions = {
    root: null,
    rootMargin: '-15% 0px -55% 0px',
    threshold: 0,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(
          `#toc-list a[href="#${id}"]`
        );
        if (activeLink) activeLink.classList.add('active');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach((section) => observer.observe(section));

  /* ── Smooth scroll for anchor links ───── */
  navLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const target = document.querySelector('#section-1');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ── Back to Top click ────────────────── */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Scroll-Reveal Animations ─────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ── Animated Counters ──────────────────── */
  const counterItems = document.querySelectorAll('[data-counter]');
  const counterValues = document.querySelectorAll('.stat-value');
  let countersAnimated = false;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000; // ms
    const isDecimal = target % 1 !== 0;
    const decimals = isDecimal ? 1 : 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentVal = easedProgress * target;

      el.textContent = prefix + currentVal.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (countersAnimated) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          counterValues.forEach((val) => animateCounter(val));
          counterObserver.disconnect();
        }
      });
    },
    { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.3 }
  );

  if (counterItems.length > 0) {
    counterObserver.observe(counterItems[0].closest('.stats-section') || counterItems[0]);
  }

  /* ── Handle initial load state ────────── */
  updateProgress();
  updateNavShadow();
  updateBackToTop();

  /* ── Game Logic ─────────────── */
  const quizData = {
    "2": {
      title: "VÒNG 2: ĐẠI CHIẾN CƯỚP ĐIỂM",
      questions: [
        { q: "Câu 6: Công nghiệp hóa là nhiệm vụ trung tâm của thời kỳ nào trong tiến trình quá độ lên chủ nghĩa xã hội ở Việt Nam?", options: ["A. Thời kỳ quá độ", "B. Thời kỳ phục hồi kinh tế", "C. Thời kỳ đẩy mạnh hội nhập"], ans: 0 },
        { q: "Câu 7: Mô hình công nghiệp hóa cổ điển của các nước Tây Âu thế kỷ 19 được tiến hành theo trình tự nào?", options: ["A. Trình tự nhảy vọt", "B. Trình tự tuần tự", "C. Trình tự đi tắt đón đầu"], ans: 1 },
        { q: "Câu 8: Phương thức phát triển giúp các nước đi sau tận dụng thành tựu khoa học - công nghệ mới để phát triển rút ngắn gọi là gì?", options: ["A. Đi tắt đón đầu", "B. Tự lực cánh sinh", "C. Bảo hộ sản xuất"], ans: 0 },
        { q: "Câu 9: Tuyệt đối hóa nhân tố chủ quan, nóng vội, vi phạm các quy luật kinh tế khách quan là biểu hiện của tư duy nào?", options: ["A. Duy vật", "B. Duy tâm", "C. Chủ quan duy ý chí"], ans: 2 },
        { q: "Câu 10: Một trong những nội dung cơ bản của CNH-HĐH ở Việt Nam là chuyển dịch cơ cấu kinh tế theo hướng tăng tỷ trọng của ngành nào?", options: ["A. Nông nghiệp và Dịch vụ", "B. Công nghiệp và Dịch vụ", "C. Nông nghiệp và Công nghiệp"], ans: 1 },
        { q: "Câu 11: Trong quá trình CNH-HĐH, cơ cấu ngành kinh tế chuyển dịch theo hướng giảm tỷ trọng tương đối của ngành nào?", options: ["A. Dịch vụ", "B. Công nghiệp nặng", "C. Nông nghiệp"], ans: 2 },
        { q: "Câu 12: Ở Việt Nam hiện nay, công nghiệp hóa, hiện đại hóa phải gắn liền với sự phát triển của nền kinh tế nào?", options: ["A. Kinh tế thị trường tự do", "B. Kinh tế tri thức", "C. Kinh tế kế hoạch hóa"], ans: 1 },
        { q: "Câu 13: Trong lực lượng sản xuất hiện đại, yếu tố nào đóng vai trò là nguồn lực cơ bản, quyết định sự phát triển của CNH-HĐH?", options: ["A. Máy móc tự động hóa", "B. Nguồn nhân lực chất lượng cao", "C. Vốn đầu tư nước ngoài (FDI)"], ans: 1 },
        { q: "Câu 14: Trong thời đại Cách mạng công nghiệp 4.0, quá trình CNH-HĐH ở Việt Nam bắt buộc phải gắn liền với quá trình nào?", options: ["A. Cơ giới hóa nông nghiệp", "B. Chuyển đổi số", "C. Đô thị hóa tự do"], ans: 1 },
        { q: "Câu 15: Yếu tố nào giữ vai trò quyết định trực tiếp đối với trình độ phát triển cơ sở vật chất - kỹ thuật của một nền kinh tế?", options: ["A. Trình độ công nghệ", "B. Quy mô dân số", "C. Số lượng lao động thủ công"], ans: 0 }
      ]
    },
    "3": {
      title: "VÒNG 3: TẤT TAY ĐỔI VẬN",
      questions: [
        { q: "Câu 16: Quá trình gắn kết nền kinh tế quốc gia với nền kinh tế khu vực và thế giới được gọi là gì?", options: ["A. Toàn cầu hóa văn hóa", "B. Hội nhập kinh tế quốc tế", "C. Tự do hóa chính trị", "D. Bán trợ giá xuất khẩu"], ans: 1 },
        { q: "Câu 17: Xu thế kinh tế nổi bật mang tính toàn cầu gắn liền và thúc đẩy tiến trình hội nhập kinh tế quốc tế là gì?", options: ["A. Toàn cầu hóa kinh tế", "B. Đô thị hóa tự do", "C. Công nghiệp hóa khép kín", "D. Quốc hữu hóa tư bản"], ans: 0 },
        { q: "Câu 18: Theo lý luận Mác - Lênin, hội nhập kinh tế quốc tế là phương thức để kết hợp nguồn lực nội lực với nguồn lực nào?", options: ["A. Nguồn lực ngoại lực", "B. Nguồn lực tự nhiên", "C. Nguồn lực lịch sử", "D. Nguồn lực ngân sách"], ans: 0 },
        { q: "Câu 19: Để hội nhập kinh tế quốc tế thành công mà không rơi vào thế bị động, phụ thuộc, quốc gia phải luôn giữ vững nguyên tắc nào?", options: ["A. Độc lập, tự chủ về kinh tế", "B. Khép kín thị trường nội địa", "C. Tuyệt đối không nhận vốn FDI", "D. Hạn chế xuất nhập khẩu"], ans: 0 },
        { q: "Câu 20: Chủ thể giữ vai trò định hướng, quản lý và điều tiết nhằm bảo đảm tính đúng đắn của tiến trình CNH-HĐH và hội nhập kinh tế là ai?", options: ["A. Các tập đoàn đa quốc gia", "B. Nhà nước", "C. Các tổ chức phi chính phủ", "D. Thị trường tự do"], ans: 1 }
      ]
    }
  };

  const gameIntro = document.getElementById('gameIntro');
  const gameQuiz = document.getElementById('gameQuiz');
  const gameResult = document.getElementById('gameResult');
  const roundTitle = document.getElementById('roundTitle');
  const questionCount = document.getElementById('questionCount');
  const questionText = document.getElementById('questionText');
  const optionsContainer = document.getElementById('optionsContainer');
  const btnNext = document.getElementById('btnNext');

  let currentRound = null;
  let currentQuestions = [];
  let currentQuestionIndex = 0;
  let isAnswered = false;

  document.querySelectorAll('.round-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const round = e.currentTarget.dataset.round;
      startRound(round);
    });
  });

  document.getElementById('btnRestart').addEventListener('click', () => {
    gameResult.classList.remove('active');
    gameIntro.classList.add('active');
  });

  btnNext.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
      loadQuestion();
    } else {
      showResult();
    }
  });

  function startRound(round) {
    currentRound = round;
    currentQuestions = quizData[round].questions;
    currentQuestionIndex = 0;
    roundTitle.innerText = quizData[round].title;
    
    gameIntro.classList.remove('active');
    gameQuiz.classList.add('active');
    
    loadQuestion();
  }

  function loadQuestion() {
    isAnswered = false;
    btnNext.classList.add('hidden');
    
    const q = currentQuestions[currentQuestionIndex];
    let qNumber = currentRound === "2" ? currentQuestionIndex + 6 : currentQuestionIndex + 16;
    questionCount.innerText = `Câu ${qNumber}/${currentRound === "2" ? "15" : "20"}`;
    questionText.innerText = q.q;
    
    optionsContainer.innerHTML = '';
    q.options.forEach((optText, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerText = optText;
      btn.addEventListener('click', () => handleAnswer(index, q.ans, btn));
      optionsContainer.appendChild(btn);
    });
  }

  function handleAnswer(selectedIndex, correctIndex, selectedBtn) {
    if (isAnswered) return;
    isAnswered = true;
    
    const btns = optionsContainer.querySelectorAll('.option-btn');
    btns.forEach(btn => btn.disabled = true);
    
    if (selectedIndex === correctIndex) {
      selectedBtn.classList.add('correct');
    } else {
      selectedBtn.classList.add('wrong');
      btns[correctIndex].classList.add('correct');
    }
    
    btnNext.classList.remove('hidden');
  }

  function showResult() {
    gameQuiz.classList.remove('active');
    gameResult.classList.add('active');
  }
});
