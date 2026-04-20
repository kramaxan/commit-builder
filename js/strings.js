/**
 * UI strings for Commit Message Builder.
 * Edit this file to customize all user-facing text.
 */
const STRINGS = {
  heading: 'Commit Message Builder',

  labels: {
    ticket: 'Ticket',
    team: 'Team',
    type: 'Type',
    commitMessage: 'Commit message',
    gitWrap: 'git commit -m',
    prFix: 'PR comments',
    history: 'History',
  },

  placeholders: {
    ticketNumber: '1234',
    commitMessage: 'e.g. Fixed checkout validation logic',
  },

  buttons: {
    replaceQuotes: '" \u2192 \'',
    edit: 'Edit',
    save: 'Save',
    reset: 'Reset',
    resetSuffix: '\u21BA',
    saveToClipboard: 'Save to clipboard',
    prev: '\u2190 Prev',
    next: 'Next \u2192',
    clearHistory: 'Clear history',
  },

  titles: {
    replaceQuotes: 'Replace double quotes with single quotes',
    resetSuffix: 'Reset to default',
    prev: 'Previous',
    next: 'Next',
    clearHistory: 'Clear history',
    copyToClipboard: 'Copy to clipboard',
    remove: 'Remove',
  },

  feedback: {
    copied: 'Copied to clipboard!',
  },

  history: {
    empty: 'No saved commits yet',
  },

  footer: 'Built for consistent commits',
};
