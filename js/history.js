/**
 * History module — localStorage-backed commit message history with navigation.
 */
const History = (() => {
  let storedData = [];
  let currentIndex = -1;
  let onLoadState = null;
  let el;

  function load() {
    try {
      const raw = localStorage.getItem(CONFIG.storageKey);
      storedData = raw ? JSON.parse(raw) : [];
    } catch {
      storedData = [];
    }
  }

  function persist() {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(storedData));
  }

  function commitAndRender() {
    persist();
    render();
  }

  function isDuplicate(state) {
    const stateStr = JSON.stringify(state);
    return storedData.some(entry => JSON.stringify(entry) === stateStr);
  }

  function pushState(state) {
    if (isDuplicate(state)) return;
    storedData.push(state);
    currentIndex = storedData.length - 1;
    commitAndRender();
  }

  function removeItem(index) {
    storedData.splice(index, 1);
    if (currentIndex >= storedData.length) {
      currentIndex = storedData.length - 1;
    }
    commitAndRender();
  }

  function clearAll() {
    storedData = [];
    currentIndex = -1;
    commitAndRender();
  }

  function deselect() {
    currentIndex = -1;
    render();
  }

  function setActive(index) {
    if (index < 0 || index >= storedData.length) return;
    currentIndex = index;
    render();
    if (onLoadState) onLoadState(storedData[currentIndex]);
  }

  const COPY_ICON_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  function createEl(tag, props) {
    const elem = document.createElement(tag);
    Object.entries(props).forEach(([key, val]) => {
      if (key === 'role') elem.setAttribute(key, val);
      else elem[key] = val;
    });
    return elem;
  }

  function updateNavState() {
    el.prev.disabled = currentIndex <= 0;
    el.next.disabled = currentIndex < 0 || currentIndex >= storedData.length - 1;
    el.clear.disabled = storedData.length === 0;
  }

  function createHistoryItem(entry, index) {
    const formatted = Format.entry(entry);
    const display = Format.applyGitWrap(formatted, entry.gitWrap);

    const li = createEl('li', {
      className: 'history-item' + (index === currentIndex ? ' active' : ''),
      tabIndex: 0,
      role: 'button',
    });
    li.addEventListener('click', () => setActive(index));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(index); }
    });

    const text = createEl('span', { className: 'history-text', textContent: display });

    const copyBtn = createEl('button', {
      className: 'history-action history-copy',
      innerHTML: COPY_ICON_SVG,
      title: STRINGS.titles.copyToClipboard,
    });
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      Clipboard.copyToClipboard(display);
      copyBtn.classList.add('copied');
      setTimeout(() => copyBtn.classList.remove('copied'), CONFIG.feedbackDuration);
    });

    const deleteBtn = createEl('button', {
      className: 'history-action history-delete',
      innerHTML: '&times;',
      title: STRINGS.titles.remove,
    });
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeItem(index);
    });

    li.append(text, copyBtn, deleteBtn);
    return li;
  }

  function render() {
    el.list.innerHTML = '';
    updateNavState();

    if (storedData.length === 0) {
      el.list.appendChild(createEl('li', {
        className: 'history-empty',
        textContent: STRINGS.history.empty,
      }));
      return;
    }

    for (let i = storedData.length - 1; i >= 0; i--) {
      el.list.appendChild(createHistoryItem(storedData[i], i));
    }
  }

  function init(loadStateCallback) {
    onLoadState = loadStateCallback;

    el = {
      list:  document.getElementById('history-list'),
      prev:  document.getElementById('prev-btn'),
      next:  document.getElementById('next-btn'),
      clear: document.getElementById('clear-btn'),
    };

    load();
    render();

    el.prev.addEventListener('click', () => { if (currentIndex > 0) setActive(currentIndex - 1); });
    el.next.addEventListener('click', () => { if (currentIndex < storedData.length - 1) setActive(currentIndex + 1); });
    el.clear.addEventListener('click', clearAll);
  }

  return { init, pushState, deselect };
})();
