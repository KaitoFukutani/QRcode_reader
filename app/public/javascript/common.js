/**
 *遅刻、欠席理由文字数カウント
 * @param {string} text
 * @param {string} field
 */
function countLength(text, field) { // eslint-disable-line
  document.getElementById(field).innerHTML = text.length + '/100文字';
}
