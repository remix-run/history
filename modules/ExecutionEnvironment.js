export var canUseDOM = !!(
  typeof window !== 'undefined' && window.document && window.document.createElement
);
