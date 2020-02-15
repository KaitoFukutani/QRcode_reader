/**
 * 遅刻登録モーダル
 */
function AddDelayModal() { // eslint-disable-line
  const reason = $('#delay_reason').val();
  const date = $('#delay_date').val();
  const dt = new Date();
  const y = dt.getFullYear();
  const m = ('00' + (dt.getMonth()+1)).slice(-2);
  const d = ('00' + dt.getDate()).slice(-2);
  const date2 = y + '-' + m + '-' + d;
  if (reason.length > 100) {
    Swal.fire(
        'ERROR',
        '文字数が超過しています。',
        'error',
    );
  } else if (Date.parse(date) < Date.parse(date2)) {
    Swal.fire(
        'ERROR',
        '過去の日程を選択できません。',
        'error',
    );
  } else if (
    reason == null || reason == '' ||
    date == null || date == ''
  ) {
    Swal.fire(
        'ERROR',
        '未入力の項目があります。',
        'error',
    );
  } else {
    fetch('/db/adddelay', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        reason: reason,
        date: date,
      }),
    }).then((res) => {
      Swal.fire(
          'SUCCESS',
          '遅刻の登録が完了しました。',
          'success',
      );
    }).catch((err) => {
      Swal.fire(
          'ERROR',
          '予期せぬエラーが発生しました。',
          'error',
      );
    });
  }
}

/**
 * 欠席登録モーダル
 */
function AddAbsenceModal() { // eslint-disable-line
  const reason = $('#absence_reason').val();
  const date = $('#absence_date').val();
  const dt = new Date();
  const y = dt.getFullYear();
  const m = ('00' + (dt.getMonth()+1)).slice(-2);
  const d = ('00' + dt.getDate()).slice(-2);
  const date2 = y + '-' + m + '-' + d;
  if (reason.length > 100) {
    Swal.fire(
        'ERROR',
        '文字数が超過しています。',
        'error',
    );
  } else if (Date.parse(date) < Date.parse(date2)) {
    Swal.fire(
        'ERROR',
        '過去の日程を選択できません。',
        'error',
    );
  } else if (
    reason == null || reason == '' ||
    date == null || date == ''
  ) {
    Swal.fire(
        'ERROR',
        '未入力の項目があります。',
        'error',
    );
  } else {
    fetch('/db/addabsence', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        reason: reason,
        date: date,
      }),
    }).then((res) => {
      Swal.fire(
          'SUCCESS',
          '欠席の登録が完了しました。',
          'success',
      );
    }).catch((err) => {
      Swal.fire(
          'ERROR',
          '予期せぬエラーが発生しました。',
          'error',
      );
    });
  }
}
