/**
 * Formatting helpers for commit message construction and display.
 */
const Format = {
  gitWrapTemplate(text) {
    return `git commit -m "${text}"`;
  },

  applyGitWrap(text, shouldWrap) {
    return shouldWrap ? this.gitWrapTemplate(text) : text;
  },

  entry(state) {
    let msg = state.message;
    if (state.prEnabled && state.prSuffix) {
      msg += CONFIG.prSuffixSeparator + state.prSuffix;
    }
    return `${state.prefix}-${state.number}:${state.team}:${state.type}: ${msg}`;
  },
};
