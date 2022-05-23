export const isClient =
  typeof window !== "undefined" &&
  Boolean(window.document) &&
  Boolean(window.document.createElement);
