document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav close on link click
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('nav.links a');
  navItems.forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Scroll progress + timecode label
  const sections = ['landing', 'about', 'experience', 'education', 'projects', 'skills', 'certifications', 'achievements', 'contact'];
  const labels = {
    landing: 'INTRO',
    about: 'ABOUT',
    experience: 'EXPERIENCE',
    education: 'EDUCATION',
    projects: 'PROJECTS',
    skills: 'SKILLS',
    certifications: 'CERTS',
    achievements: 'ACHIEVEMENTS',
    contact: 'CONTACT'
  };

  const playhead = document.getElementById('playhead');
  const tcLabel = document.getElementById('tc-label');

  function fmt(t) {
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function onScroll() {
    const doc = document.documentElement;
    const scrollPct = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight) * 100;
    if (playhead) playhead.style.width = scrollPct + '%';

    let current = sections[0];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.45) {
          current = id;
        }
      }
    }

    // Highlight active nav item
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });

    const idx = sections.indexOf(current);
    if (tcLabel) tcLabel.textContent = `${fmt(idx * 15)} — ${labels[current]}`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll reveal observer
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('[data-animate], .exp-card, .proj-card, .cert-card, .ach-card, .skill-card, .edu-card, .form-card, .info-panel, .real-cert-highlight').forEach(el => io.observe(el));

  // Skill bar animation
  const skillIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
        });
        skillIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.skill-card').forEach(el => skillIO.observe(el));

  // Number Counter Animation
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 25));
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) {
            cur = target;
            clearInterval(t);
          }
          el.textContent = cur;
        }, 40);
        countIO.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.num[data-count]').forEach(el => countIO.observe(el));

  // Project Filter Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards = document.querySelectorAll('.proj-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'grid';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // Video Suite Modal & Color Grading Comparison Logic
  const modalOverlay = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalThumb = document.getElementById('modalThumb');
  const modalOutcomes = document.getElementById('modalOutcomes');
  const modalPills = document.getElementById('modalPills');

  const projectDetails = {
    'promo-reel': {
      title: 'Brand Promo Reel',
      category: 'Short-form · Social Media',
      desc: 'A high-impact 30-second promotional edit engineered for Instagram Reels and TikTok. Designed with quick jump cuts, synchronized visual captions, audio ducking, and custom color grading to maximize audience retention during the vital first 3 seconds.',
      image: 'assets/promo_reel.jpg',
      outcomes: [
        { label: 'FORMAT', val: '9:16 Vertical' },
        { label: 'LENGTH', val: '0:30 Sec' },
        { label: 'TURNAROUND', val: '24 Hours' },
        { label: 'PLATFORMS', val: 'Reels / Shorts / TikTok' }
      ],
      pills: ['CapCut Pro', 'Color Grading', 'Kinetic Captions', 'Sound Design', 'Frame Pacing']
    },
    'youtube-doc': {
      title: 'YouTube Long-form Edit',
      category: 'Documentary-Style Narrative',
      desc: 'A full 12-minute documentary YouTube edit structured to sustain viewer watch-time. Features multi-cam sync, custom lower-thirds designed in After Effects, vocal audio mastering, and strategic narrative pacing that keeps drop-off rates low.',
      image: 'assets/youtube_doc.jpg',
      outcomes: [
        { label: 'LENGTH', val: '12:00 Min' },
        { label: 'STRUCTURE', val: 'Narrative Pacing' },
        { label: 'GRAPHICS', val: 'AE Lower Thirds' },
        { label: 'AUDIO', val: 'Vocal EQ & De-noise' }
      ],
      pills: ['After Effects', 'Storytelling', 'Audio Mix', 'Subtitles', 'YouTube Retention']
    },
    'ai-voice': {
      title: 'AI-Assisted Voiceover Edit',
      category: 'AI Workflow & Synthesis',
      desc: 'An innovative project combining ElevenLabs AI voice synthesis with scripted visual storyboarding. Demonstrates how AI tools streamline script ideation and audio generation without compromising visual polish and editing rhythm.',
      image: 'assets/ai_voice.jpg',
      outcomes: [
        { label: 'VOICE', val: 'ElevenLabs AI' },
        { label: 'SCRIPTING', val: 'ChatGPT / Claude' },
        { label: 'SYNC', val: 'Voice-to-Motion' },
        { label: 'WORKFLOW', val: 'AI-Accelerated' }
      ],
      pills: ['ElevenLabs', 'AI Editing Tools', 'Motion Graphics', 'CapCut Pro', 'Workflow Automation']
    }
  };

  projCards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.projectKey;
      const data = projectDetails[key];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalDesc.textContent = data.desc;
      modalThumb.src = data.image;

      // Fill outcomes
      modalOutcomes.innerHTML = data.outcomes.map(o => `
        <div class="outcome-box">
          <b>${o.label}</b>
          ${o.val}
        </div>
      `).join('');

      // Fill pills
      modalPills.innerHTML = data.pills.map(p => `<span class="pill">${p}</span>`).join('');

      // Show modal
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModalBtn = document.getElementById('modalClose');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Color Grading Drag Slider Logic
  const gradeSlider = document.getElementById('gradeSlider');
  const gradeAfter = document.getElementById('gradeAfter');
  const gradeHandle = document.getElementById('gradeHandle');

  if (gradeSlider && gradeAfter && gradeHandle) {
    let isDragging = false;

    const updateSlider = (x) => {
      const rect = gradeSlider.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width * 100;
      if (pos < 0) pos = 0;
      if (pos > 100) pos = 100;
      gradeAfter.style.width = pos + '%';
      gradeHandle.style.left = pos + '%';
    };

    gradeSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    gradeSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Certificate Lightbox Functions
  window.openCertModal = function(imgSrc, provider, title) {
    const certModal = document.getElementById('certModal');
    const certModalImg = document.getElementById('certModalImg');
    const certModalProvider = document.getElementById('certModalProvider');
    const certModalTitle = document.getElementById('certModalTitle');

    if (certModalImg) certModalImg.src = imgSrc;
    if (certModalProvider) certModalProvider.textContent = provider;
    if (certModalTitle) certModalTitle.textContent = title;

    if (certModal) {
      certModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeCertModal = function() {
    const certModal = document.getElementById('certModal');
    if (certModal) {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  const certModal = document.getElementById('certModal');
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
  }

  // Contact Form Submission & Toast
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name').value;
      const email = document.getElementById('cf-email').value;
      const subject = document.getElementById('cf-subject').value;
      const message = document.getElementById('cf-message').value;

      showToast(`Thank you, ${name}! Launching your email client...`);

      const body = `Name: ${name}%0AEmail: ${email}%0A%0A${encodeURIComponent(message)}`;
      setTimeout(() => {
        window.location.href = `mailto:abdulrehman01fiesta@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      }, 1000);
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
});
