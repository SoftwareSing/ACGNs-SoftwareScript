/**
 * 獲取在localStorage中的localCompanies
 * @return {Array} localCompanies
 */
export function getLocalCompanies() {
  const localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];

  return localCompanies;
}
