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

  // ── Home page search & filter ────────────────── 
  function initHome() {
    const searchInput = document.getElementById('searchInput');
    const filterTags = document.querySelectorAll('.filter-tag');
    const cards = document.querySelectorAll('.problem-card');
    const noResults = document.getElementById('noResults');
    const countEl = document.getElementById('visibleCount');

    if (!searchInput || !cards.length) return;

    let activeTag = null;

    searchInput.addEventListener('input', filter);

    filterTags.forEach(tag => {
      tag.addEventListener('click', () => {
        if (tag.classList.contains('active')) {
          tag.classList.remove('active');
          activeTag = null;
        } else {
          filterTags.forEach(t => t.classList.remove('active'));
          tag.classList.add('active');
          activeTag = tag.dataset.tag.toLowerCase();
        }
        filter();
      });
    });

    function filter() {
      const query = searchInput.value.toLowerCase().trim();
      let visible = 0;

      cards.forEach(card => {
        const title = (card.dataset.title || '').toLowerCase();
        const tags = (card.dataset.tags || '').toLowerCase();
        const matchesSearch = !query || title.includes(query) || tags.includes(query);
        const matchesTag = !activeTag || tags.includes(activeTag);

        if (matchesSearch && matchesTag) {
          card.style.display = '';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResults) noResults.style.display = visible === 0 ? '' : 'none';
      if (countEl) countEl.textContent = visible;
    }
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
  const MERMAID_THEMES = {
    dark: {
      background: 'transparent',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      primaryColor: '#241f3d',
      primaryBorderColor: '#7c5cfc',
      primaryTextColor: '#ece9ff',
      secondaryColor: '#123128',
      secondaryBorderColor: '#34d399',
      secondaryTextColor: '#d1fae5',
      tertiaryColor: '#1e1e28',
      tertiaryBorderColor: '#3a3a4d',
      tertiaryTextColor: '#e4e4eb',
      lineColor: '#8b8ca3',
      textColor: '#e4e4eb',
      edgeLabelBackground: '#15151f',
      clusterBkg: '#16161f',
      clusterBorder: '#2a2a38',
      nodeTextColor: '#ece9ff',
      actorBkg: '#241f3d',
      actorBorder: '#7c5cfc',
      actorTextColor: '#ece9ff',
      signalColor: '#8b8ca3',
      signalTextColor: '#e4e4eb',
      noteBkgColor: '#2b2416',
      noteBorderColor: '#fbbf24',
      noteTextColor: '#fde68a',
    },
    light: {
      background: 'transparent',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      primaryColor: '#eef2ff',
      primaryBorderColor: '#6366f1',
      primaryTextColor: '#1e1b4b',
      secondaryColor: '#ecfdf5',
      secondaryBorderColor: '#10b981',
      secondaryTextColor: '#064e3b',
      tertiaryColor: '#f8fafc',
      tertiaryBorderColor: '#cbd5e1',
      tertiaryTextColor: '#1e293b',
      lineColor: '#64748b',
      textColor: '#1e293b',
      edgeLabelBackground: '#ffffff',
      clusterBkg: '#f8fafc',
      clusterBorder: '#e2e8f0',
      nodeTextColor: '#1e1b4b',
      actorBkg: '#eef2ff',
      actorBorder: '#6366f1',
      actorTextColor: '#1e1b4b',
      signalColor: '#64748b',
      signalTextColor: '#1e293b',
      noteBkgColor: '#fffbeb',
      noteBorderColor: '#f59e0b',
      noteTextColor: '#78350f',
    },
  };

  // Extra polish applied inside the rendered SVG
  const MERMAID_CSS = `
    .node rect, .node polygon, .node circle, .node path { stroke-width: 1.5px; }
    .node rect { rx: 10px; ry: 10px; }
    .edgePath .path, .flowchart-link { stroke-width: 1.6px; }
    .edgeLabel { font-size: 12px; padding: 2px 6px; border-radius: 6px; }
    .label { font-weight: 500; }
    .cluster rect { rx: 12px; ry: 12px; stroke-dasharray: 4 3; }
  `;

  async function renderDiagrams() {
    const nodes = document.querySelectorAll('pre.mermaid[data-source]');
    if (!nodes.length) return;

    try {
      const mermaid = await loadMermaid();
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: MERMAID_THEMES[isLight ? 'light' : 'dark'],
        themeCSS: MERMAID_CSS,
        securityLevel: 'strict',
        flowchart: { curve: 'basis', padding: 16, nodeSpacing: 45, rankSpacing: 55, htmlLabels: true },
        sequence: { mirrorActors: false, messageAlign: 'center' },
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
