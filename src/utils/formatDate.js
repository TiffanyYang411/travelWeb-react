// utils/formatDate.js
export function formatDateYMD(date) {
  if (!(date instanceof Date)) return '';
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
}
