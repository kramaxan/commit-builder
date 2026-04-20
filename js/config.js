/**
 * Configuration for Commit Message Builder.
 * Edit this file to customize ticket prefixes, teams, types, and validation.
 */
const CONFIG = {
  ticketPrefixes: ['HMMSDS'],

  teams: ['BE', 'FE'],

  types: ['FIX', 'DEV', 'CHANGE', 'MERGE', 'ADD'],

  /**
   * Regex to validate the final formatted commit message.
   * Matches: HMMSDS-1234:BE:FIX: some message  or  Merge/Revert/Finish ...
   */
  validationRegex: /^(HMM|HMMSDS)-[0-9]{1,5}:(BE|FE):(FIX|DEV|CHANGE|MERGE|ADD): [a-zA-Z0-9 ,.'\-()/:_;&#@+!]+$|^(Merge|Revert|Finish).+/,

  /** Default suffix text appended for PR comment fix commits */
  prSuffixDefault: 'Fixed PR comments',

  /** Separator between commit message and PR suffix */
  prSuffixSeparator: '. ',

  /** localStorage key for persisting history */
  storageKey: 'commitMessageBuilderData',

  /** localStorage key for persisting PR suffix text */
  prSuffixStorageKey: 'commitMessageBuilderPrSuffix',

  /** Duration in ms for "Copied!" feedback */
  feedbackDuration: 1500,
};
