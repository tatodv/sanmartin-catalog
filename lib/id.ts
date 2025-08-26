export function makeKey(base: string, i: number) {
  let h = 0;
  for (let c = 0; c < base.length; c++) h = (h * 31 + base.charCodeAt(c)) >>> 0;
  return `${h.toString(36)}-${i}`;
}
