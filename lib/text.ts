export const deburr = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const tokenize = (s = "") =>
  deburr(s.toLowerCase()).split(/\s+/).filter(Boolean);
