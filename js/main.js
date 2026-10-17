// ==========================================
// THEME CONFIGURATION
// ==========================================
const STYLE_MAP = {
  1: 'default',
  2: 'indigo',
  3: 'swiss',
  4: 'lagoon',
  5: 'charcoal',
  6: 'brutalist'
};
const ACTIVE_STYLE_ID = 5;
document.documentElement.setAttribute('data-style', STYLE_MAP[ACTIVE_STYLE_ID] || 'default');

/* ══════════════════════════════════════════════════
   Daily Dev Quiz — Shared Quiz Interaction Logic
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  let selectedIdx = null;
  let revealed = false;

  function init() {
    const options = document.querySelectorAll('.option');
    const btn = document.getElementById('btnSubmit');
    if (!options.length || !btn) return;

    // Read correct answer from data attribute on the quiz container
    const quizEl = document.getElementById('optionsList');
    const correctIdx = quizEl ? parseInt(quizEl.dataset.correct, 10) : -1;

    options.forEach(opt => {
      opt.addEventListener('click', () => selectOption(opt));
    });

    btn.addEventListener('click', () => revealAnswer(correctIdx));
  }

  function selectOption(el) {
    if (revealed) return;
    document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    selectedIdx = parseInt(el.dataset.idx, 10);
    document.getElementById('btnSubmit').disabled = false;
  }

  function revealAnswer(correctIdx) {
    if (selectedIdx === null || revealed) return;
    revealed = true;

    const btn = document.getElementById('btnSubmit');
    const options = document.querySelectorAll('.option');

    options.forEach((o, i) => {
      o.style.cursor = 'default';
      if (i === correctIdx) {
        o.classList.add('correct');
      } else if (i === selectedIdx && i !== correctIdx) {
        o.classList.add('wrong');
      } else {
        o.classList.add('dimmed');
      }
    });

    btn.disabled = true;
    btn.innerHTML = selectedIdx === correctIdx
      ? '<span class="icon">🎉</span> Correct!'
      : '<span class="icon">📖</span> See Explanation Below';

    const section = document.getElementById('answerSection');
    if (section) {
      section.classList.add('visible');
      renderDiagrams();
      setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }

  // ── Home page search & filter & pagination ─────── 
  function initHome() {
    const searchInput = document.getElementById('searchInput');
    const filterTags = document.querySelectorAll('.filter-tag');
    const cards = Array.from(document.querySelectorAll('.problem-card'));
    const noResults = document.getElementById('noResults');
    const countEl = document.getElementById('visibleCount');
    const paginationEl = document.getElementById('pagination');

    if (!searchInput || !cards.length) return;

    let activeTag = null;
    let currentPage = 1;
    const CARDS_PER_PAGE = 12;

    searchInput.addEventListener('input', () => {
      currentPage = 1;
      filterAndPaginate();
    });

    const moreBtn = document.getElementById('filterMoreBtn');
    const drawer = document.getElementById('tagsDrawer');
    if (moreBtn && drawer) {
      moreBtn.addEventListener('click', () => {
        const isOpen = drawer.classList.toggle('is-open');
        moreBtn.classList.toggle('active', isOpen);
        if (isOpen) {
          moreBtn.dataset.originalText = moreBtn.dataset.originalText || moreBtn.textContent;
          moreBtn.textContent = "✕ Close topics";
        } else {
          moreBtn.textContent = moreBtn.dataset.originalText || moreBtn.textContent;
        }
      });
    }

    filterTags.forEach(tag => {
      tag.addEventListener('click', () => {
        if (tag.dataset.tag === 'all') {
          filterTags.forEach(t => t.classList.remove('active'));
          tag.classList.add('active');
          activeTag = null;
        } else {
          filterTags.forEach(t => t.classList.remove('active'));
          tag.classList.add('active');
          activeTag = tag.dataset.tag.toLowerCase();
        }
        currentPage = 1;
        filterAndPaginate();
      });
    });

    function filterAndPaginate() {
      const query = searchInput.value.toLowerCase().trim();

      // 1. Filter
      const matchedCards = cards.filter(card => {
        const title = (card.dataset.title || '').toLowerCase();
        const tags = (card.dataset.tags || '').toLowerCase();
        const matchesSearch = !query || title.includes(query) || tags.includes(query);
        const matchesTag = !activeTag || tags.includes(activeTag);
        return matchesSearch && matchesTag;
      });

      // Hide all cards first
      cards.forEach(card => card.style.display = 'none');

      // 2. Paginate
      const totalPages = Math.ceil(matchedCards.length / CARDS_PER_PAGE);
      if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

      const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
      const visibleCards = matchedCards.slice(startIndex, startIndex + CARDS_PER_PAGE);

      visibleCards.forEach(card => card.style.display = '');

      // 3. Update UI
      if (noResults) noResults.style.display = matchedCards.length === 0 ? '' : 'none';
      if (countEl) countEl.textContent = matchedCards.length;

      renderPagination(totalPages);
    }

    function getPageItems(current, total) {
      if (total <= 7) {
        const pages = [];
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
      }

      if (current <= 4) {
        return [1, 2, 3, 4, 5, '...', total];
      }

      if (current >= total - 3) {
        return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
      }

      return [1, '...', current - 1, current, current + 1, '...', total];
    }

    function renderPagination(totalPages) {
      if (!paginationEl) return;
      if (totalPages <= 1) {
        paginationEl.style.display = 'none';
        paginationEl.innerHTML = '';
        return;
      }

      paginationEl.style.display = 'flex';
      let html = '';

      // Prev button: always rendered to preserve layout balance and prevent shifting
      const isFirst = currentPage <= 1;
      html += `<button class="page-btn page-btn--nav" ${isFirst ? 'disabled aria-disabled="true"' : `data-page="${currentPage - 1}"`} aria-label="Previous page">
        <span class="nav-arrow">&larr;</span>
        <span class="nav-text">Prev</span>
      </button>`;

      // Page numbers with ellipsis
      const items = getPageItems(currentPage, totalPages);
      items.forEach(item => {
        if (item === '...') {
          html += `<span class="page-ellipsis" aria-hidden="true">&hellip;</span>`;
        } else {
          const isActive = item === currentPage;
          html += `<button class="page-btn ${isActive ? 'active' : ''}" data-page="${item}" aria-label="Page ${item}" ${isActive ? 'aria-current="page"' : ''}>${item}</button>`;
        }
      });

      // Next button: always rendered to preserve layout balance and prevent shifting
      const isLast = currentPage >= totalPages;
      html += `<button class="page-btn page-btn--nav" ${isLast ? 'disabled aria-disabled="true"' : `data-page="${currentPage + 1}"`} aria-label="Next page">
        <span class="nav-text">Next</span>
        <span class="nav-arrow">&rarr;</span>
      </button>`;

      paginationEl.innerHTML = html;

      // Add events using closest() to ensure clicks on child spans trigger correctly
      paginationEl.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const targetBtn = e.target.closest('.page-btn');
          if (!targetBtn || targetBtn.disabled || !targetBtn.dataset.page) return;
          const targetPage = parseInt(targetBtn.dataset.page, 10);
          if (isNaN(targetPage) || targetPage === currentPage) return;
          currentPage = targetPage;
          filterAndPaginate();
          // Scroll back to grid top
          const grid = document.getElementById('problemGrid');
          if (grid) {
            const offset = grid.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
          }
        });
      });
    }

    // Initial render
    filterAndPaginate();
  }

  // ── Theme Toggle ───────────────────────────────
  function initTheme() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    if (!toggleBtns.length) return;

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Re-render diagrams so they match the new theme
        if (revealed) renderDiagrams();
      });
    });
  }

  // ── Mermaid Diagrams (lazy-loaded) ─────────────
  const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  let mermaidPromise = null;

  function loadMermaid() {
    if (!mermaidPromise) {
      mermaidPromise = import(MERMAID_CDN).then(m => m.default);
    }
    return mermaidPromise;
  }

  // Palettes tuned to match the site's CSS themes
  async function renderDiagrams() {
    const nodes = document.querySelectorAll('pre.mermaid[data-source]');
    if (!nodes.length) return;

    try {
      const mermaid = await loadMermaid();
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      mermaid.initialize({
        startOnLoad: false,
        theme: isLight ? 'default' : 'dark',
        securityLevel: 'strict',
        fontFamily: 'Inter, system-ui, sans-serif',
        flowchart: {
          htmlLabels: true,
          padding: 15,
          nodeSpacing: 50,
          rankSpacing: 50,
          curve: 'linear'
        },
        sequence: {
          mirrorActors: false,
          actorMargin: 50,
          messageMargin: 40
        },
        themeCSS: `
          .node rect, .node circle, .node polygon, .node path { stroke-width: 2px; }
          .edgePath .path, .flowchart-link { stroke-width: 2px; }
          .edgeLabel { font-size: 13px; font-weight: 600; padding: 4px 8px; border-radius: 4px; }
          .label { font-weight: 600; font-family: Inter, system-ui, sans-serif; letter-spacing: 0.2px; }
          .cluster rect { stroke-width: 2px; stroke-dasharray: 8 4; rx: 8px; ry: 8px; }
        `
      });

      // Reset each node to its original source before (re-)rendering
      nodes.forEach(n => {
        n.removeAttribute('data-processed');
        n.classList.remove('mermaid-error');
        n.textContent = n.dataset.source;
      });
      await mermaid.run({ nodes: Array.from(nodes) });
    } catch (err) {
      console.error('Mermaid failed to render:', err);
      nodes.forEach(n => n.classList.add('mermaid-error'));
    }
  }

  // ── Diagram fullscreen toggle ──────────────────
  function initDiagramExpand() {
    const close = win => {
      win.classList.remove('is-expanded');
      document.body.classList.remove('no-scroll');
      const label = win.querySelector('.diagram-expand span');
      if (label) label.textContent = 'Expand';
    };

    document.querySelectorAll('.diagram-window').forEach(win => {
      const btn = win.querySelector('.diagram-expand');
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (win.classList.contains('is-expanded')) return close(win);
        win.classList.add('is-expanded');
        document.body.classList.add('no-scroll');
        btn.querySelector('span').textContent = 'Close';
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.diagram-window.is-expanded').forEach(close);
    });
  }

  // ── Copy button for code blocks ────────────────
  function initCodeCopy() {
    document.querySelectorAll('.code-block').forEach(block => {
      const btn = block.querySelector('.code-copy');
      const code = block.querySelector('code');
      if (!btn || !code) return;
      const label = btn.querySelector('span') || btn;

      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          label.textContent = 'Copied';
          btn.classList.add('is-done');
        } catch {
          label.textContent = 'Failed';
        }
        setTimeout(() => {
          label.textContent = 'Copy';
          btn.classList.remove('is-done');
        }, 1600);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    init();
    initHome();
    initCodeCopy();
    initDiagramExpand();
  });
})();
