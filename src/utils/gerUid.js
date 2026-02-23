// utils/getUid.js
export function getUid() {
  try {
    const u = JSON.parse(sessionStorage.getItem('user') || 'null');
    const id = u?.id ?? Number(sessionStorage.getItem('userId'));
    return Number.isFinite(id) ? id : null;
  } catch {
    const id = Number(sessionStorage.getItem('userId'));
    return Number.isFinite(id) ? id : null;
  }
}
