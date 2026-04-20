/**
 * Main application — form logic, preview rendering, validation, save action.
 */
(() => {
  let el;

  function populateSelect(selectEl, items) {
    items.forEach(item => {
      const opt = document.createElement('option');
      opt.value = opt.textContent = item;
      selectEl.appendChild(opt);
    });
  }

  function getFormState() {
    return {
      prefix: el.prefix.value,
      number: el.number.value.trim(),
      team: el.team.value,
      type: el.type.value,
      message: el.message.value.trim(),
      prEnabled: el.prToggle.checked,
      prSuffix: el.prSuffix.value.trim(),
      gitWrap: el.gitWrap.checked,
    };
  }

  function wrapIfNeeded(text) {
    return Format.applyGitWrap(text, el.gitWrap.checked);
  }

  function lockPrSuffix() {
    el.prSuffix.disabled = true;
    el.prEdit.textContent = STRINGS.buttons.edit;
  }

  function applyFormState(state) {
    el.prefix.value = state.prefix ?? el.prefix.options[0].value;
    el.number.value = state.number ?? '';
    el.team.value = state.team ?? el.team.options[0].value;
    el.type.value = state.type ?? el.type.options[0].value;
    el.message.value = state.message ?? '';
    el.prToggle.checked = state.prEnabled ?? false;
    if (state.prSuffix !== undefined) {
      el.prSuffix.value = state.prSuffix || CONFIG.prSuffixDefault;
    }
    el.gitWrap.checked = state.gitWrap ?? false;
    lockPrSuffix();
    renderPreview();
  }

  function renderPreview() {
    const result = Format.entry(getFormState());
    const isValid = CONFIG.validationRegex.test(result);

    el.previewText.textContent = wrapIfNeeded(result);
    el.preview.classList.toggle('valid', isValid);
    el.preview.classList.toggle('invalid', !isValid);
    el.save.disabled = !isValid;
  }

  function handleSave() {
    const state = getFormState();
    Clipboard.copyToClipboard(wrapIfNeeded(Format.entry(state)));
    History.pushState(state);

    el.save.textContent = STRINGS.feedback.copied;
    el.save.classList.add('copied');
    setTimeout(() => {
      el.save.textContent = STRINGS.buttons.saveToClipboard;
      el.save.classList.remove('copied');
    }, CONFIG.feedbackDuration);
  }

  function handleReset() {
    applyFormState({});
    History.deselect();
  }

  function handlePrEdit() {
    if (el.prSuffix.disabled) {
      el.prSuffix.disabled = false;
      el.prSuffix.focus();
      el.prEdit.textContent = STRINGS.buttons.save;
    } else {
      lockPrSuffix();
      localStorage.setItem(CONFIG.prSuffixStorageKey, el.prSuffix.value.trim());
      renderPreview();
    }
  }

  function handlePrReset() {
    el.prSuffix.value = CONFIG.prSuffixDefault;
    lockPrSuffix();
    localStorage.removeItem(CONFIG.prSuffixStorageKey);
    renderPreview();
  }

  function populateStrings() {
    [
      ['heading',         'textContent', STRINGS.heading],
      ['label-ticket',    'textContent', STRINGS.labels.ticket],
      ['label-team',      'textContent', STRINGS.labels.team],
      ['label-type',      'textContent', STRINGS.labels.type],
      ['label-message',   'textContent', STRINGS.labels.commitMessage],
      ['label-git-wrap',  'textContent', STRINGS.labels.gitWrap],
      ['label-pr-fix',    'textContent', STRINGS.labels.prFix],
      ['history-heading', 'textContent', STRINGS.labels.history],
      ['footer-text',     'textContent', STRINGS.footer],
      [el.number,         'placeholder', STRINGS.placeholders.ticketNumber],
      [el.message,        'placeholder', STRINGS.placeholders.commitMessage],
      [el.prEdit,         'textContent', STRINGS.buttons.edit],
      [el.prReset,        'textContent', STRINGS.buttons.resetSuffix],
      [el.prReset,        'title',       STRINGS.titles.resetSuffix],
      [el.replaceQuotes,  'textContent', STRINGS.buttons.replaceQuotes],
      [el.replaceQuotes,  'title',       STRINGS.titles.replaceQuotes],
      [el.reset,          'textContent', STRINGS.buttons.reset],
      [el.save,           'textContent', STRINGS.buttons.saveToClipboard],
      ['prev-btn',        'textContent', STRINGS.buttons.prev],
      ['prev-btn',        'title',       STRINGS.titles.prev],
      ['next-btn',        'textContent', STRINGS.buttons.next],
      ['next-btn',        'title',       STRINGS.titles.next],
      ['clear-btn',       'textContent', STRINGS.buttons.clearHistory],
      ['clear-btn',       'title',       STRINGS.titles.clearHistory],
    ].forEach(([target, prop, value]) => {
      (typeof target === 'string' ? document.getElementById(target) : target)[prop] = value;
    });
  }

  function init() {
    el = {
      prefix:        document.getElementById('ticket-prefix'),
      number:        document.getElementById('ticket-number'),
      team:          document.getElementById('team'),
      type:          document.getElementById('type'),
      message:       document.getElementById('commit-message'),
      preview:       document.getElementById('preview'),
      previewText:   document.getElementById('preview-text'),
      save:          document.getElementById('save-btn'),
      reset:         document.getElementById('reset-btn'),
      prToggle:      document.getElementById('pr-toggle'),
      prSuffix:      document.getElementById('pr-suffix'),
      prEdit:        document.getElementById('pr-edit-btn'),
      prReset:       document.getElementById('pr-reset-btn'),
      gitWrap:       document.getElementById('git-wrap-toggle'),
      replaceQuotes: document.getElementById('replace-quotes-btn'),
    };

    populateStrings();

    [
      [el.prefix, CONFIG.ticketPrefixes],
      [el.team,   CONFIG.teams],
      [el.type,   CONFIG.types],
    ].forEach(([sel, items]) => populateSelect(sel, items));

    el.prSuffix.value = localStorage.getItem(CONFIG.prSuffixStorageKey) || CONFIG.prSuffixDefault;

    renderPreview();

    [el.prefix, el.team, el.type].forEach(s => s.addEventListener('change', renderPreview));
    [el.number, el.message].forEach(f => f.addEventListener('input', renderPreview));

    el.save.addEventListener('click', handleSave);
    el.reset.addEventListener('click', handleReset);
    el.gitWrap.addEventListener('change', renderPreview);
    el.prToggle.addEventListener('change', renderPreview);
    el.prSuffix.addEventListener('input', renderPreview);
    el.prEdit.addEventListener('click', handlePrEdit);
    el.prReset.addEventListener('click', handlePrReset);
    el.replaceQuotes.addEventListener('click', () => {
      el.message.value = el.message.value.replace(/"/g, "'");
      renderPreview();
    });

    History.init(applyFormState);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
