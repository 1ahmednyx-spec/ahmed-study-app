/* Ahmed Study Platform — local persistence boundary
 * Keeps the legacy study-v1 key and tolerates older/partial browser data.
 */
(function (global) {
  'use strict';

  const KEY = 'study-v1';
  const DEFAULTS = {
    ev: [],
    notes: [],
    words: [],
    track: 'sci',
    prac: [],
    goal: 100,
    mist: [],
    focus: {},
    courseDone: {},
    courseWords: [],
    courseWriting: [],
    courseExamChecks: {},
    subjectLessonDone: {}
  };
  const ARRAY_FIELDS = ['ev', 'notes', 'words', 'prac', 'mist', 'courseWords', 'courseWriting'];
  const OBJECT_FIELDS = ['focus', 'courseDone', 'courseExamChecks', 'subjectLessonDone'];

  function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function normalize(value) {
    const state = Object.assign({}, DEFAULTS, value);
    ARRAY_FIELDS.forEach(key => {
      if (!Array.isArray(state[key])) state[key] = [];
    });
    OBJECT_FIELDS.forEach(key => {
      if (!isRecord(state[key])) state[key] = {};
    });
    if (!['sci', 'math', 'lit'].includes(state.track)) state.track = DEFAULTS.track;
    if (!Number.isFinite(Number(state.goal)) || Number(state.goal) < 1) state.goal = DEFAULTS.goal;
    return state;
  }

  function load() {
    try {
      const raw = global.localStorage.getItem(KEY);
      if (!raw) return normalize({});
      const parsed = JSON.parse(raw);
      return normalize(isRecord(parsed) ? parsed : {});
    } catch (error) {
      return normalize({});
    }
  }

  function save(state) {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      return false;
    }
  }

  global.StudyStorage = Object.freeze({
    key: KEY,
    load: load,
    save: save
  });
})(window);
