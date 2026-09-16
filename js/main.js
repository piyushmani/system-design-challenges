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

  document.addEventListener('DOMContentLoaded', () => {
    init();
    initHome();
  });
})();
