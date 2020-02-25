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
    fetch('/db/addDelay', {
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
    fetch('/db/addAbsence', {
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

/**
 * 遅刻予定削除関数
 * @param {String} delay_date
 */
function deleteDelayModal(delay_date) { // eslint-disable-line
  Swal.fire({
    title: '遅刻予定を削除します',
    text: '※削除の処理は取り消せません',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'OK',
  }).then((result) => {
    if (result.value) {
      fetch('/db/deleteDelay', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          date: delay_date,
        }),
      }).then((res) => {
        Swal.fire({
          title: '削除完了',
          html: '遅刻情報を削除しました',
          type: 'success',
          icon: 'success',
          onAfterClose: () => {
            location.reload();
          },
        });
      }).catch((err) => {
        Swal.fire(
            'ERROR',
            '予期せぬエラーが発生しました。',
            'error',
        );
      });
    }
  });
}

/**
 * 欠席予定削除関数
* @param {String} absence_date
 */
function deleteAbsenceModal(absence_date) { // eslint-disable-line
  Swal.fire({
    title: '欠席予定を削除します',
    text: '※削除の処理は取り消せません',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'OK',
  }).then((result) => {
    if (result.value) {
      fetch('/db/deleteAbsence', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          date: absence_date,
        }),
      }).then((res) => {
        Swal.fire({
          title: '削除完了',
          html: '欠席情報を削除しました',
          type: 'success',
          icon: 'success',
          onAfterClose: () => {
            location.reload();
          },
        });
      }).catch((err) => {
        Swal.fire(
            'ERROR',
            '予期せぬエラーが発生しました。',
            'error',
        );
      });
    }
  });
}
