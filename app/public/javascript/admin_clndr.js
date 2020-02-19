const weeks = ['日', '月', '火', '水', '木', '金', '土'];
const date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let comeList = {};
let delayList = {};
let absenceList = {};
const userId = document.querySelector('#user-id').innerHTML;

/**
 * @param {number} year
 * @param {number} month
 * @param {object} userData
 */
function showCalendar(year, month, userData) {
  const calendarHtml = createCalendar(year, month, userData);
  const sec = document.createElement('section');
  sec.innerHTML = calendarHtml;
  document.querySelector('#calendar').appendChild(sec);
  month++;
  if (month > 12) {
    year++;
    month = 1;
  }
}

/**
 * @param {number} year
 * @param {number} month
  * @param {object} userData
 * @return {HTMLFormElement} calendarHtml
 */
function createCalendar(year, month, userData) {
  const startDate = new Date(year, month - 1, 1); // 月の最初の日を取得
  const endDate = new Date(year, month, 0); // 月の最後の日を取得
  const endDayCount = endDate.getDate(); // 月の末日
  const lastMonthEndDate = new Date(year, month - 2, 0); // 前月の最後の日の情報
  const lastMonthendDayCount = lastMonthEndDate.getDate(); // 前月の末日
  const startDay = startDate.getDay(); // 月の最初の日の曜日を取得
  let dayCount = 1; // 日にちのカウント
  let calendarHtml = ''; // HTMLを組み立てる変数
  calendarHtml += '<h4>' + year + '/' + month + '</h4>';
  calendarHtml += '<table class="clndr-table">';
  // 曜日の行を作成
  for (let i = 0; i < weeks.length; i++) {
    calendarHtml += '<td class="clndr-td">' + weeks[i] + '</td>';
  }
  for (let w = 0; w < 6; w++) {
    calendarHtml += '<tr class="clndr-tr">';
    for (let d = 0; d < 7; d++) {
      if (w == 0 && d < startDay) {
        // 1行目で1日の曜日の前
        const num = lastMonthendDayCount - startDay + d + 1;
        calendarHtml += '<td class="is-disabled clndr-td">' + num + '</td>';
      } else if (dayCount > endDayCount) {
        // 末尾の日数を超えた
        const num = dayCount - endDayCount;
        calendarHtml += '<td class="is-disabled clndr-td">' + num + '</td>';
        dayCount++;
      } else {
        let comeFlg;
        let delayFlg;
        let absenceFlg;
        const targetDay = (dayCount > 1)?dayCount: '0' + dayCount;
        if (userData.absenceData.length) {
          for (let count = 0; count < userData.attendanceData.length; count++) {
            day = userData.attendanceData[count].attendance_date.substring(8, 10);
            if (day == targetDay && userData.attendanceData[count].in_flg == 1) {
              comeList[day + '_in'] = userData.attendanceData[count].attendance_date.substring(0, 19);
              comeFlg = day;
            } else if (day == targetDay && userData.attendanceData[count].out_flg == 1) {
              comeList[day + '_out'] = userData.attendanceData[count].attendance_date.substring(0, 19);
            }
          }
        }
        if (userData.absenceData.length) {
          for (let count = 0; count < userData.absenceData.length; count++) {
            day = userData.absenceData[count].absence_date.substring(8, 10);
            if (day == targetDay && userData.absenceData[count].absence_flg == 1) {
              absenceList[day] = {
                date: userData.absenceData[count].absence_date.substring(0, 19),
                reason: userData.absenceData[count].absence_reason,
              };
              absenceFlg = day;
            }
          }
        }
        if (userData.delayData.length) {
          for (let count = 0; count < userData.delayData.length; count++) {
            day = userData.delayData[count].delay_date.substring(8, 10);
            if (day == targetDay && userData.delayData[count].delay_flg == 1) {
              delayList[day] = {
                date: userData.delayData[count].delay_date.substring(0, 19),
                reason: userData.delayData[count].delay_reason,
              };
              delayFlg = day;
            }
          }
        }
        if (comeFlg == targetDay) {
          calendarHtml += `<td class="clndr-td" id="come" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
          dayCount++;
        } else if (delayFlg == targetDay) {
          calendarHtml += `<td class="clndr-td" id="delay" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
          dayCount++;
        } else if (absenceFlg == targetDay) {
          calendarHtml += `<td class="clndr-td" id="absence" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
          dayCount++;
        } else {
          calendarHtml += `<td class="clndr-td" id="other" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
          dayCount++;
        }
      }
    }
    calendarHtml += '</tr>';
  }
  calendarHtml += '</table>';
  return calendarHtml;
}

/**
 * @param {event} e
 */
function moveCalendar(e) {
  comeList = {};
  delayList = {};
  absenceList = {};
  document.querySelector('#calendar').innerHTML = '';
  if (e.target.id === 'prev') {
    month--;
    if (month < 1) {
      year--;
      month = 12;
    }
  }
  if (e.target.id === 'next') {
    month++;
    if (month > 12) {
      year++;
      month = 1;
    }
  }
  getData(year, month);
}
document.querySelector('#prev').addEventListener('click', moveCalendar);
document.querySelector('#next').addEventListener('click', moveCalendar);
// 日付クリック時イベント
document.addEventListener('click', function(e) {
  const clickDay = String(e.target.dataset.date).substr(-2, 2).replace('/', '0');
  if (delayList[clickDay]) {
    Swal.fire(
        e.target.dataset.date,
        delayList[clickDay].reason,
    );
  } else if (absenceList[clickDay]) {
    Swal.fire(
        e.target.dataset.date,
        absenceList[clickDay].reason,
    );
  } else if (comeList[clickDay + '_in']) {
    if (comeList[clickDay + '_out']) {
      Swal.fire({
        title: e.target.dataset.date,
        html:
        '　IN:　' + comeList[clickDay + '_in'].substr(11, 18) + '<br>' +
        'OUT:　' + comeList[clickDay + '_out'].substr(11, 18),
      });
    } else {
      Swal.fire({
        title: e.target.dataset.date,
        html:
        'IN:　' + comeList[clickDay + '_in'].substr(11, 18) + '<br>' +
        'OUT:　' + ' 未登録 ',
      });
    }
  } else if (comeList[clickDay + '_out']) {
    Swal.fire({
      title: e.target.dataset.date,
      html:
      'IN:　' + '未登録' + '<br>' +
      'OUT:　' + comeList[clickDay + '_out'].substr(11, 18) + '<br>',
    });
  } else if (e.target.dataset.date) {
    Swal.fire({
      title: e.target.dataset.date,
      html:
      'IN:　' + '未登録' + '<br>' +
      'OUT:　' + '未登録' + '<br>',
    });
  }
});

/**
 * @param {number} year
 * @param {number} month
 */
function getData(year, month) {
  fetch('/db/getuserattendance', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      year: year,
      month: month,
      id: userId,
    }),
  }).then((res) => {
    return res.json();
  }).then((userData) => {
    AlluserData = userData;
    showCalendar(year, month, userData);
  }).catch((err) => {

  });
}

getData(year, month);
